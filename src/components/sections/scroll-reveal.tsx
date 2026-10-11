"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { readMotionPaused } from "@/lib/motion/motion-preference";

// Delay between items that come into view together, and the cap, so a row of
// cards reads left to right without making the last one wait.
const STAGGER_MS = 70;
const MAX_STAGGER = 4;

// An item starts once its top is 10% above the bottom of the screen (the
// count-up starts at the same line).
export const ROOT_MARGIN = "0px 0px -10% 0px";

// Plays the shared scroll reveal on every page: the direct children of every
// [data-reveal] group rise in once, as they come into view (globals.css,
// "Scroll reveal"). Only items this script marks "wait" are hidden, so the
// server HTML (no JavaScript), items already on screen and items added later
// (a filtered list) always show. Reduced motion or a saved Pause never marks
// anything. It runs again after each navigation, one frame later, once the
// new page is in place and scrolled.
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      readMotionPaused()
    ) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const arriving = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement);
        arriving.forEach((item, index) => {
          const delay = Math.min(index, MAX_STAGGER) * STAGGER_MS;
          item.style.setProperty("--reveal-delay", `${delay}ms`);
          item.dataset.shown = "play";
          observer.unobserve(item);
        });
      },
      { rootMargin: ROOT_MARGIN },
    );
    const frame = requestAnimationFrame(() => {
      for (const group of document.querySelectorAll("[data-reveal]")) {
        for (const item of group.children) {
          const shown = (item as HTMLElement).dataset;
          if (shown.shown === "play") continue;
          if (item.getBoundingClientRect().top < window.innerHeight) {
            delete shown.shown;
          } else {
            shown.shown = "wait";
            observer.observe(item);
          }
        }
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
