import { afterEach, describe, expect, it, vi } from "vitest";
import { narrowGeometry, stepStops, tourGeometry } from "./road-steps";

// A tour track 1000px longer than its stage, three stops: stop k sits at
// (k + 0.5) / 3 of the travel.
function mapAt(travel: number) {
  const map = document.createElement("div");
  const stage = document.createElement("div");
  stage.className = "rm-stage";
  map.append(stage);
  map.getBoundingClientRect = () =>
    ({ top: 100 - travel, height: 1600 }) as DOMRect;
  stage.getBoundingClientRect = () => ({ top: 100, height: 600 }) as DOMRect;
  return map;
}

describe("tourGeometry", () => {
  it("leaves the page alone until the stage is pinned", () => {
    expect(tourGeometry(mapAt(0), 3)(1)).toBeNull();
    expect(tourGeometry(mapAt(-50), 3)(1)).toBeNull();
  });

  it("goes one stop down and one stop up, never past the ends", () => {
    const spot = (k: number) => ((k + 0.5) / 3) * 1000;
    expect(tourGeometry(mapAt(10), 3)(1)).toBeCloseTo(spot(1) - 10);
    expect(tourGeometry(mapAt(spot(1)), 3)(1)).toBeCloseTo(spot(2) - spot(1));
    expect(tourGeometry(mapAt(spot(1)), 3)(-1)).toBeCloseTo(spot(0) - spot(1));
    // At the first stop, up scrolls natively; at the last, down does.
    expect(tourGeometry(mapAt(spot(0)), 3)(-1)).toBeNull();
    expect(tourGeometry(mapAt(spot(2)), 3)(1)).toBeNull();
    // Back from Finish: the last stop first.
    expect(tourGeometry(mapAt(990), 3)(-1)).toBeCloseTo(spot(2) - 990);
  });
});

describe("stepStops", () => {
  const scrolled = vi.fn();
  let stop = () => undefined as void;
  afterEach(() => {
    stop();
    scrolled.mockReset();
  });

  function start(by: number | null, paused = false) {
    window.scrollBy = scrolled as unknown as typeof window.scrollBy;
    stop = stepStops(
      () => by,
      () => paused,
      false,
    );
  }

  function wheel(deltaY: number) {
    const event = new WheelEvent("wheel", { deltaY, cancelable: true });
    window.dispatchEvent(event);
    return event.defaultPrevented;
  }

  it("takes one stop per gesture and swallows the rest of it", () => {
    start(300);
    expect(wheel(100)).toBe(true);
    expect(wheel(100)).toBe(true);
    expect(wheel(40)).toBe(true);
    expect(scrolled).toHaveBeenCalledTimes(1);
    expect(scrolled).toHaveBeenCalledWith({ top: 300, behavior: "smooth" });
  });

  it("scrolls natively where there is no stop that way, or a dialog is open", () => {
    start(null);
    expect(wheel(100)).toBe(false);
    stop();
    start(300, true);
    expect(wheel(100)).toBe(false);
    expect(scrolled).not.toHaveBeenCalled();
  });

  it("steps on PageDown and the arrows, but not in a field or on Tab", () => {
    start(300);
    const key = (k: string, target: EventTarget = window) => {
      const event = new KeyboardEvent("keydown", {
        key: k,
        bubbles: true,
        cancelable: true,
      });
      target.dispatchEvent(event);
      return event.defaultPrevented;
    };
    expect(key("Tab")).toBe(false);
    const input = document.createElement("input");
    document.body.append(input);
    expect(key("PageDown", input)).toBe(false);
    input.remove();
    expect(key("PageDown")).toBe(true);
    expect(scrolled).toHaveBeenCalledTimes(1);
  });
});

// Three stops whose centres sit at `centres` px from the reading line, which
// is the middle of the window below the 96px header room: (96 + 800) / 2.
function narrowMap(centres: number[], pad = "96px") {
  vi.stubGlobal("innerHeight", 800);
  vi.spyOn(window, "getComputedStyle").mockReturnValue({
    scrollPaddingTop: pad,
  } as CSSStyleDeclaration);
  const map = document.createElement("div");
  for (const centre of centres) {
    const stop = document.createElement("div");
    stop.className = "rm-stop";
    stop.getBoundingClientRect = () =>
      ({ top: 448 + centre - 50, height: 100 }) as DOMRect;
    map.append(stop);
  }
  return map;
}

describe("narrowGeometry", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("brings the next stop to the reading line, down and up", () => {
    const step = narrowGeometry(narrowMap([-400, 0, 400]));
    expect(step(1)).toBe(400);
    expect(step(-1)).toBe(-400);
  });

  it("leaves the page alone before the stops, past them, or with none", () => {
    expect(narrowGeometry(narrowMap([300, 700]))(1)).toBeNull();
    expect(narrowGeometry(narrowMap([-700, -300]))(-1)).toBeNull();
    expect(narrowGeometry(narrowMap([]))(1)).toBeNull();
  });

  it("reads no header room as 0", () => {
    const step = narrowGeometry(narrowMap([-400, 0, 400], ""));
    // The line moves up by 48px, so every centre is 48px further down and
    // the middle stop (now at 48) is the next one.
    expect(step(1)).toBe(48);
  });
});
