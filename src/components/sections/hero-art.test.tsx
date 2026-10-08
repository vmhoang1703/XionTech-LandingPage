import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroArt } from "./hero-art";

let intersect: (visible: boolean) => void = () => undefined;
let resize: () => void = () => undefined;
let frames: FrameRequestCallback[] = [];
const draw = vi.fn();
let reducedMotion = false;

vi.mock("./strands", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./strands")>()),
  drawStrands: (...args: unknown[]) => draw(...args),
}));

beforeEach(() => {
  frames = [];
  draw.mockClear();
  reducedMotion = false;
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: reducedMotion })),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
        intersect = (visible) => cb([{ isIntersecting: visible }]);
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(cb: () => void) {
        resize = cb;
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    frames.push(cb);
    return frames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    setTransform: vi.fn(),
  } as unknown as CanvasRenderingContext2D);
  vi.spyOn(performance, "now").mockReturnValue(0);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function runFrame(seconds: number) {
  vi.mocked(performance.now).mockReturnValue(seconds * 1000);
  const next = frames.shift();
  next?.(seconds * 1000);
}

describe("HeroArt", () => {
  it("renders an aria-hidden aurora and strand canvas for its tone", () => {
    const { container } = render(<HeroArt tone="navy" />);

    const aurora = container.querySelector(".aurora");
    const canvas = container.querySelector("canvas.strands");
    expect(aurora?.getAttribute("aria-hidden")).toBe("true");
    // An empty canvas has nothing for screen readers (no fallback, no role).
    expect(canvas?.childNodes).toHaveLength(0);
    expect(container.querySelectorAll("[tabindex], a, button")).toHaveLength(0);
  });

  it("animates the ribbon for 5 seconds, then holds the last frame", () => {
    render(<HeroArt tone="navy" />);

    runFrame(1);
    runFrame(3);
    expect(draw).toHaveBeenCalled();
    const before = draw.mock.calls.length;
    runFrame(6);
    expect(frames).toHaveLength(0);
    expect(draw.mock.calls.at(-1)?.[3]).toBe(9);
    expect(draw.mock.calls).toHaveLength(before + 1);
  });

  it("draws one still frame under reduced motion", () => {
    reducedMotion = true;
    render(<HeroArt tone="light" />);

    runFrame(0);
    expect(frames).toHaveLength(0);
    expect(draw.mock.calls.at(-1)?.[3]).toBe(4);
    expect(draw.mock.calls.at(-1)?.[4]).toBe("light");
  });

  it("does not draw while the hero is off screen", () => {
    render(<HeroArt tone="amber" />);

    intersect(false);
    draw.mockClear();
    runFrame(2);
    expect(draw).not.toHaveBeenCalled();
  });

  it("cancels its frame when unmounted", () => {
    const { unmount } = render(<HeroArt tone="navy" />);

    unmount();
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it("draws the held final frame when it comes back after the run ended off screen", () => {
    render(<HeroArt tone="navy" />);

    intersect(false);
    runFrame(2);
    runFrame(6);
    draw.mockClear();
    intersect(true);
    expect(draw).toHaveBeenCalledTimes(1);
    expect(draw.mock.calls[0][3]).toBe(9);
  });

  it("repaints after a resize that happened off screen", () => {
    render(<HeroArt tone="navy" />);

    runFrame(6);
    intersect(false);
    resize();
    draw.mockClear();
    intersect(true);
    expect(draw).toHaveBeenCalledTimes(1);
  });
});
