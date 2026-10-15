import { act, render } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  NarrowWave,
  reachOf,
  useWave,
  wavePath,
  type Wave,
} from "./narrow-wave";

const WAVE: Wave = {
  width: 300,
  height: 800,
  points: [
    { x: 67, y: 40 },
    { x: 13, y: 200 },
    { x: 67, y: 400 },
    { x: 13, y: 600 },
    { x: 67, y: 760 },
  ],
};

describe("wavePath", () => {
  it("runs through every point, leaving and reaching each one upright", () => {
    expect(wavePath(WAVE.points.slice(0, 3))).toBe(
      "M67 40 C 67 120, 13 120, 13 200 C 13 300, 67 300, 67 400",
    );
  });
});

describe("reachOf", () => {
  it("draws all of it when nothing is armed", () => {
    expect(reachOf(WAVE, new Set(), false)).toBe(800);
  });

  it("draws nothing until a stop is shown, then down to its pin", () => {
    expect(reachOf(WAVE, new Set(), true)).toBe(0);
    expect(reachOf(WAVE, new Set([0]), true)).toBe(200);
    expect(reachOf(WAVE, new Set([0, 1]), true)).toBe(400);
  });

  it("draws on to Finish's pin once the last stop is shown", () => {
    expect(reachOf(WAVE, new Set([2]), true)).toBe(WAVE.points.at(-1)!.y);
  });
});

describe("NarrowWave", () => {
  it("draws the road's three strokes, hidden from assistive technology", () => {
    const { container } = render(
      <NarrowWave wave={WAVE} shown={new Set([0])} armed />,
    );
    const svg = container.querySelector("svg.rm-wave") as SVGSVGElement;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("viewBox")).toBe("0 0 300 800");
    expect(svg.style.getPropertyValue("--reach")).toBe("200px");
    expect(
      Array.from(svg.querySelectorAll("path"), (p) => p.getAttribute("class")),
    ).toEqual(["rm-edge", "rm-asphalt", "rm-line"]);
  });
});

describe("useWave", () => {
  let resize: (() => void) | undefined;
  const disconnect = vi.fn();

  beforeEach(() => {
    resize = undefined;
    disconnect.mockClear();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {}
        disconnect = disconnect;
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // A stage at (10, 100) with pins whose boxes are 20px square.
  function layout(height: number, pins: [number, number][]) {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      function (this: Element) {
        if (this.classList.contains("stage")) {
          return { left: 10, top: 100, width: 300, height } as DOMRect;
        }
        const [x, y] = pins[Number((this as HTMLElement).dataset.i)];
        return { left: x, top: y, width: 20, height: 20 } as DOMRect;
      },
    );
  }

  let seen: Wave | null = null;
  function Probe({ count }: Readonly<{ count: number }>) {
    const stage = useRef<HTMLDivElement>(null);
    seen = useWave(stage, count);
    return (
      <div ref={stage} className="stage">
        <span className="rm-end-pin" data-i="0" />
        <span className="rm-pin" data-i="1" />
        <span className="rm-end-pin" data-i="2" />
      </div>
    );
  }

  it("measures each pin's centre inside the stage, again on resize", () => {
    layout(500, [
      [67, 130],
      [13, 300],
      [67, 560],
    ]);
    const { unmount } = render(<Probe count={3} />);
    expect(seen).toEqual({
      width: 300,
      height: 500,
      points: [
        { x: 67, y: 40 },
        { x: 13, y: 210 },
        { x: 67, y: 470 },
      ],
    });
    layout(600, [
      [67, 130],
      [13, 400],
      [67, 660],
    ]);
    act(() => resize?.());
    expect(seen?.height).toBe(600);
    expect(seen?.points[1]).toEqual({ x: 13, y: 310 });
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("stays unmeasured with no layout or a missing pin", () => {
    layout(0, [
      [0, 0],
      [0, 0],
      [0, 0],
    ]);
    render(<Probe count={3} />);
    expect(seen).toBeNull();
    layout(500, [
      [0, 0],
      [0, 0],
      [0, 0],
    ]);
    act(() => resize?.());
    expect(seen).not.toBeNull();
  });

  it("stays unmeasured when the pins do not match the stops", () => {
    layout(500, [
      [0, 0],
      [0, 0],
      [0, 0],
    ]);
    render(<Probe count={5} />);
    expect(seen).toBeNull();
  });
});
