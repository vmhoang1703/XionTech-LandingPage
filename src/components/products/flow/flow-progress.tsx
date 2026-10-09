"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CampusCanvas } from "./campus-canvas";

// Client island for the audience flow: Motion's useScroll turns the scroll
// over the chapter list into 0..1 progress for the scene and marks the active
// chapter with data-active. Without JavaScript nothing is marked, so every
// chapter reads at full strength.

// The chapterAt rule from campus-scene.ts (equal parts, one per chapter),
// kept here so this island does not pull three.js into the page bundle.
export function activeChapter(progress: number, count: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.min(count - 1, Math.floor(clamped * count));
}

// `count` is the number of chapters passed in as `children` (the list items).
export function FlowProgress({
  count,
  children,
}: Readonly<{ count: number; children: ReactNode }>) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });
  const [progress, setProgress] = useState(() => scrollYProgress.get());
  useMotionValueEvent(scrollYProgress, "change", setProgress);

  const active = activeChapter(progress, count);

  useEffect(() => {
    listRef.current
      ?.querySelectorAll<HTMLElement>(":scope > li")
      .forEach((item, index) => {
        item.dataset.active = String(index === active);
      });
  }, [active]);

  return (
    <div className="flow-body">
      <div className="flow-stage">
        <CampusCanvas progress={progress} />
      </div>
      <ol ref={listRef} className="flow-chapters">
        {children}
      </ol>
    </div>
  );
}
