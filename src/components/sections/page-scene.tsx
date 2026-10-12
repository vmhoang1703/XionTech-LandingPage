"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { readMotionPaused } from "@/lib/motion/motion-preference";

// The site's one background below each page hero (lead, 2026-10-12): one light
// colour with a soft amber and blue colour field that floats and travels as
// the page scrolls, ending warm above the footer ridge (globals.css, "Page
// scene"). The field is CSS only, so it shows with no JavaScript; reduced
// motion holds it still, and so does a saved Pause, which this script reads.
// `fade` fades the field in from the page colour under a hero; a page whose
// own heading sits inside the scene turns it off.
export function PageScene({
  children,
  fade = true,
}: Readonly<{ children: ReactNode; fade?: boolean }>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && readMotionPaused()) ref.current.dataset.paused = "";
  }, []);

  return (
    <div ref={ref} className={fade ? "page-scene scene-fade" : "page-scene"}>
      <div className="scene-bg" aria-hidden="true">
        <span className="scene-blob scene-blob-blue" />
        <span className="scene-blob scene-blob-amber" />
        <span className="scene-blob scene-blob-warm" />
      </div>
      {children}
    </div>
  );
}
