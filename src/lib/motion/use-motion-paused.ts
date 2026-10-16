"use client";

import { useSyncExternalStore } from "react";
import { readMotionPaused, subscribeMotion } from "./motion-preference";

// The visitor's Pause/Play choice, live: false on the server (motion on),
// then the saved choice or the reduced-motion setting, and every later press
// of the toggle.
export function useMotionPaused(): boolean {
  return useSyncExternalStore(subscribeMotion, readMotionPaused, () => false);
}
