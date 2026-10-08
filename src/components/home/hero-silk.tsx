"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
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

// Client island for the Home hero: the silk canvas and its Pause/Play toggle.
// Until WebGL is confirmed the toggle is not rendered, so with no JavaScript,
// no WebGL or a lost context the hero-silk static glow shows on its own.
export function HeroSilk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const silkRef = useRef<Silk | null>(null);
  const timeRef = useRef(SILK_START_TIME);
  const [supported, setSupported] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const silk = canvas ? createSilk(canvas) : null;
    if (!canvas || !silk) return;
    silkRef.current = silk;
    silk.resize();
    setSupported(true);
    setPaused(readMotionPaused());

    const resizer = new ResizeObserver(() => silk.resize());
    resizer.observe(canvas);
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

    return () => {
      resizer.disconnect();
      viewer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
    };
  }, []);

  const running = supported && !paused && inView && pageVisible;

  useEffect(() => {
    const silk = silkRef.current;
    if (!running || !silk) return;
    let previous = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const elapsed = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      timeRef.current += elapsed * SILK_TIME_SCALE;
      silk.draw(timeRef.current);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const label = paused ? homeHero.motion.play : homeHero.motion.pause;

  return (
    <>
      <canvas
        ref={canvasRef}
        hidden={!supported}
        className="absolute inset-0 -z-1 size-full"
      />
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
