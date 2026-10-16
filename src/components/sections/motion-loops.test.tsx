import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setMotionPaused } from "@/lib/motion/motion-preference";
import { MotionLoops } from "./motion-loops";

vi.mock("next/navigation", () => ({ usePathname: () => "/en" }));

let observed: Element[] = [];
let callback: IntersectionObserverCallback = () => undefined;

beforeEach(() => {
  observed = [];
  localStorage.clear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false })),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IntersectionObserverCallback) {
        callback = cb;
      }
      observe(el: Element) {
        observed.push(el);
      }
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete document.documentElement.dataset.motion;
  delete document.documentElement.dataset.tab;
  document.body.innerHTML = "";
});

describe("MotionLoops", () => {
  it("marks a loop off screen while it cannot be seen", () => {
    const blob = document.createElement("span");
    blob.className = "scene-blob";
    document.body.append(blob);
    render(<MotionLoops />);
    expect(observed).toContain(blob);
    act(() =>
      callback(
        [
          {
            target: blob,
            isIntersecting: false,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      ),
    );
    expect(blob.hasAttribute("data-offscreen")).toBe(true);
    act(() =>
      callback(
        [
          {
            target: blob,
            isIntersecting: true,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      ),
    );
    expect(blob.hasAttribute("data-offscreen")).toBe(false);
  });

  it("marks the page while the tab is hidden", () => {
    render(<MotionLoops />);
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(document.documentElement.dataset.tab).toBe("hidden");
    hidden.mockReturnValue(false);
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(document.documentElement.dataset.tab).toBeUndefined();
  });

  it("applies a saved Pause on load, and Pause/Play live", () => {
    localStorage.setItem("xt-motion", "off");
    render(<MotionLoops />);
    expect(document.documentElement.dataset.motion).toBe("paused");
    act(() => setMotionPaused(false));
    expect(document.documentElement.dataset.motion).toBeUndefined();
    expect(localStorage.getItem("xt-motion")).toBe("on");
  });
});
