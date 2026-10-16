"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  applyMotionAttribute,
  readMotionPaused,
} from "@/lib/motion/motion-preference";

// Every CSS animation that loops for ever (globals.css, "Looping motion"):
// the page-scene colour field, the roadmap trees, the careers hero art and
// photo strip, and the product scene behind the dialog.
export const LOOPS =
  ".scene-blob, .rm-tree-sway, .ch-art img, .life-track, .rd-orbit, .rd-world, .dv-rise";

// Holds the looping animations still when nobody can see them (audit
// 2026-10-16, #7): a loop off screen is marked data-offscreen, and while the
// tab is hidden <html> is marked data-tab="hidden"; globals.css pauses both.
// It also marks <html data-motion="paused"> from the saved Pause on load.
// Loops added later (a dialog's scene, the next page) are picked up too.
export function MotionLoops() {
  const pathname = usePathname();

  useEffect(() => {
    applyMotionAttribute(readMotionPaused());
    const root = document.documentElement;
    const onVisibility = () => {
      if (document.hidden) root.dataset.tab = "hidden";
      else delete root.dataset.tab;
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver !== "function") return;
    const watched = new WeakSet<Element>();
    const viewer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
      }
    });
    const scan = () => {
      for (const loop of document.querySelectorAll(LOOPS)) {
        if (watched.has(loop)) continue;
        watched.add(loop);
        viewer.observe(loop);
      }
    };
    scan();
    let frame = 0;
    const changes = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    changes.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      changes.disconnect();
      viewer.disconnect();
    };
  }, [pathname]);

  return null;
}
