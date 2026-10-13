import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOTION_KEY } from "@/lib/motion/motion-preference";
import { CountUp } from "./count-up";

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let callback: Callback;
let options: IntersectionObserverInit | undefined;
const observe = vi.fn();
const disconnect = vi.fn();

function stubMotion(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: reduced } as MediaQueryList),
  );
}

// Mounts one figure and returns it.
function mount() {
  const view = render(<CountUp value="25" />);
  return { view, figure: view.getByText("25") };
}

beforeEach(() => {
  observe.mockClear();
  disconnect.mockClear();
  localStorage.clear();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(next: Callback, init?: IntersectionObserverInit) {
        callback = next;
        options = init;
      }
      observe = observe;
      disconnect = disconnect;
    },
  );
  stubMotion(false);
  // Browsers that have requestIdleCallback have this too.
  vi.stubGlobal("cancelIdleCallback", vi.fn());
});

afterEach(() => {
  // Unmount while the stubs are still there: the cleanup cancels with them.
  cleanup();
  vi.unstubAllGlobals();
});

describe("CountUp", () => {
  it("keeps the real number in the HTML and passes it to CSS", () => {
    const { figure } = mount();
    expect(figure.className).toBe("count-up");
    expect(figure.style.getPropertyValue("--to")).toBe("25");
    expect(options?.rootMargin).toBe("0px 0px -10% 0px");
  });

  it("holds the figure at 0 until it is in view", () => {
    const { figure } = mount();
    expect(figure.dataset.count).toBe("wait");
    callback([{ isIntersecting: false }]);
    expect(figure.dataset.count).toBe("wait");
    expect(disconnect).not.toHaveBeenCalled();
  });

  it("plays in view once the page has a quiet moment", () => {
    let idle: IdleRequestCallback = () => {};
    vi.stubGlobal("requestIdleCallback", (next: IdleRequestCallback) => {
      idle = next;
      return 7;
    });
    const { figure } = mount();
    callback([{ isIntersecting: false }, { isIntersecting: true }]);
    expect(disconnect).toHaveBeenCalled();
    expect(figure.dataset.count).toBe("wait");
    idle({} as IdleDeadline);
    expect(figure.dataset.count).toBe("play");
  });

  it("counts every number, one a frame at most, even when frames are late", () => {
    let frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (next: FrameRequestCallback) => {
      frames.push(next);
      return frames.length;
    });
    vi.stubGlobal("requestIdleCallback", (next: IdleRequestCallback) => {
      next({} as IdleDeadline);
      return 1;
    });
    const { figure } = mount();
    callback([{ isIntersecting: true }]);
    expect(figure.dataset.count).toBe("play");
    expect(figure.style.getPropertyValue("--count")).toBe("0");
    const shown: string[] = [];
    // A slow phone: 600ms between frames, so the eased count wants to jump.
    for (let now = 0; frames.length > 0; now += 600) {
      const next = frames;
      frames = [];
      for (const frame of next) frame(now);
      shown.push(figure.style.getPropertyValue("--count"));
    }
    expect(shown).toEqual(
      Array.from({ length: 26 }, (_, index) => String(index)),
    );
  });

  it("cancels a count that is running when it unmounts", () => {
    const cancelFrame = vi.fn();
    vi.stubGlobal("requestAnimationFrame", () => 9);
    vi.stubGlobal("cancelAnimationFrame", cancelFrame);
    vi.stubGlobal("requestIdleCallback", (next: IdleRequestCallback) => {
      next({} as IdleDeadline);
      return 1;
    });
    const { view } = mount();
    callback([{ isIntersecting: true }]);
    view.unmount();
    expect(cancelFrame).toHaveBeenCalledWith(9);
  });

  it("cancels a start that has not run when it unmounts", () => {
    const cancelIdle = vi.fn();
    vi.stubGlobal("requestIdleCallback", () => 7);
    vi.stubGlobal("cancelIdleCallback", cancelIdle);
    const { view } = mount();
    callback([{ isIntersecting: true }]);
    view.unmount();
    expect(cancelIdle).toHaveBeenCalledWith(7);
  });

  it("cancels the timer fallback when it unmounts", () => {
    vi.useFakeTimers();
    vi.stubGlobal("requestIdleCallback", undefined);
    vi.stubGlobal("cancelIdleCallback", undefined);
    const { view, figure } = mount();
    callback([{ isIntersecting: true }]);
    view.unmount();
    vi.advanceTimersByTime(500);
    expect(figure.dataset.count).toBe("wait");
    vi.useRealTimers();
  });

  it("shows the plain number after a saved Pause", () => {
    localStorage.setItem(MOTION_KEY, "off");
    const { figure } = mount();
    expect(figure.dataset.count).toBe("off");
    expect(observe).not.toHaveBeenCalled();
  });

  it("does nothing under reduced motion (CSS shows the number)", () => {
    stubMotion(true);
    const { figure } = mount();
    expect(figure.dataset.count).toBe("wait");
    expect(observe).not.toHaveBeenCalled();
  });

  it("stops watching on unmount", () => {
    const { view } = mount();
    view.unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
