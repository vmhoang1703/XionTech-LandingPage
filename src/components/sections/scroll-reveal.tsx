"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { readMotionPaused } from "@/lib/motion/motion-preference";

// Delay between items that come into view together, and the cap, so a row of
// cards reads left to right without making the last one wait.
const STAGGER_MS = 100;
const MAX_STAGGER = 5;

// Website copy v3: sections with no [data-reveal] group of their own
// get one, so every page reads in order. These parts already animate
// themselves (mountain story, growth model, three-layer stack, 4-D flow,
// roadmap) and are left alone, as is anything marked [data-reveal-off].
export const SELF_ANIMATED = ".mtn, .tls-stack, .flow, .rm, [data-reveal-off]";

// The block whose children become the items: the section's .wrap (or the
// section), stepping down through lone wrappers so a single grid still
// staggers its cells.
function autoGroup(section: Element): Element {
  let group = section.querySelector(":scope > .wrap") ?? section;
  for (let depth = 0; depth < 3 && group.children.length === 1; depth++) {
    group = group.children[0];
  }
  return group;
}

// Marks [data-reveal="auto"] on main's sections that have no group yet.
function armSections() {
  for (const section of document.querySelectorAll("main section")) {
    if (
      section.querySelector("[data-reveal]") ||
      section.closest("[data-reveal]") ||
      section.closest(SELF_ANIMATED) ||
      section.querySelector(SELF_ANIMATED) ||
      section.querySelector("section")
    ) {
      continue;
    }
    const group = autoGroup(section);
    if (group.children.length > 0) group.setAttribute("data-reveal", "auto");
  }
}

// Page order, so a heading always starts before the cards below it.
const byPageOrder = (a: Element, b: Element) =>
  a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

// An item starts once its top is 10% above the bottom of the screen (the
// count-up starts at the same line).
export const ROOT_MARGIN = "0px 0px -10% 0px";

// Plays the shared scroll reveal on every page: the direct children of every
// [data-reveal] group (and of the groups armSections adds) rise in once, as they come into view (globals.css,
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
          .map((entry) => entry.target as HTMLElement)
          .sort(byPageOrder);
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
      armSections();
      for (const group of document.querySelectorAll("[data-reveal]")) {
        // Round 11: items already on screen are left alone. Groups in the
        // server HTML play the CSS load-in (globals.css, "Load-in") from the
        // first paint, so the script never restarts them (no flash).
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
