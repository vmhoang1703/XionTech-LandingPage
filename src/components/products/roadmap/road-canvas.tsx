"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { OrthographicCamera, Scene, WebGLRenderer } from "three";
import { appById } from "@/content/apps";
import { dayRoad, journeyMap } from "@/content/products";
import {
  readMotionPaused,
  saveMotionPaused,
} from "@/lib/motion/motion-preference";
import { MapBadge } from "../map/map-badge";
import type * as Road from "./road-scene";
import { RoadStopDialog } from "./road-stop-dialog";

// Client island for the school-day roadmap. The six stop cards are one list:
// on wide screens with WebGL ready they sit over their stations in the 3D
// road; otherwise (no JS, no WebGL, narrow screens) they read as a plain
// timeline under the still road.

const MAX_PIXEL_RATIO = 2;
const WIDE = 960;

type Stage = {
  road: typeof Road;
  renderer: WebGLRenderer;
  scene: Scene;
  camera: OrthographicCamera;
  tick: (ms: number) => number;
  showStop: (index: number) => void;
  dispose: () => void;
};

type Spot = { left: number; top: number };

export function RoadCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<Stage | null>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "fallback">("idle");
  const [paused, setPaused] = useState(true);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [spots, setSpots] = useState<Spot[] | null>(null);
  const [active, setActive] = useState(-1);
  const [resizes, setResizes] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const ready = status === "ready";

  const draw = () => {
    const stage = stageRef.current;
    if (stage) stage.renderer.render(stage.scene, stage.camera);
  };

  const resize = () => {
    const stage = stageRef.current;
    const host = hostRef.current;
    if (!stage || !host) return;
    const { width, height } = host.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    stage.renderer.setSize(width, height, false);
    stage.road.frameCamera(stage.camera, width / height);
    setSpots(
      innerWidth >= WIDE
        ? dayRoad.stops.map((_, i) => {
            const point = stage.road.stopAnchor(i).project(stage.camera);
            return {
              left: ((point.x + 1) / 2) * 100,
              top: ((1 - point.y) / 2) * 100,
            };
          })
        : null,
    );
    setResizes((n) => n + 1);
  };

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    let alive = true;

    const load = async () => {
      try {
        if (!canvas.getContext("webgl2")) throw new Error("WebGL2 unavailable");
        const [three, road] = await Promise.all([
          import("three"),
          import("./road-scene"),
        ]);
        if (!alive) return;
        const renderer = new three.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
        });
        renderer.setPixelRatio(Math.min(devicePixelRatio, MAX_PIXEL_RATIO));
        renderer.shadowMap.enabled = innerWidth >= 640;
        const built = road.buildRoad();
        stageRef.current = {
          road,
          renderer,
          scene: built.scene,
          camera: new three.OrthographicCamera(),
          tick: built.tick,
          showStop: built.showStop,
          dispose: () => {
            built.dispose();
            renderer.dispose();
          },
        };
        setPaused(readMotionPaused());
        setStatus("ready");
      } catch (error) {
        console.warn("Day roadmap: showing the still road", error);
        if (alive) setStatus("fallback");
      }
    };

    const loader = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        loader.disconnect();
        void load();
      },
      { rootMargin: "50% 0px" },
    );
    loader.observe(host);
    const viewer = new IntersectionObserver((entries) =>
      setInView(entries.at(-1)?.isIntersecting === true),
    );
    viewer.observe(host);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    const onContextLost = () => {
      console.warn("Day roadmap: WebGL context lost");
      setStatus("fallback");
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    const sizer = new ResizeObserver(() => resize());
    sizer.observe(host);

    return () => {
      alive = false;
      loader.disconnect();
      viewer.disconnect();
      sizer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      stageRef.current?.dispose();
      stageRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (status === "ready") resize();
    if (status === "fallback" && stageRef.current) {
      stageRef.current.dispose();
      stageRef.current = null;
      setSpots(null);
    }
  }, [status]);

  const running = ready && inView && pageVisible && !paused;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    let shown = -2;
    const loop = (now: number) => {
      const stop = stageRef.current?.tick(now - last) ?? -1;
      last = now;
      if (stop !== shown) {
        shown = stop;
        setActive(stop);
      }
      draw();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  useEffect(() => {
    if (ready && !running) draw();
  }, [ready, running, resizes, active]);

  const choose = (index: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.showStop(index);
    setActive(index);
  };

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    saveMotionPaused(next);
  };

  const placed = ready && spots !== null;

  return (
    <div className="road" data-placed={placed ? "true" : undefined}>
      <div ref={hostRef} className="road-stage">
        <canvas
          ref={canvasRef}
          className="road-scene"
          aria-hidden="true"
          hidden={!ready}
        />
        {ready ? null : <StillRoad />}
        {ready ? (
          <button
            type="button"
            className="road-toggle"
            aria-pressed={paused}
            onClick={toggle}
          >
            {paused ? (
              <PlayIcon aria-hidden="true" weight="fill" />
            ) : (
              <PauseIcon aria-hidden="true" weight="fill" />
            )}
            {paused ? journeyMap.motion.play : journeyMap.motion.pause}
          </button>
        ) : null}
        <span className="road-end road-end-start" aria-hidden="true">
          {dayRoad.start}
        </span>
        <span className="road-end road-end-finish" aria-hidden="true">
          {dayRoad.finish}
        </span>
      </div>
      <ol className="road-stops">
        {dayRoad.stops.map((stop, i) => {
          const spot = placed ? spots[i] : null;
          const app = stop.app ? appById(stop.app) : null;
          return (
            <li
              key={stop.id}
              className="road-stop"
              data-active={ready ? String(i === active) : undefined}
              data-row={i % 2 === 0 ? "far" : "near"}
              style={
                spot
                  ? { left: `${spot.left}%`, top: `${spot.top}%` }
                  : undefined
              }
              onPointerEnter={() => choose(i)}
            >
              <span className="road-step" aria-hidden="true">
                {i + 1}
              </span>
              {stop.time ? (
                <time className="road-time" dateTime={stop.time}>
                  {stop.time}
                </time>
              ) : null}
              <h3>
                <button
                  type="button"
                  className="road-open"
                  aria-haspopup="dialog"
                  onFocus={() => choose(i)}
                  onClick={() => {
                    choose(i);
                    setOpen(i);
                  }}
                >
                  {stop.title}
                </button>
              </h3>
              <p>{stop.text}</p>
              {app ? (
                <span className="road-app">
                  <MapBadge badge={app.badge} />
                  {app.shortName}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
      <RoadStopDialog
        index={open}
        onMove={(index) => {
          choose(index);
          setOpen(index);
        }}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}

// The still road: a winding path from Start to Finish with six stations.
function StillRoad() {
  const stations = [90, 190, 290, 390, 490, 590].map((x, i) => ({
    x,
    y: i % 2 === 0 ? 120 : 200,
  }));
  const path = `M 20 160 C 50 160 60 ${stations[0].y} ${stations[0].x} ${stations[0].y} ${stations
    .slice(1)
    .map((s) => `S ${s.x - 40} ${s.y} ${s.x} ${s.y}`)
    .join(" ")} S 640 160 660 160`;
  return (
    <svg
      className="road-still"
      viewBox="0 0 680 300"
      aria-hidden="true"
      focusable="false"
    >
      <path className="road-still-path" d={path} />
      <path className="road-still-line" d={path} />
      {stations.map((s) => (
        <circle
          key={s.x}
          className="road-still-stop"
          cx={s.x}
          cy={s.y}
          r="12"
        />
      ))}
    </svg>
  );
}
