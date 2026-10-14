"use client";

import { useEffect } from "react";

// iPhone Safari shows :active, the pressed look of buttons and cards, only
// when the page listens for touches (lead, 2026-10-13: no feedback on tap).
// This listener does nothing else; it is passive, so scrolling stays smooth.
export function TouchPress() {
  useEffect(() => {
    const listen = () => undefined;
    document.addEventListener("touchstart", listen, { passive: true });
    return () => document.removeEventListener("touchstart", listen);
  }, []);

  return null;
}
