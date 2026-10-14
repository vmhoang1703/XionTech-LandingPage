import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOTION_KEY } from "@/lib/motion/motion-preference";
import { chapterAt, climbPoint, MountainStory } from "./mountain-story";

const STORY = {
  title: {
    lead: "Inspired by a mountain.",
    middle: "United by ",
    highlight: "purpose",
    tail: ".",
  },
  chapters: [
    { number: "01", title: "The inspiration", text: "One." },
    { number: "02", title: "The purpose", text: "Two." },
  ],
  closing: { line: "Our purpose is people.", tags: "Vision" },
  cue: "Scroll",
  tagName: "newXion",
};

let frames: FrameRequestCallback[] = [];
let now = 0;
let sticky = true;
let sectionTop = 0;

const runFrames = () => {
  for (const frame of frames.splice(0)) frame(now);
};

function stubMotion(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: reduced } as MediaQueryList),
  );
}

function mount() {
  const view = render(<MountainStory {...STORY} />);
  const mtn = view.container.querySelector(".mtn") as HTMLElement;
  return { view, mtn };
}

const on = (mtn: HTMLElement) =>
  [...mtn.querySelectorAll(".mtn-ch")].map((ch) => ch.hasAttribute("data-on"));
const rise = (mtn: HTMLElement) =>
  (mtn.querySelector(".mtn-rise") as HTMLElement).style.transform;

beforeEach(() => {
  frames = [];
  now = 0;
  sticky = true;
  sectionTop = 0;
  localStorage.clear();
  stubMotion(false);
  vi.stubGlobal("requestAnimationFrame", (frame: FrameRequestCallback) => {
    frames.push(frame);
    return frames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.spyOn(window, "getComputedStyle").mockImplementation(
    () =>
      ({
        position: sticky ? "sticky" : "static",
        top: "96px",
      }) as CSSStyleDeclaration,
  );
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      if (this.classList.contains("mtn")) return 1600;
      if (this.classList.contains("mtn-pin")) return 800;
      if (this.classList.contains("mtn-rise")) return 448;
      return 0;
    },
  );
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function (this: Element) {
      if (this.classList.contains("mtn")) return { top: sectionTop } as DOMRect;
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
    const [x, y] = climbPoint(1 / 16);
    expect(x).toBeCloseTo(24);
    expect(y).toBeCloseTo(67.5);
  });
});

describe("chapterAt", () => {
  it("splits the held scroll between the chapters", () => {
    const { mtn } = mount();
    const pin = mtn.querySelector(".mtn-pin") as HTMLElement;
    sectionTop = 96;
    expect(chapterAt(mtn, pin)).toBe(0);
    sectionTop = 96 - 500;
    expect(chapterAt(mtn, pin)).toBe(1);
    sectionTop = -5000;
    expect(chapterAt(mtn, pin)).toBe(1);
  });

  it("uses the chapter titles when nothing is held", () => {
    sticky = false;
    const { mtn } = mount();
    const pin = mtn.querySelector(".mtn-pin") as HTMLElement;
    // Every title reports top 0: above 60% of the screen.
    expect(chapterAt(mtn, pin)).toBe(1);
  });
});

describe("MountainStory", () => {
  it("renders both chapters, the cue, the closing lines and the picture", () => {
    const { mtn } = mount();
    expect(mtn.querySelectorAll(".mtn-ch")).toHaveLength(2);
    expect(mtn.querySelector(".mtn-cue")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(mtn.querySelector(".mtn-close strong")?.textContent).toBe(
      "Our purpose is people.",
    );
    expect(mtn.querySelector(".mtn-stage")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(mtn.querySelector(".mtn-tag")?.textContent).toBe("newXion");
  });

  it("arms the story at chapter 01, at the foot of the mountain", () => {
    sectionTop = 96;
    const { mtn } = mount();
    expect(mtn.hasAttribute("data-armed")).toBe(true);
    expect(on(mtn)).toEqual([true, false]);
    expect(rise(mtn)).toBe("translateY(448px)");
    expect(mtn.hasAttribute("data-top")).toBe(false);
    expect(mtn.hasAttribute("data-late")).toBe(false);
    const beacon = mtn.querySelector(".mtn-beacon") as HTMLElement;
    expect(beacon.style.transform).toBe(
      "translate(120px, 278px) translate(-50%, -50%)",
    );
  });

  it("climbs to the summit over time when the scroll reaches chapter 02", () => {
    sectionTop = 96;
    const { mtn } = mount();
    sectionTop = -404;
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    runFrames();
    expect(on(mtn)).toEqual([false, true]);
    expect(mtn.hasAttribute("data-late")).toBe(true);
    now = 1000;
    runFrames();
    expect(mtn.hasAttribute("data-top")).toBe(false);
    now = 10_000;
    runFrames();
    expect(mtn.hasAttribute("data-top")).toBe(true);
    expect(rise(mtn)).toBe("translateY(0px)");
    expect(
      mtn
        .querySelector<HTMLElement>(".mtn-dots")
        ?.style.getPropertyValue("--i"),
    ).toBe("1");
  });

  it("goes straight to the chapter's place when it is opened part-way down", () => {
    sectionTop = -404;
    const { mtn } = mount();
    expect(on(mtn)).toEqual([false, true]);
    expect(mtn.hasAttribute("data-top")).toBe(true);
  });

  it.each([
    ["reduced motion", () => stubMotion(true)],
    ["a saved Pause", () => localStorage.setItem(MOTION_KEY, "off")],
  ])("jumps without the climb under %s", (_, setUp) => {
    setUp();
    sectionTop = 96;
    const { mtn } = mount();
    sectionTop = -404;
    window.dispatchEvent(new Event("scroll"));
    runFrames();
    expect(mtn.hasAttribute("data-top")).toBe(true);
  });

  it("settles on the chapter's place on resize and when the tab is hidden", () => {
    sectionTop = 96;
    const { mtn } = mount();
    sectionTop = -404;
    window.dispatchEvent(new Event("scroll"));
    runFrames();
    expect(mtn.hasAttribute("data-top")).toBe(false);
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(mtn.hasAttribute("data-top")).toBe(true);
    sectionTop = 96;
    window.dispatchEvent(new Event("resize"));
    expect(on(mtn)).toEqual([true, false]);
    expect(mtn.hasAttribute("data-top")).toBe(false);
  });

  it("ignores a visible tab and a scroll that stays on the chapter", () => {
    sectionTop = 96;
    const { mtn } = mount();
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("scroll"));
    runFrames();
    expect(on(mtn)).toEqual([true, false]);
    expect(frames).toHaveLength(0);
  });

  it("disarms and stops listening on unmount", () => {
    const { view, mtn } = mount();
    view.unmount();
    expect(mtn.hasAttribute("data-armed")).toBe(false);
    window.dispatchEvent(new Event("scroll"));
    expect(frames).toHaveLength(0);
  });
});
