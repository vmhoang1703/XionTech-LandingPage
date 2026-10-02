"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Phase = "static" | "armed" | "on";

// Plays the 4-D flow once when 30% of it is visible. Server HTML and reduced
// motion stay "static", so without JavaScript every step is visible.
export function FlowReveal({
  label,
  className,
  children,
}: Readonly<{
  label: string;
  className: string;
  children: ReactNode;
}>) {
  const ref = useRef<HTMLOListElement>(null);
  const [phase, setPhase] = useState<Phase>("static");

  useEffect(() => {
    const list = ref.current;
    if (!list || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("armed");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        setPhase("on");
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <ol
      ref={ref}
      aria-label={label}
      data-phase={phase}
      className={`group/flow ${className}`}
    >
      {children}
    </ol>
  );
}
