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
  return (
    typeof matchMedia === "function" && matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

export function saveMotionPaused(paused: boolean): void {
  try {
    localStorage.setItem(MOTION_KEY, paused ? "off" : "on");
  } catch {
    // Storage is blocked: the choice only lasts for this visit.
  }
}

// The live choice, shared by everything that moves (audit 2026-10-16, #6):
// the Pause/Play toggle calls setMotionPaused, which saves the choice, marks
// <html data-motion="paused"> (globals.css, "Looping motion", holds every CSS
// loop still) and tells the script loops that listen (useMotionPaused).
const listeners = new Set<() => void>();

export function applyMotionAttribute(paused: boolean): void {
  const root = document.documentElement;
  if (paused) root.dataset.motion = "paused";
  else delete root.dataset.motion;
}

export function setMotionPaused(paused: boolean): void {
  saveMotionPaused(paused);
  applyMotionAttribute(paused);
  for (const listener of listeners) listener();
}

export function subscribeMotion(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
