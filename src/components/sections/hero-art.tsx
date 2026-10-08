"use client";

import { useEffect, useRef } from "react";
import {
  drawStrands,
  STRANDS_RUN_SECONDS,
  STRANDS_START_TIME,
  type StrandTone,
} from "./strands";

// Background art for inner page heroes (Story 1.6): a drifting aurora (CSS)
// and the strand ribbon (canvas). Both are decorative and aria-hidden. The
// ribbon moves for 5 seconds and holds its last frame, skips drawing while the
// hero is off screen, and is drawn once and still under reduced motion.
// Place it as the first child of a `hero-light`, `hero-navy` or `hero-amber`
// section that has the `page-hero` class.
export function HeroArt({ tone }: Readonly<{ tone: StrandTone }>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let visible = true;
    let held = STRANDS_START_TIME;
    const start = performance.now();

    const draw = () => {
      if (visible) drawStrands(ctx, width, height, held, tone);
    };
    const size = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };

    let frame = 0;
    const loop = (now: number) => {
      const elapsed = (now - start) / 1000;
      held = reduce
        ? STRANDS_START_TIME
        : STRANDS_START_TIME + Math.min(elapsed, STRANDS_RUN_SECONDS);
      draw();
      frame =
        !reduce && elapsed < STRANDS_RUN_SECONDS
          ? requestAnimationFrame(loop)
          : 0;
    };

    const resizer = new ResizeObserver(size);
    resizer.observe(canvas);
    // Off screen nothing is drawn; coming back repaints the current frame, so a
    // run that ended or a resize that cleared the canvas off screen still
    // shows the held frame.
    const viewer = new IntersectionObserver((entries) => {
      const wasVisible = visible;
      visible = entries.at(-1)?.isIntersecting ?? true;
      if (visible && !wasVisible) draw();
    });
    viewer.observe(canvas);
    size();
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      viewer.disconnect();
    };
  }, [tone]);

  return (
    <>
      <div aria-hidden="true" className="aurora" />
      <canvas ref={canvasRef} role="presentation" className="strands" />
    </>
  );
}
