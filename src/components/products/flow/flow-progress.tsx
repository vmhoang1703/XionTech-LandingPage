"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
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
  const landing = useRef(0);
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

  useEffect(() => () => cancelAnimationFrame(landing.current), []);

  // Chrome can let a still-running focus scroll (Tab to an off-screen chapter
  // link, then Enter at once) win over the jump to the link's card, so the
  // jump stops short. Scrolling to the card again on the next frame lands it;
  // scrollIntoView() keeps the CSS scroll-behavior, so reduced motion jumps.
  // Clicks that open a new tab or window leave this page where it is.
  const landOnCard = (event: MouseEvent<HTMLOListElement>) => {
    const { button, metaKey, ctrlKey, shiftKey, altKey } = event;
    if (event.defaultPrevented || button !== 0) return;
    if (metaKey || ctrlKey || shiftKey || altKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>(
      "a.flow-link",
    );
    if (!link) return;
    const card = link.hash.slice(1);
    cancelAnimationFrame(landing.current);
    landing.current = requestAnimationFrame(() =>
      document.getElementById(card)?.scrollIntoView(),
    );
  };

  return (
    <div className="flow-body">
      <div className="flow-stage">
        <CampusCanvas progress={progress} />
      </div>
      <ol ref={listRef} className="flow-chapters" onClick={landOnCard}>
        {children}
      </ol>
    </div>
  );
}
