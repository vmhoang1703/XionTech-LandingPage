"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { readMotionPaused } from "@/lib/motion/motion-preference";
import { ROOT_MARGIN } from "./scroll-reveal";

// Runs `start` once the page has a quiet moment (at most 800ms later), so the
// count does not start while the page is still busy starting up. Returns a
// cancel function.
function whenIdle(start: () => void) {
  if (window.requestIdleCallback) {
    const idle = window.requestIdleCallback(start, { timeout: 800 });
    return () => window.cancelIdleCallback(idle);
  }
  const timer = window.setTimeout(start, 200);
  return () => window.clearTimeout(timer);
}

const COUNT_MS = 1600;
// Ease-out cubic: fast at first, settling on the number.
const easeOut = (t: number) => 1 - (1 - t) ** 3;

// Counts the figure from 0 to `to`, one frame at a time, by at most a 30th of
// the number a frame (1 for every figure we show), so a slow phone that drops
// frames still shows 0, 1, 2 … and catches up after. Returns a cancel.
function count(figure: HTMLElement, to: number) {
  const step = Math.max(1, Math.ceil(to / 30));
  let shown = 0;
  let start: number | undefined;
  let frame = 0;
  const tick = (now: number) => {
    start ??= now;
    const target = Math.round(
      to * easeOut(Math.min(1, (now - start) / COUNT_MS)),
    );
    shown = Math.min(target, shown + step);
    figure.style.setProperty("--count", String(shown));
    if (shown < to) frame = requestAnimationFrame(tick);
  };
  // 0 first: leaving "wait" alone would show the number for a frame.
  figure.style.setProperty("--count", "0");
  figure.dataset.count = "play";
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

// A figure that counts up from 0 (globals.css, "Count-up"). The real number is
// always in the HTML; CSS draws the count over it, so the width never changes.
// It starts held at 0 ("wait") and counts ("play") once it is in view and the
// page has a quiet moment, one step a frame at most, so every number shows
// (lead, 2026-10-13). A saved Pause
// shows the plain number ("off"); under reduced motion CSS never counts, and
// with no script the layout's <noscript> style shows the number.
export function CountUp({ value }: Readonly<{ value: string }>) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const figure = ref.current;
    if (!figure || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    if (readMotionPaused()) {
      figure.dataset.count = "off";
      return;
    }
    let cancelStart = () => {};
    let cancelCount = () => {};
    const observer = new IntersectionObserver(
      (entries) => {
        // A fast scroll can deliver several entries at once: the last is now.
        if (!entries.at(-1)?.isIntersecting) return;
        observer.disconnect();
        cancelStart = whenIdle(() => {
          cancelCount = count(figure, Number.parseInt(value, 10));
        });
      },
      { rootMargin: ROOT_MARGIN },
    );
    observer.observe(figure);
    return () => {
      observer.disconnect();
      cancelStart();
      cancelCount();
    };
  }, [value]);

  return (
    <span
      ref={ref}
      className="count-up"
      data-count="wait"
      style={{ "--to": value } as CSSProperties}
    >
      {value}
    </span>
  );
}
