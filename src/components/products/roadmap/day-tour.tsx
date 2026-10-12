"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MapTrifoldIcon,
  PauseIcon,
  PlayIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { Scene, WebGLRenderer, PerspectiveCamera } from "three";
import { appById } from "@/content/apps";
import { dayRoad, journeyMap } from "@/content/products";
import {
  readMotionPaused,
  saveMotionPaused,
} from "@/lib/motion/motion-preference";
import { MapBadge } from "../map/map-badge";
import { useHydrated } from "../use-hydrated";
import { RoadStopDialog } from "./road-stop-dialog";
import type * as Tour from "./tour-scene";

// The school day as a guided 3D tour. The camera starts over the whole
// island and glides from stop to stop; each stop's sign floats over its set
// piece. The glass card and the control bar are real HTML, so every input
// works; clicking a sign or "Explore" opens the stop's modal. Without WebGL
// the still road shows under the same controls; without JavaScript, a list.

const MAX_PIXEL_RATIO = 2;
const OVERVIEW = -1;
const LAST = dayRoad.stops.length - 1;
const DWELL_MS = 4800;
const OVERVIEW_DWELL_MS = 3600;

type Stage = {
  tour: ReturnType<typeof Tour.buildTour>;
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
};

// Same rule as the scene's timeOfDay, kept here so the page bundle does not
// pull in three.js.
function timeOfDay(index: number) {
  if (index >= 5) return "afternoon";
  if (index >= 3) return "midday";
  return "morning";
}

const after = (index: number) => (index >= LAST ? OVERVIEW : index + 1);

function readFonts(): Tour.Fonts {
  const css = getComputedStyle(document.documentElement);
  const body = getComputedStyle(document.body).fontFamily || "sans-serif";
  const get = (name: string) => css.getPropertyValue(name).trim() || body;
  return {
    display: get("--font-display"),
    body: get("--font-body"),
    mono: get("--font-mono"),
  };
}

