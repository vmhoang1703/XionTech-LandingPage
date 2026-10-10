import { describe, expect, it, vi } from "vitest";
import {
  createSilk,
  SILK_START_TIME,
  SILK_TIME_SCALE,
  xtAmount,
} from "./silk-shader";

function fakeGl(linked = true, shaders = true) {
  const calls: string[] = [];
  const args: unknown[][] = [];
  const gl = new Proxy(
    {
      VERTEX_SHADER: 1,
      FRAGMENT_SHADER: 2,
      ARRAY_BUFFER: 3,
      STATIC_DRAW: 4,
      FLOAT: 5,
      TRIANGLE_STRIP: 6,
      LINK_STATUS: 7,
      getProgramParameter: () => linked,
      getAttribLocation: () => 0,
      createShader: () => (shaders ? {} : null),
    } as Record<string, unknown>,
    {
      get(target, key: string) {
        if (key in target) return target[key];
        return (...rest: unknown[]) => {
          calls.push(key);
          args.push([key, ...rest]);
          return {};
        };
      },
    },
  );
  return { gl, calls, args };
}

function canvasWith(context: unknown) {
  const canvas = document.createElement("canvas");
  vi.spyOn(canvas, "getContext").mockReturnValue(
    context as RenderingContext | null,
  );
  Object.defineProperty(canvas, "clientWidth", { value: 400 });
  Object.defineProperty(canvas, "clientHeight", { value: 200 });
  return canvas;
}

describe("createSilk", () => {
  it("returns null when WebGL is not available", () => {
    expect(createSilk(canvasWith(null))).toBeNull();
  });

  it("returns null when a shader cannot be created", () => {
    expect(createSilk(canvasWith(fakeGl(true, false).gl))).toBeNull();
  });

  it("returns null when the shader program fails to link", () => {
    expect(createSilk(canvasWith(fakeGl(false).gl))).toBeNull();
  });

  it("sizes the canvas to its box and draws a frame", () => {
    const { gl, calls } = fakeGl();
    const canvas = canvasWith(gl);
    const silk = createSilk(canvas);

    expect(silk).not.toBeNull();
    silk?.resize();
    expect(canvas.width).toBe(
      400 * Math.min(window.devicePixelRatio || 1, 1.5),
    );
    expect(calls).toContain("viewport");

    const drawsAfterResize = calls.filter((c) => c === "drawArrays").length;
    silk?.draw(9);
    expect(calls.filter((c) => c === "drawArrays")).toHaveLength(
      drawsAfterResize + 1,
    );
  });
});

// Real seconds -> shader time, from the hold at SILK_START_TIME.
const at = (seconds: number) => SILK_START_TIME + seconds * SILK_TIME_SCALE;

describe("xtAmount", () => {
  it("shows the full XT mark at the start time (paused silk rests on it)", () => {
    expect(xtAmount(SILK_START_TIME)).toBe(1);
  });

  it("melts back to plain waves, then folds into XT again every 12 s", () => {
    expect(xtAmount(at(1.5))).toBe(1);
    expect(xtAmount(at(2.5))).toBeGreaterThan(0);
    expect(xtAmount(at(2.5))).toBeLessThan(1);
    expect(xtAmount(at(5))).toBe(0);
    expect(xtAmount(at(-4))).toBe(0);
    expect(xtAmount(at(12))).toBeCloseTo(1);
  });
});

describe("createSilk XT mark", () => {
  const xtValues = (args: unknown[][]) =>
    args.filter(([name]) => name === "uniform1f").map(([, , value]) => value);

  it("keeps plain waves when there is no room for the mark", () => {
    const { gl, args } = fakeGl();
    createSilk(canvasWith(gl))?.draw(SILK_START_TIME);
    expect(xtValues(args)).toContain(0);
    expect(xtValues(args)).not.toContain(1);
  });

  it("places the mark in GL pixels (y from the bottom) when there is room", () => {
    const { gl, args } = fakeGl();
    const silk = createSilk(canvasWith(gl), () => ({
      x: 300,
      y: 50,
      size: 120,
    }));
    silk?.resize();
    silk?.draw(SILK_START_TIME);
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const centres = args.filter(([name]) => name === "uniform2f");
    expect(centres).toContainEqual([
      "uniform2f",
      expect.anything(),
      300 * ratio,
      200 * ratio - 50 * ratio,
    ]);
    expect(xtValues(args)).toContain(120 * ratio);
    expect(xtValues(args)).toContain(1);
  });
});
