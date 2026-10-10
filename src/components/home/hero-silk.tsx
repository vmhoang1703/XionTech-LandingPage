"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { homeHero } from "@/content/home";
import {
  readMotionPaused,
  saveMotionPaused,
} from "@/lib/motion/motion-preference";
import {
  createSilk,
  SILK_START_TIME,
  SILK_TIME_SCALE,
  type Silk,
} from "./silk-shader";
import {
  createGlobeMark,
  frameAt,
  GLOBE_RADIUS,
  MARK_WIDTH,
  type MarkArea,
  SCENE_REST_TIME,
  sceneIndex,
  sceneJumpTime,
} from "./globe-mark";

// The globe and the XT mark form in the hero's .hero-stage box (the right
// column on wide screens), sized so the mark fits its width and the globe its
// height; the stage is hidden on narrow screens, so there is no scene there.
function measureMark(canvas: HTMLCanvasElement): MarkArea {
  const stage = canvas.parentElement?.querySelector(".hero-stage");
  if (!stage) return null;
  const box = canvas.getBoundingClientRect();
  const area = stage.getBoundingClientRect();
  const size = Math.min(
    area.width / MARK_WIDTH,
    area.height / (2 * GLOBE_RADIUS),
  );
  if (size < 110) return null;
  return {
    x: area.left + area.width / 2 - box.left,
    y: area.top + area.height / 2 - box.top,
    size,
  };
}

// Client island for the Home hero: the silk canvas and its Pause/Play toggle.
// Until WebGL is confirmed the toggle is not rendered, so with no JavaScript,
// no WebGL or a lost context the hero-silk static glow shows on its own.
export function HeroSilk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const silkRef = useRef<Silk | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const paintRef = useRef<((time: number) => void) | null>(null);
  const timeRef = useRef(SILK_START_TIME);
  const [supported, setSupported] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  // The scene showing (0..2); the ref keeps paint from re-rendering React
  // on every frame.
  const sceneRef = useRef(2);
  const [scene, setScene] = useState(2);
  // The stage, when the scene has room in it: the progress dots render
  // inside it, so they follow the copy in reading (and Tab) order.
  const [stage, setStage] = useState<Element | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const silk = canvas ? createSilk(canvas) : null;
    if (!canvas || !silk) return;
    silkRef.current = silk;
    const particleCanvas = particleCanvasRef.current;
    const globe = particleCanvas ? createGlobeMark(particleCanvas) : null;
    // One frame of both layers; the silk quiets its gold while the globe shows.
    const paint = (time: number) => {
      const shown = globe?.draw(time) ?? 0;
      silk.draw(time, 1 - 0.9 * shown);
      const now = sceneIndex(frameAt(time));
      if (now !== sceneRef.current) {
        sceneRef.current = now;
        setScene(now);
      }
    };
    const layout = () => {
      silk.resize();
      const area = globe ? measureMark(canvas) : null;
      globe?.resize(area);
      setStage(
        area
          ? (canvas.parentElement?.querySelector(".hero-stage") ?? null)
          : null,
      );
      paint(timeRef.current);
    };
    paintRef.current = paint;
    const startPaused = readMotionPaused();
    // A paused start (reduced motion, or a saved Pause) rests on the
    // finished mark rather than the empty first moment.
    if (startPaused) timeRef.current = SCENE_REST_TIME;
    layout();
    setSupported(true);
    setPaused(startPaused);

    const resizer = new ResizeObserver(layout);
    resizer.observe(canvas);
    // Web fonts change the copy's width, so the XT area is measured again.
    document.fonts?.ready.then(layout);
    const viewer = new IntersectionObserver((entries) =>
      setInView(entries[0].isIntersecting),
    );
    viewer.observe(canvas);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    const onContextLost = () => {
      silkRef.current = null;
      setSupported(false);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    // The scene leans a little towards a fine pointer (mouse, pen).
    const hero = canvas.parentElement;
    const fine = window.matchMedia?.("(pointer: fine)").matches ?? false;
    const onPointer = (event: PointerEvent) => {
      const box = hero?.getBoundingClientRect();
      if (!box) return;
      globe?.setPointer(
        ((event.clientX - box.left) / box.width) * 2 - 1,
        ((event.clientY - box.top) / box.height) * 2 - 1,
      );
    };
    const onLeave = () => globe?.setPointer(0, 0);
    if (fine) {
      hero?.addEventListener("pointermove", onPointer);
      hero?.addEventListener("pointerleave", onLeave);
    }

    return () => {
      hero?.removeEventListener("pointermove", onPointer);
      hero?.removeEventListener("pointerleave", onLeave);
      resizer.disconnect();
      viewer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
    };
  }, []);

  const running = supported && !paused && inView && pageVisible;

  useEffect(() => {
    const paint = paintRef.current;
    if (!running || !silkRef.current || !paint) return;
    let previous = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const elapsed = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      timeRef.current += elapsed * SILK_TIME_SCALE;
      paint(timeRef.current);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const label = paused ? homeHero.motion.play : homeHero.motion.pause;

  const showScene = (index: number) => {
    timeRef.current = sceneJumpTime(index, timeRef.current);
    paintRef.current?.(timeRef.current);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        hidden={!supported}
        className="absolute inset-0 -z-1 size-full"
      />
      <canvas
        ref={particleCanvasRef}
        aria-hidden="true"
        hidden={!supported}
        className="pointer-events-none absolute inset-0 -z-1 size-full"
      />
      {supported && stage
        ? createPortal(
            <fieldset className="absolute top-full left-1/2 mt-2.5 flex -translate-x-1/2">
              <legend className="sr-only">{homeHero.scenes.label}</legend>
              {homeHero.scenes.items.map((name, index) => (
                <button
                  key={name}
                  type="button"
                  aria-label={name}
                  aria-current={scene === index ? "step" : undefined}
                  onClick={() => showScene(index)}
                  className="group grid size-6 place-items-center rounded-full"
                >
                  <span
                    aria-hidden="true"
                    className={`block size-1.5 rounded-full transition-[transform,background-color] duration-300 motion-reduce:transition-none ${scene === index ? "bg-amber scale-150" : "bg-white/45 group-hover:bg-white/80"}`}
                  />
                </button>
              ))}
            </fieldset>,
            stage,
          )
        : null}
      {supported ? (
        <button
          type="button"
          onClick={() => {
            saveMotionPaused(!paused);
            setPaused(!paused);
          }}
          className="group bg-ink/50 absolute top-4 right-4 z-10 inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-white/30 px-2 text-white opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 sm:right-6"
        >
          {paused ? (
            <PlayIcon aria-hidden="true" weight="fill" className="size-4" />
          ) : (
            <PauseIcon aria-hidden="true" weight="fill" className="size-4" />
          )}
          <span className="max-w-0 overflow-hidden whitespace-nowrap transition-[max-width,margin] group-hover:ml-2 group-hover:max-w-50 group-focus-visible:ml-2 group-focus-visible:max-w-50 motion-reduce:transition-none">
            {label}
          </span>
        </button>
      ) : null}
    </>
  );
}
