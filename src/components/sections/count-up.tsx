"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { readMotionPaused } from "@/lib/motion/motion-preference";
import { ROOT_MARGIN } from "./scroll-reveal";

// Waits for the page to finish loading and go idle, then runs `start`. A phone
// is busy for up to a second while the page loads (frames 250-600ms apart):
// a count that ran then jumped from 0 to 15. Returns a cancel function.
function whenSettled(start: () => void) {
  let idle = 0;
  const run = () => {
    idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 800 })
      : window.setTimeout(start, 200);
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
  return () => {
    window.removeEventListener("load", run);
    if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
    else window.clearTimeout(idle);
  };
}

// A figure that counts up from 0 (globals.css, "Count-up"). The real number is
// always in the HTML; CSS draws the count over it, so the width never changes.
// It starts held at 0 ("wait") and plays ("play") once it is in view and the
// page has settled, so every step shows (lead, 2026-10-13). A saved Pause
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
    let cancel = () => {};
    const observer = new IntersectionObserver(
      (entries) => {
        // A fast scroll can deliver several entries at once: the last is now.
        if (!entries.at(-1)?.isIntersecting) return;
        observer.disconnect();
        cancel = whenSettled(() => {
          figure.dataset.count = "play";
        });
      },
      { rootMargin: ROOT_MARGIN },
    );
    observer.observe(figure);
    return () => {
      observer.disconnect();
      cancel();
    };
  }, []);

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
