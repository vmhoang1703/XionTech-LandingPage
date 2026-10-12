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

  it("holds a figure below the screen at 0, then plays it in view, once", () => {
    const { figure } = mount();
    callback([{ isIntersecting: false }]);
    expect(figure.dataset.count).toBe("wait");
    callback([{ isIntersecting: true }]);
    expect(figure.dataset.count).toBe("play");
    expect(disconnect).toHaveBeenCalled();
  });

  it("follows the latest entry when several arrive at once", () => {
    const { figure } = mount();
    callback([{ isIntersecting: false }]);
    callback([{ isIntersecting: true }, { isIntersecting: false }]);
    expect(figure.dataset.count).toBe("wait");
    expect(disconnect).not.toHaveBeenCalled();
    callback([{ isIntersecting: false }, { isIntersecting: true }]);
    expect(figure.dataset.count).toBe("play");
  });

  it("leaves a figure on screen at load to the CSS count", () => {
    const { figure } = mount();
    callback([{ isIntersecting: true }]);
    expect(figure.dataset.count).toBeUndefined();
    expect(disconnect).toHaveBeenCalled();
  });

  it("shows the plain number after a saved Pause", () => {
    localStorage.setItem(MOTION_KEY, "off");
    const { figure } = mount();
    expect(figure.dataset.count).toBe("off");
    expect(observe).not.toHaveBeenCalled();
  });

  it("does nothing under reduced motion", () => {
    stubMotion(true);
    const { figure } = mount();
    expect(figure.dataset.count).toBeUndefined();
    expect(observe).not.toHaveBeenCalled();
  });

  it("stops watching on unmount", () => {
    const { view } = mount();
    view.unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
