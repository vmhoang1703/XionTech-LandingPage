"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { OrthographicCamera, Scene, WebGLRenderer } from "three";
import { journeyMap } from "@/content/products";
import {
  readMotionPaused,
  saveMotionPaused,
} from "@/lib/motion/motion-preference";
import type * as Journey from "./journey-scene";
import { MapBadge } from "./map-badge";
import { openAppDialog } from "./open-app-dialog";

// Client island for the journey map: the isometric three.js scene with one
// real button per app laid over its island. three.js loads only once the map
// nears the viewport. Until the scene is ready, and with no JavaScript, no
// WebGL or a lost context, the still SVG map shows under the same buttons.

const MAX_PIXEL_RATIO = 2;
const SHADOW_MIN_WIDTH = 640;

type PlaceId = (typeof journeyMap.places)[number]["id"];
type Spot = { left: number; top: number };

// Where the buttons sit over the SVG map (percent of the stage).
const STILL_SPOTS: Record<PlaceId, Spot> = {
  "parent-hub": { left: 25, top: 30 },
  "staff-hub": { left: 75, top: 30 },
  "ai-tutor": { left: 25, top: 72 },
  iot: { left: 75, top: 72 },
};

type Stage = {
  journey: typeof Journey;
  renderer: WebGLRenderer;
  scene: Scene;
  camera: OrthographicCamera;
  tick: (ms: number) => void;
  lift: (id: PlaceId | null, instant: boolean) => void;
  dispose: () => void;
};

type Status = "idle" | "ready" | "fallback";

export function JourneyCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<Stage | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [paused, setPaused] = useState(true);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [spots, setSpots] = useState(STILL_SPOTS);
  const [resizes, setResizes] = useState(0);
  const ready = status === "ready";

  const draw = () => {
    const stage = stageRef.current;
    if (stage) stage.renderer.render(stage.scene, stage.camera);
  };

  // Fit the renderer and camera to the stage and move the buttons onto the
  // islands.
  const resize = () => {
    const stage = stageRef.current;
    const host = hostRef.current;
    if (!stage || !host) return;
    const { width, height } = host.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    stage.renderer.setSize(width, height, false);
    stage.journey.frameCamera(stage.camera, width / height);
    const next = { ...STILL_SPOTS };
    for (const { id } of journeyMap.places) {
      const point = stage.journey.islandAnchor(id).project(stage.camera);
      next[id] = {
        left: ((point.x + 1) / 2) * 100,
        top: ((1 - point.y) / 2) * 100,
      };
    }
    setSpots(next);
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
        const [three, journey] = await Promise.all([
          import("three"),
          import("./journey-scene"),
        ]);
        if (!alive) return;
        const renderer = new three.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
        });
        renderer.setPixelRatio(Math.min(devicePixelRatio, MAX_PIXEL_RATIO));
        renderer.shadowMap.enabled = innerWidth >= SHADOW_MIN_WIDTH;
        const built = journey.buildJourney();
        const camera = new three.OrthographicCamera();
        stageRef.current = {
          journey,
          renderer,
          scene: built.scene,
          camera,
          tick: built.tick,
          lift: built.lift,
          dispose: () => {
            built.dispose();
            renderer.dispose();
          },
        };
        setPaused(readMotionPaused());
        setStatus("ready");
      } catch (error) {
        console.warn("Journey map: showing the still map", error);
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
      console.warn("Journey map: WebGL context lost");
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

  // Size once the scene is ready, and free it when the context is lost.
  useEffect(() => {
    if (status === "ready") resize();
    if (status === "fallback" && stageRef.current) {
      stageRef.current.dispose();
      stageRef.current = null;
    }
  }, [status]);

  const running = ready && inView && pageVisible && !paused;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      stageRef.current?.tick(now - last);
      last = now;
      draw();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  // Still frame when paused, after a resize, or when the scene first loads.
  useEffect(() => {
    if (ready && !running) draw();
  }, [ready, running, resizes]);

  const lift = (id: PlaceId | null) => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.lift(id, paused);
    if (!running) draw();
  };

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    saveMotionPaused(next);
  };

  return (
    <div
      ref={hostRef}
      className="map-stage"
      data-paused={ready && paused ? "true" : undefined}
    >
      <canvas
        ref={canvasRef}
        className="map-scene"
        aria-hidden="true"
        hidden={!ready}
      />
      {ready ? null : <StillMap />}
      <ul className="map-places">
        {journeyMap.places.map((place) => {
          const spot = (ready ? spots : STILL_SPOTS)[place.id];
          return (
            <li
              key={place.id}
              className="map-place"
              style={{ left: `${spot.left}%`, top: `${spot.top}%` }}
            >
              <button
                type="button"
                className="map-pin"
                aria-haspopup="dialog"
                onClick={(event) =>
                  openAppDialog(place.anchor, event.currentTarget)
                }
                onPointerEnter={() => lift(place.id)}
                onPointerLeave={() => lift(null)}
                onFocus={() => lift(place.id)}
                onBlur={() => lift(null)}
              >
                <MapBadge badge={place.badge} />
                <span className="map-name">
                  <span className="sr-only">Open </span>
                  {place.name}
                  <span className="sr-only"> details</span>
                </span>
              </button>
              <p className="map-tagline">{place.tagline}</p>
            </li>
          );
        })}
      </ul>
      {ready ? (
        <button
          type="button"
          className="map-toggle"
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
    </div>
  );
}

// The still isometric map: the hub and four islands joined by dashed roads,
// drawn where the buttons sit.
function StillMap() {
  const tile = (cx: number, cy: number, size: number) =>
    `${cx},${cy - size / 2} ${cx + size},${cy} ${cx},${cy + size / 2} ${cx - size},${cy}`;
  const hub = { x: 300, y: 205 };
  const places = Object.values(STILL_SPOTS).map(({ left, top }) => ({
    x: left * 6,
    y: top * 4.1 + 30,
  }));
  return (
    <svg
      className="map-still"
      viewBox="0 0 600 410"
      aria-hidden="true"
      focusable="false"
    >
      {places.map((p) => (
        <line
          key={`road-${p.x}-${p.y}`}
          className="map-road"
          x1={hub.x}
          y1={hub.y}
          x2={p.x}
          y2={p.y}
        />
      ))}
      <polygon className="map-island" points={tile(hub.x, hub.y, 70)} />
      <text className="map-hub" x={hub.x} y={hub.y + 6}>
        {journeyMap.hub}
      </text>
      {places.map((p) => (
        <polygon
          key={`island-${p.x}-${p.y}`}
          className="map-island"
          points={tile(p.x, p.y, 60)}
        />
      ))}
    </svg>
  );
}
