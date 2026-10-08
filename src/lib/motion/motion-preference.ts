export const MOTION_KEY = "xt-motion";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// The saved choice wins. With no saved choice, or when storage is blocked,
// the visitor's reduced-motion setting decides.
export function readMotionPaused(): boolean {
  try {
    const stored = localStorage.getItem(MOTION_KEY);
    if (stored === "off") return true;
    if (stored === "on") return false;
  } catch {
    // Storage is blocked: fall through to the reduced-motion setting.
  }
  return matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function saveMotionPaused(paused: boolean): void {
  try {
    localStorage.setItem(MOTION_KEY, paused ? "off" : "on");
  } catch {
    // Storage is blocked: the choice only lasts for this visit.
  }
}
