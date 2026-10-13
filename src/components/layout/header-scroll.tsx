"use client";

import { useEffect } from "react";

// Below this scroll position the header always shows.
const TOP = 120;
// Smaller moves (a finger resting, a bounce) change nothing.
const NUDGE = 6;

// Below 1080px (lead, 2026-10-13): the header pill slides away while the
// visitor scrolls down and comes back as soon as they scroll up. It stays near
// the top of the page, while the menu is open and while focus is inside it
// (globals.css, "Header on scroll").
export function HeaderScroll() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("header[data-autohide]");
    if (!header) return;
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < NUDGE) return;
      const keep =
        y < TOP ||
        y < last ||
        header.matches(":focus-within") ||
        header.querySelector('[aria-expanded="true"]') !== null;
      if (keep) delete header.dataset.hidden;
      else header.dataset.hidden = "";
      last = y;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      delete header.dataset.hidden;
    };
  }, []);

  return null;
}
