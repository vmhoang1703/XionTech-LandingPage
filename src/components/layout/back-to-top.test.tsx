import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BackToTop } from "./back-to-top";

let frames: FrameRequestCallback[] = [];
const runFrames = () => {
  for (const frame of frames.splice(0)) frame(0);
};
const scrollToY = (y: number) => {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  window.dispatchEvent(new Event("scroll"));
};

beforeEach(() => {
  frames = [];
  Object.defineProperty(window, "innerHeight", {
    value: 1000,
    configurable: true,
  });
  vi.stubGlobal("requestAnimationFrame", (frame: FrameRequestCallback) => {
    frames.push(frame);
    return frames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
});

afterEach(() => {
  vi.unstubAllGlobals();
  scrollToY(0);
});

const button = () =>
  document.querySelector(".back-to-top") as HTMLButtonElement;

describe("BackToTop", () => {
  it("is hidden and out of the tab order at the top of the page", () => {
    render(<BackToTop label="Back to top" />);
    expect(button().hasAttribute("data-shown")).toBe(false);
    expect(button().tabIndex).toBe(-1);
    expect(button().getAttribute("aria-hidden")).toBe("true");
  });

  it("shows after about a screen of scroll, once a frame", () => {
    render(<BackToTop label="Back to top" />);
    act(() => {
      scrollToY(900);
      scrollToY(950);
    });
    expect(frames).toHaveLength(1);
    act(runFrames);
    expect(button().hasAttribute("data-shown")).toBe(true);
    expect(button().tabIndex).toBe(0);
    expect(button().hasAttribute("aria-hidden")).toBe(false);
    act(() => scrollToY(500));
    act(runFrames);
    expect(button().hasAttribute("data-shown")).toBe(false);
  });

  it("shows at once when the page opens part-way down", () => {
    scrollToY(3000);
    render(<BackToTop label="Back to top" />);
    expect(button().hasAttribute("data-shown")).toBe(true);
  });

  it("checks again on resize", () => {
    scrollToY(900);
    render(<BackToTop label="Back to top" />);
    expect(button().hasAttribute("data-shown")).toBe(true);
    Object.defineProperty(window, "innerHeight", {
      value: 2000,
      configurable: true,
    });
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    act(runFrames);
    expect(button().hasAttribute("data-shown")).toBe(false);
  });

  it("goes to the top and moves focus to main on click", () => {
    const main = document.createElement("main");
    main.id = "main";
    main.tabIndex = -1;
    document.body.append(main);
    render(<BackToTop label="Back to top" />);
    fireEvent.click(button());
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
    expect(document.activeElement).toBe(main);
    main.remove();
  });

  it("stops listening on unmount", () => {
    const { unmount } = render(<BackToTop label="Back to top" />);
    unmount();
    act(() => scrollToY(2000));
    expect(frames).toHaveLength(0);
  });
});
