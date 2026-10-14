"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/layout/locale-link";
import { homeHero, homeHeroVi } from "@/content/home";
import { pickLocale } from "@/i18n/content";
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
  GLOBE_RADIUS,
  MARK_WIDTH,
  type MarkArea,
  SCENE_REST_TIME,
} from "./globe-mark";

// The scene starts this long after the page has loaded, when the title has
// finished rising in (globals.css, "Hero entrance"). Opening WebGL and building
// the scene took the main thread for about 200 ms right at the start, which held
// back the first screen on a phone (speed pass, 2026-10-14); the static glow
// shows until then.
export const SCENE_DELAY_MS = 2500;

// Below this width .hero-stage sits behind the headline (globals.css) and the
// scene is the short mark-only story, with no globe (lead, 2026-10-13).
const MARK_ONLY_QUERY = "(width < 1080px)";

// The globe and the XT mark form in the hero's .hero-stage box (the right
// column on wide screens, behind the headline on narrow ones), sized so the
// mark fits its width and the globe its height.
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
    markOnly: window.matchMedia?.(MARK_ONLY_QUERY).matches ?? false,
  };
}

// Client island for the Home hero: the silk canvas and its Pause/Play toggle.
// Until WebGL is confirmed the toggle is not rendered, so with no JavaScript,
// no WebGL or a lost context the hero-silk static glow shows on its own.
export function HeroSilk() {
  const { motion } = pickLocale(useLocale(), { en: homeHero, vi: homeHeroVi });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const silkRef = useRef<Silk | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const paintRef = useRef<((time: number) => void) | null>(null);
  const timeRef = useRef(SILK_START_TIME);
  const [started, setStarted] = useState(false);
  const [supported, setSupported] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    let timer = 0;
    const wait = () => {
      timer = window.setTimeout(() => setStarted(true), SCENE_DELAY_MS);
    };
    if (document.readyState === "complete") wait();
    else window.addEventListener("load", wait, { once: true });
    return () => {
      window.removeEventListener("load", wait);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!started) return;
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
    };
    const layout = () => {
      silk.resize();
      globe?.resize(globe ? measureMark(canvas) : null);
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
  }, [started]);

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

  const label = paused ? motion.play : motion.pause;

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
      {supported ? (
        <button
          type="button"
          onClick={() => {
            saveMotionPaused(!paused);
            setPaused(!paused);
          }}
          className="group bg-ink/50 absolute top-[calc(var(--spacing-header-room)+12px)] right-4 z-10 inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-white/30 px-2 text-white opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 sm:right-6 pointer-coarse:h-11 pointer-coarse:min-w-11"
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
