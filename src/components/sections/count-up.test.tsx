import { render } from "@testing-library/react";
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
});

afterEach(() => {
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

  it("plays in view once the page has loaded and gone idle", () => {
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

  it("waits for the load event while the page is still loading", () => {
    vi.useFakeTimers();
    vi.stubGlobal("requestIdleCallback", undefined);
    const state = vi
      .spyOn(document, "readyState", "get")
      .mockReturnValue("loading");
    const { figure } = mount();
    callback([{ isIntersecting: true }]);
    vi.advanceTimersByTime(1000);
    expect(figure.dataset.count).toBe("wait");
    state.mockReturnValue("complete");
    window.dispatchEvent(new Event("load"));
    vi.advanceTimersByTime(200);
    expect(figure.dataset.count).toBe("play");
    state.mockRestore();
    vi.useRealTimers();
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
