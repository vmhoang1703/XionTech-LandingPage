"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { readMotionPaused } from "@/lib/motion/motion-preference";

// One light colour for Home below the hero, with a soft amber and blue colour
// field that floats and travels as the page scrolls (globals.css, "Home
// scene"). The field is CSS only, so it shows with no JavaScript; reduced
// motion holds it still, and so does a saved Pause, which this script reads.
export function HomeScene({ children }: Readonly<{ children: ReactNode }>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && readMotionPaused()) ref.current.dataset.paused = "";
  }, []);

  return (
    <div ref={ref} className="home-scene">
      <div className="scene-bg" aria-hidden="true">
        <span className="scene-blob scene-blob-blue" />
        <span className="scene-blob scene-blob-amber" />
        <span className="scene-blob scene-blob-warm" />
      </div>
      {children}
    </div>
  );
}
