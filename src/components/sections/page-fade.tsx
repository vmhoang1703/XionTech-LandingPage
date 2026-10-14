"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { readMotionPaused } from "@/lib/motion/motion-preference";

const FADE_MS = 450;

// After a click to another page (lead, 2026-10-13) the new page fades up a
// little; never on the first load, so the first paint and the speed score are
// untouched. It runs before the browser paints the new page, so the page never
// shows and then hides. Reduced motion or a saved Pause: no fade.
export function PageFade() {
  const pathname = usePathname();
  const first = useRef(true);

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const main = document.getElementById("main");
    if (
      !main?.animate ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      readMotionPaused()
    ) {
      return;
    }
    const ease = getComputedStyle(document.documentElement)
      .getPropertyValue("--ease-brand")
      .trim();
    main.animate(
      [
        { opacity: 0, translate: "0 14px" },
        { opacity: 1, translate: "0 0" },
      ],
      { duration: FADE_MS, easing: ease || "ease-out" },
    );
  }, [pathname]);

  return null;
}
