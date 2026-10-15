// One gesture, one stop (lead, 2026-10-15): while the roadmap is in its stops,
// one wheel notch, trackpad swipe, PageDown or arrow moves to the next stop
// (or the previous one), never past it. It scrolls the page to that stop and
// ignores the rest of the gesture (a trackpad's inertia) for a short lock.
// It never traps: before the first stop and after the last one, scrolling is
// the browser's own. Keys typed in a field or a dialog are left alone, and so
// is Tab. Only runs while the tour or the narrow reveal does (both are off
// under prefers-reduced-motion).
//
// A script, not CSS scroll snap alone: a mandatory snap on the page would trap
// the rest of it, and a proximity snap lets a long swipe skip stops or a short
// notch fall back to the same one. The narrow layout keeps a proximity snap
// on its stops (globals.css) for touch screens only, on the same points.

// The lock after a step: about the length of the smooth scroll. Wheel events
// keep it going while they keep coming (a trackpad's inertia).
const LOCK_MS = 600;
const INERTIA_MS = 180;
// How far (px) a stop may be from its spot and still count as there.
const SLACK = 24;

type Dir = 1 | -1;

// Where the page stands among the stops, and how far to scroll to the next
// one in a direction: null when there is none (scroll natively).
export type StepGeometry = (dir: Dir) => number | null;

// The pinned tour: the stage holds still while the page scrolls the track,
// each stop an equal share of it; a stop sits at the middle of its share.
export function tourGeometry(map: HTMLElement, stops: number): StepGeometry {
  return (dir) => {
    const stage = map.querySelector(".rm-stage");
    if (!stage) return null;
    const track = map.getBoundingClientRect();
    const pinned = stage.getBoundingClientRect();
    const length = track.height - pinned.height;
    const travel = pinned.top - track.top;
    // Pinned: the stage has started down the track (the stage is zoomed, so
    // its sticky top in CSS is not its top on screen; the travel is). Not
    // pinned yet, or past the track: the page scrolls on.
    if (length <= 0 || travel < 0.5 || travel > length + 1) return null;
    // Down: the stop after the active one. Up: the nearest stop above, so
    // back from Finish lands on the last stop first.
    const spot = (k: number) => ((k + 0.5) / stops) * length;
    const active = Math.min(stops - 1, Math.floor((travel / length) * stops));
    let next = active + 1;
    if (dir === -1) {
      next = active;
      while (next >= 0 && spot(next) > travel - SLACK) next -= 1;
    }
    if (next < 0 || next >= stops) return null;
    return spot(next) - travel;
  };
}

// The middle of the part of the window the page scrolls into (below the
// header room, the html scroll-padding), where a centred snap lands.
function readingLine() {
  const pad =
    Number.parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop,
    ) || 0;
  return (pad + innerHeight) / 2;
}

// The narrow roadmap is not pinned: each stop comes to the middle of the
// window in turn, from the first stop to the last.
export function narrowGeometry(map: HTMLElement): StepGeometry {
  return (dir) => {
    const line = readingLine();
    const centres = [...map.querySelectorAll(".rm-stop")].map((stop) => {
      const box = stop.getBoundingClientRect();
      return box.top + box.height / 2 - line;
    });
    if (centres.length === 0) return null;
    // Not at the stops yet (going down) or past them (going up).
    if (dir === 1 && centres[0] > SLACK) return null;
    if (dir === -1 && centres[centres.length - 1] < -SLACK) return null;
    const next =
      dir === 1
        ? centres.find((c) => c > SLACK)
        : centres.findLast((c) => c < -SLACK);
    return next ?? null;
  };
}

const KEYS: Readonly<Record<string, Dir>> = {
  PageDown: 1,
  ArrowDown: 1,
  PageUp: -1,
  ArrowUp: -1,
};

// A key typed where it has another job: a field, a dialog, a list box.
function ownsKeys(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable=""], [contenteditable="true"], [role="dialog"], dialog, [role="listbox"], [role="menu"], [role="slider"]',
    ),
  );
}

// Steps the page one stop per gesture. `paused`: a dialog is open. `touch`:
// also step on a swipe (the pinned tour; the narrow layout swipes natively
// onto its snap points). Returns the cleanup.
export function stepStops(
  geometry: StepGeometry,
  paused: () => boolean,
  touch: boolean,
) {
  let lockedUntil = 0;
  const locked = () => performance.now() < lockedUntil;
  const step = (dir: Dir) => {
    const by = geometry(dir);
    if (by === null) return false;
    lockedUntil = performance.now() + LOCK_MS;
    scrollBy({ top: by, behavior: "smooth" });
    return true;
  };

  const onWheel = (event: WheelEvent) => {
    if (paused() || event.ctrlKey || Math.abs(event.deltaY) < 1) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (locked()) {
      event.preventDefault();
      lockedUntil = Math.max(lockedUntil, performance.now() + INERTIA_MS);
      return;
    }
    if (step(event.deltaY > 0 ? 1 : -1)) event.preventDefault();
  };

  const onKey = (event: KeyboardEvent) => {
    const dir = KEYS[event.key];
    if (!dir || event.defaultPrevented || paused()) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    if (ownsKeys(event.target)) return;
    if (locked()) {
      if (geometry(dir) !== null) event.preventDefault();
      return;
    }
    if (step(dir)) event.preventDefault();
  };

  // A swipe: its direction decides on the first move; a swipe with a stop
  // that way is held (no native scroll) and steps once on release.
  let startY: number | null = null;
  let swipe: Dir | null = null;
  const onTouchStart = (event: TouchEvent) => {
    startY = event.touches.length === 1 ? event.touches[0].clientY : null;
    swipe = null;
  };
  const onTouchMove = (event: TouchEvent) => {
    if (startY === null || paused()) return;
    if (swipe === null) {
      const dy = startY - event.touches[0].clientY;
      if (Math.abs(dy) < 6) return;
      const dir: Dir = dy > 0 ? 1 : -1;
      if (!locked() && geometry(dir) === null) {
        startY = null;
        return;
      }
      swipe = dir;
    }
    event.preventDefault();
  };
  const onTouchEnd = () => {
    if (swipe !== null && !locked()) step(swipe);
    startY = null;
    swipe = null;
  };

  addEventListener("wheel", onWheel, { passive: false });
  addEventListener("keydown", onKey);
  if (touch) {
    addEventListener("touchstart", onTouchStart, { passive: true });
    addEventListener("touchmove", onTouchMove, { passive: false });
    addEventListener("touchend", onTouchEnd);
    addEventListener("touchcancel", onTouchEnd);
  }
  return () => {
    removeEventListener("wheel", onWheel);
    removeEventListener("keydown", onKey);
    removeEventListener("touchstart", onTouchStart);
    removeEventListener("touchmove", onTouchMove);
    removeEventListener("touchend", onTouchEnd);
    removeEventListener("touchcancel", onTouchEnd);
  };
}
