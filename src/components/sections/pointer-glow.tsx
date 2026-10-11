"use client";

import { useEffect } from "react";

// Moves the soft light on [data-glow] cards (globals.css, "Pointer glow") to
// the pointer: one listener for the whole page, at most one update a frame.
// Only on a mouse or pen with hover; touch screens never show the light.
export function PointerGlow() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      const card = (event.target as Element).closest<HTMLElement>(
        "[data-glow]",
      );
      if (!card) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = card.getBoundingClientRect();
        card.style.setProperty("--glow-x", `${event.clientX - box.left}px`);
        card.style.setProperty("--glow-y", `${event.clientY - box.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}