export function DayTour() {
  const hydrated = useHydrated();
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<Stage | null>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "fallback">("idle");
  const [active, setActive] = useState(OVERVIEW);
  const [playing, setPlaying] = useState(false);
  const [moving, setMoving] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [open, setOpen] = useState<number | null>(null);
  const activeRef = useRef(OVERVIEW);
  const playingRef = useRef(false);
  const reducedRef = useRef(false);
  const ready = status === "ready";

  const draw = () => {
    const stage = stageRef.current;
    if (stage) stage.renderer.render(stage.scene, stage.camera);
  };

  // Move the tour to a stop (or the overview).
  const select = (index: number) => {
    activeRef.current = index;
    setActive(index);
    stageRef.current?.tour.go(index, reducedRef.current);
    setMoving(true);
  };
  const selectRef = useRef(select);
  useEffect(() => {
    selectRef.current = select;
  });

  const resize = () => {
    const stage = stageRef.current;
    const host = hostRef.current;
    if (!stage || !host) return;
    const { width, height } = host.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    stage.renderer.setSize(width, height, false);
    stage.tour.resize(width / height);
    stage.tour.tick(0, false);
    draw();
  };

  const resizeRef = useRef(resize);
  useEffect(() => {
    resizeRef.current = resize;
  });

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    let alive = true;

    const load = async () => {
      try {
        if (!canvas.getContext("webgl2")) throw new Error("WebGL2 unavailable");
        const [three, tourModule] = await Promise.all([
          import("three"),
          import("./tour-scene"),
          document.fonts.ready,
        ]);
        if (!alive) return;
        const renderer = new three.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
        });
        renderer.setPixelRatio(Math.min(devicePixelRatio, MAX_PIXEL_RATIO));
        renderer.shadowMap.enabled = innerWidth >= 640;
        renderer.toneMapping = three.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        const tour = tourModule.buildTour(readFonts());
        stageRef.current = {
          tour,
          renderer,
          scene: tour.scene,
          camera: tour.camera,
        };
        reducedRef.current = matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const play = !readMotionPaused();
        playingRef.current = play;
        setPlaying(play);
        setStatus("ready");
        setMoving(true);
      } catch (error) {
        console.warn("School-day tour: showing the still road", error);
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
      console.warn("School-day tour: WebGL context lost");
      setStatus("fallback");
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    const sizer = new ResizeObserver(() => resizeRef.current());
    sizer.observe(host);

    return () => {
      alive = false;
      loader.disconnect();
      viewer.disconnect();
      sizer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      stageRef.current?.tour.dispose();
      stageRef.current?.renderer.dispose();
      stageRef.current = null;
    };
  }, []);

  // Size once the scene is ready; free it if the context is lost.
  useEffect(() => {
    if (status === "ready") resizeRef.current();
    if (status === "fallback" && stageRef.current) {
      stageRef.current.tour.dispose();
      stageRef.current.renderer.dispose();
      stageRef.current = null;
    }
  }, [status]);

  const running = ready && inView && pageVisible && (playing || moving);

  // The frame loop: glide, idle motion while playing, and the auto-tour.
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    let dwell = 0;
    const loop = (now: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const dt = Math.max(0, now - last);
      last = now;
      const busy = stage.tour.tick(
        dt,
        playingRef.current && !reducedRef.current,
      );
      draw();
      if (playingRef.current) {
        dwell = busy ? 0 : dwell + dt;
        const wait =
          activeRef.current === OVERVIEW ? OVERVIEW_DWELL_MS : DWELL_MS;
        if (dwell > wait) {
          dwell = 0;
          selectRef.current(after(activeRef.current));
        }
      } else if (!busy) {
        setMoving(false);
        return;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const toggle = () => {
    const next = !playing;
    playingRef.current = next;
    setPlaying(next);
    saveMotionPaused(!next);
  };

  // Clicking a sign or a set piece opens that stop.
  const pointAt = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const stage = stageRef.current;
    const box = event.currentTarget.getBoundingClientRect();
    if (!stage) return null;
    return stage.tour.pick(
      ((event.clientX - box.left) / box.width) * 2 - 1,
      -((event.clientY - box.top) / box.height) * 2 + 1,
    );
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (open !== null) return;
    if (event.key === "ArrowRight" && active < LAST) select(active + 1);
    if (event.key === "ArrowLeft" && active > OVERVIEW) select(active - 1);
  };

  const time = timeOfDay(active);

  return (
    <div className="tour" onKeyDown={onKeyDown}>
      <div ref={hostRef} className="tour-stage" data-time={time}>
        <canvas
          ref={canvasRef}
          className="tour-scene"
          aria-hidden="true"
          hidden={!ready}
          onPointerMove={(event) => {
            event.currentTarget.style.cursor =
              pointAt(event) === null ? "" : "pointer";
          }}
          onClick={(event) => {
            const index = pointAt(event);
            if (index === null) return;
            select(index);
            setOpen(index);
          }}
        />
        {ready ? null : <StillRoad />}

        <TourCard
          active={active}
          onBegin={() => select(0)}
          onExplore={() => setOpen(active)}
        />
        <TourBar
          active={active}
          ready={ready}
          playing={playing}
          onSelect={select}
          onToggle={toggle}
        />
      </div>

      {hydrated ? null : (
        <ol className="tour-list">
          {dayRoad.stops.map((one, i) => (
            <li key={one.id}>
              <span className="tour-kicker">
                {i + 1}
                {one.time ? ` · ${one.time}` : ""}
              </span>
              <h3>{one.title}</h3>
              <p>{one.text}</p>
            </li>
          ))}
        </ol>
      )}

      <RoadStopDialog
        index={open}
        onMove={(index) => {
          select(index);
          setOpen(index);
        }}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}

// The still road for browsers without WebGL.
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
      className="tour-still"
      viewBox="0 0 680 300"
      aria-hidden="true"
      focusable="false"
    >
      <path className="tour-still-path" d={path} />
      <path className="tour-still-line" d={path} />
      {stations.map((s) => (
        <circle
          key={s.x}
          className="tour-still-stop"
          cx={s.x}
          cy={s.y}
          r="12"
        />
      ))}
    </svg>
  );
}

