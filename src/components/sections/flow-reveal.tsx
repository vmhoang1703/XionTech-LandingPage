"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Phase = "static" | "armed" | "on";

// The reveal plays once 30% of the flow is visible (CAP-2).
const REVEAL_AT = 0.3;

// Plays the 4-D flow once when 30% of it is visible. Server HTML and reduced
// motion stay "static", so without JavaScript every step is visible. A flow
// already 30% on screen when the page loads goes straight to "on", so it
// never flashes dimmed and replays.
export function FlowReveal({
  label,
  children,
}: Readonly<{
  label: string;
  children: ReactNode;
}>) {
  const ref = useRef<HTMLOListElement>(null);
  const [phase, setPhase] = useState<Phase>("static");

  useEffect(() => {
    const list = ref.current;
    if (!list || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already 30% on screen at load: show it as is (no hide, no replay).
    const { top, bottom, height } = list.getBoundingClientRect();
    const seen = Math.min(bottom, window.innerHeight) - Math.max(top, 0);
    if (height > 0 && seen >= REVEAL_AT * height) {
      setPhase("on");
      return;
    }
    setPhase("armed");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        setPhase("on");
        observer.disconnect();
      },
      { threshold: REVEAL_AT },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} aria-label={label} data-phase={phase} className="flow">
      {children}
    </ol>
  );
}
