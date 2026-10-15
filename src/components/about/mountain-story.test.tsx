import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOTION_KEY } from "@/lib/motion/motion-preference";
import { CLIMB_MS, climbPoint, inView, MountainStory } from "./mountain-story";

const STORY = {
  title: {
    lead: "Inspired by a mountain.",
    middle: "Driven by ",
    highlight: "purpose",
    tail: ".",
  },
  paragraphs: ["One.", "Two."],
  tagName: "XionTech",
};

let frames: FrameRequestCallback[] = [];
let now = 0;
let observed: IntersectionObserverCallback | null = null;
const disconnect = vi.fn();

const runFrames = () => {
  for (const frame of frames.splice(0)) frame(now);
};

function stubMotion(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: reduced } as MediaQueryList),
  );
}

const entry = (ratio: number, height = 0) =>
  ({
    isIntersecting: ratio > 0,
    intersectionRatio: ratio,
    intersectionRect: { height } as DOMRectReadOnly,
  }) as IntersectionObserverEntry;

function show(ratio: number) {
  observed?.([entry(ratio)], {} as IntersectionObserver);
}

function mount() {
  const view = render(<MountainStory {...STORY} />);
  const mtn = view.container.querySelector(".mtn") as HTMLElement;
  return { view, mtn };
}

const rise = (mtn: HTMLElement) =>
  (mtn.querySelector(".mtn-rise") as HTMLElement).style.transform;

beforeEach(() => {
  frames = [];
  now = 0;
  observed = null;
  disconnect.mockClear();
  localStorage.clear();
  stubMotion(false);
  vi.stubGlobal("requestAnimationFrame", (frame: FrameRequestCallback) => {
    frames.push(frame);
    return frames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        observed = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      return this.classList.contains("mtn-rise") ? 448 : 0;
    },
  );
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function (this: Element) {
      if (this.classList.contains("mtn-art"))
        return { width: 600, height: 400 } as DOMRect;
      return { top: 0 } as DOMRect;
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("climbPoint", () => {
  it("starts at the foot, ends at the summit and stays on the path", () => {
    expect(climbPoint(0)).toEqual([20, 69.5]);
    expect(climbPoint(1)).toEqual([58.4, 19.4]);
    expect(climbPoint(-1)).toEqual([20, 69.5]);
  });
});

describe("inView", () => {
  it("needs 40% of the story, or 40% of the screen filled by it", () => {
    expect(inView(entry(0))).toBe(false);
    expect(inView(entry(0.3))).toBe(false);
    expect(inView(entry(0.4))).toBe(true);
    expect(inView(entry(0.2, innerHeight * 0.5))).toBe(true);
  });
});

describe("MountainStory", () => {
  it("renders one story, the picture and the brand tag, with no scroll cue or dots", () => {
    const { mtn } = mount();
    expect(
      [...mtn.querySelectorAll(".mtn-text")].map((p) => p.textContent),
    ).toEqual(["One.", "Two."]);
    expect(mtn.querySelector(".mtn-cue, .mtn-dots")).toBeNull();
    expect(mtn.querySelector(".mtn-stage")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(mtn.querySelector(".mtn-tag")?.textContent).toBe("XionTech");
  });

  it("waits at the foot until the story is in view", () => {
    const { mtn } = mount();
    expect(mtn.hasAttribute("data-armed")).toBe(true);
    expect(rise(mtn)).toBe("translateY(448px)");
    show(0.2);
    runFrames();
    expect(frames).toHaveLength(0);
    expect(mtn.hasAttribute("data-late")).toBe(false);
  });

  it("plays the climb once by itself when 40% is in view", () => {
    const { mtn } = mount();
    show(0.5);
    expect(disconnect).toHaveBeenCalled();
    now = CLIMB_MS / 2;
    runFrames();
    expect(mtn.hasAttribute("data-late")).toBe(true);
    expect(mtn.hasAttribute("data-top")).toBe(false);
    now = CLIMB_MS;
    runFrames();
    expect(mtn.hasAttribute("data-top")).toBe(true);
    expect(rise(mtn)).toBe("translateY(0px)");
    expect(frames).toHaveLength(0);
  });

  it.each([
    ["reduced motion", () => stubMotion(true)],
    ["a saved Pause", () => localStorage.setItem(MOTION_KEY, "off")],
  ])("shows the summit at once with %s", (_, setUp) => {
    setUp();
    const { mtn } = mount();
    expect(mtn.hasAttribute("data-top")).toBe(true);
    expect(rise(mtn)).toBe("translateY(0px)");
  });

  it("disarms and hides the light on unmount", () => {
    const { view, mtn } = mount();
    const beacon = mtn.querySelector(".mtn-beacon") as HTMLElement;
    expect(beacon.hidden).toBe(false);
    view.unmount();
    expect(mtn.hasAttribute("data-armed")).toBe(false);
    expect(beacon.hidden).toBe(true);
  });
});
