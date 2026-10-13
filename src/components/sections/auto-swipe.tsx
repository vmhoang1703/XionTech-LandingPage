"use client";

import { useEffect } from "react";

// The swipe rows on phones (globals.css, "Phones: shorter pages").
export const SWIPE_ROWS =
  ".flow, .app-cards, .flip-cards:not(.home-values .flip-cards), .sgrid-row";
export const SWIPE_DELAY = 3500;

// Phones (lead, 2026-10-13): a swipe row moves on by one card every few
// seconds while it is in view, back to the first card after the last. The
// first touch, wheel or key in a row hands it to the visitor for good. Off
// with reduced motion and from 640px, where the cards sit in a grid.
export function AutoSwipe() {
  useEffect(() => {
    if (
      !window.matchMedia?.(
        "(width < 640px) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;
    const rows = [...document.querySelectorAll<HTMLElement>(SWIPE_ROWS)];
    const timers = new Map<HTMLElement, number>();
    const stop = (row: HTMLElement) => {
      clearInterval(timers.get(row));
      timers.delete(row);
    };
    const advance = (row: HTMLElement) => {
      const [first, second] = row.children as HTMLCollectionOf<HTMLElement>;
      if (!second) return;
      const step = second.offsetLeft - first.offsetLeft;
      const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 2;
      row.scrollTo({
        left: atEnd ? 0 : row.scrollLeft + step,
        behavior: "smooth",
      });
    };
    const handedOver = new WeakSet<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          const row = target as HTMLElement;
          if (!isIntersecting || handedOver.has(row)) stop(row);
          else if (!timers.has(row))
            timers.set(
              row,
              window.setInterval(() => advance(row), SWIPE_DELAY),
            );
        }
      },
      { threshold: 0.6 },
    );
    const takeOver = (event: Event) => {
      const row = event.currentTarget as HTMLElement;
      handedOver.add(row);
      stop(row);
    };
    const events = ["pointerdown", "wheel", "keydown"] as const;
    for (const row of rows) {
      observer.observe(row);
      for (const name of events)
        row.addEventListener(name, takeOver, { passive: true });
    }
    return () => {
      observer.disconnect();
      for (const row of rows) {
        stop(row);
        for (const name of events) row.removeEventListener(name, takeOver);
      }
    };
  }, []);

  return null;
}
