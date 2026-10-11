"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { readMotionPaused } from "@/lib/motion/motion-preference";
import { ROOT_MARGIN } from "./scroll-reveal";

// A figure that counts up from 0 (globals.css, "Count-up"). The real number is
// always in the HTML; CSS draws the count over it, so the width never changes.
// On screen at load, CSS counts at first paint with no script. Below the
// screen, this script holds it at 0 ("wait") and plays it as it comes into
// view, with the scroll reveal. A saved Pause shows the plain number ("off");
// under reduced motion CSS never counts.
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          figure.dataset.count = "wait";
          return;
        }
        // In view: play a held count; one on screen at load already counted.
        if (figure.dataset.count === "wait") figure.dataset.count = "play";
        observer.disconnect();
      },
      { rootMargin: ROOT_MARGIN },
    );
    observer.observe(figure);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className="count-up"
      style={{ "--to": value } as CSSProperties}
    >
      {value}
    </span>
  );
}
