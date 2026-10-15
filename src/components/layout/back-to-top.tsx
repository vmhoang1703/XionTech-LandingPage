"use client";

import { ArrowUpIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

// Back-to-top button (Hoang Vu, 2026-10-15): appears once the reader has
// scrolled about a screen down, and takes them back to the top. The page's
// scroll-behavior makes the trip smooth, and instant under reduced motion.
export function BackToTop({ label }: Readonly<{ label: string }>) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setShown(window.scrollY > window.innerHeight * 0.8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      className="back-to-top"
      aria-label={label}
      data-shown={shown || undefined}
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown || undefined}
      onClick={() => {
        window.scrollTo({ top: 0 });
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
    >
      <ArrowUpIcon aria-hidden="true" weight="bold" />
    </button>
  );
}
