"use client";

import { useEffect, useState } from "react";
import { useMotionPaused } from "@/lib/motion/use-motion-paused";

export const ROTATE_INTERVAL_MS = 3500;

// The Services hero word that changes every 3.5s (globals.css, "Rotating
// word"). All words sit in one grid cell, so the slot is as wide as the
// longest and nothing around it moves. The first word shows at once and
// stays under reduced motion or a saved Pause. The layer is aria-hidden: the
// H1 carries a stable accessible name.
export function RotatingWord({
  words,
  suffix = "",
}: Readonly<{ words: readonly string[]; suffix?: string }>) {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const paused = useMotionPaused();

  useEffect(() => {
    if (words.length < 2 || paused) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const stop = () => {
      if (timer !== undefined) clearInterval(timer);
      timer = undefined;
    };
    const start = () => {
      stop();
      timer = setInterval(() => {
        setIndex((current) => {
          setPrev(current);
          return (current + 1) % words.length;
        });
      }, ROTATE_INTERVAL_MS);
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [words.length, paused]);

  const stateOf = (i: number) => {
    if (i === index) return "in";
    if (i === prev) return "out";
    return undefined;
  };

  // Words are drawn from data-word by CSS, so they stay out of the text
  // content crawlers and the heading name read (the page adds a static word).
  return (
    <span className="rot-word" aria-hidden="true">
      {words.map((word, i) => (
        <span
          key={word}
          className="rot-item"
          data-state={stateOf(i)}
          data-word={word + suffix}
        />
      ))}
    </span>
  );
}
