"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// The silk canvas and the globe (hero-silk.tsx, silk-shader.ts, globe-mark.ts)
// are the largest script on Home, and the hero shows its static glow until the
// scene starts anyway (after the page has loaded; seconds later on a phone). So
// their code is fetched only once the page has loaded, never in the first
// bundle or alongside the first screen's files. Nothing is server rendered for
// them (the canvases stay hidden until WebGL is confirmed), so the no-JS page
// is unchanged (mobile speed pass, 2026-10-17).
const HeroSilk = dynamic(() => import("./hero-silk").then((m) => m.HeroSilk), {
  ssr: false,
});

export function HeroSilkLazy() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ready = () => setLoaded(true);
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    return () => window.removeEventListener("load", ready);
  }, []);

  return loaded ? <HeroSilk /> : null;
}