// The glass card: the current stop, or the whole day before the tour starts.
function TourCard({
  active,
  onBegin,
  onExplore,
}: Readonly<{ active: number; onBegin: () => void; onExplore: () => void }>) {
  const stop = active === OVERVIEW ? null : dayRoad.stops[active];
  const app = stop?.app ? appById(stop.app) : null;
  return (
    <div className="tour-card" aria-live="polite">
      {stop ? (
        <>
          <p className="tour-kicker">
            {dayRoad.tour.step(active + 1, dayRoad.stops.length)}
            {stop.time ? ` · ${stop.time}` : ""}
          </p>
          <h2 className="tour-title">{stop.title}</h2>
          <p className="tour-text">{stop.text}</p>
          {app ? (
            <p className="tour-app">
              <MapBadge badge={app.badge} />
              {app.shortName}
            </p>
          ) : null}
          <button
            type="button"
            className="btn btn-primary tour-cta"
            aria-haspopup="dialog"
            onClick={onExplore}
          >
            {dayRoad.tour.explore}
            <ArrowRightIcon aria-hidden="true" />
          </button>
        </>
      ) : (
        <>
          <p className="tour-kicker">
            {dayRoad.start} {dayRoad.stops[0].time} → {dayRoad.finish}{" "}
            {dayRoad.stops[LAST].time}
          </p>
          <h2 className="tour-title">{dayRoad.heading}</h2>
          <p className="tour-text">{dayRoad.lede}</p>
          <button
            type="button"
            className="btn btn-primary tour-cta"
            onClick={onBegin}
          >
            {dayRoad.tour.begin}
            <ArrowRightIcon aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}

// The control bar: previous, a dot per stop (and the overview), next, and
// Play/Pause once the scene is ready.
function TourBar({
  active,
  ready,
  playing,
  onSelect,
  onToggle,
}: Readonly<{
  active: number;
  ready: boolean;
  playing: boolean;
  onSelect: (index: number) => void;
  onToggle: () => void;
}>) {
  return (
    <nav className="tour-bar" aria-label={dayRoad.tour.controls}>
      <button
        type="button"
        className="tour-arrow"
        disabled={active === OVERVIEW}
        onClick={() => onSelect(active - 1)}
      >
        <ArrowLeftIcon aria-hidden="true" />
        <span className="sr-only">{dayRoad.tour.previous}</span>
      </button>
      <ol className="tour-dots">
        <li>
          <button
            type="button"
            className="tour-dot"
            aria-current={active === OVERVIEW ? "step" : undefined}
            onClick={() => onSelect(OVERVIEW)}
          >
            <MapTrifoldIcon aria-hidden="true" />
            <span className="sr-only">{dayRoad.tour.overview}</span>
          </button>
        </li>
        {dayRoad.stops.map((one, i) => (
          <li key={one.id}>
            <button
              type="button"
              className="tour-dot"
              aria-current={active === i ? "step" : undefined}
              onClick={() => onSelect(i)}
            >
              {i + 1}
              <span className="sr-only">
                {one.time ? ` ${one.time}` : ""} {one.title}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="tour-arrow"
        disabled={active === LAST}
        onClick={() => onSelect(active + 1)}
      >
        <ArrowRightIcon aria-hidden="true" />
        <span className="sr-only">{dayRoad.tour.next}</span>
      </button>
      {ready ? (
        <button type="button" className="tour-toggle" onClick={onToggle}>
          {playing ? (
            <PauseIcon aria-hidden="true" weight="fill" />
          ) : (
            <PlayIcon aria-hidden="true" weight="fill" />
          )}
          {playing ? journeyMap.motion.pause : journeyMap.motion.play}
        </button>
      ) : null}
    </nav>
  );
}
