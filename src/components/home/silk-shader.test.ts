import { describe, expect, it, vi } from "vitest";
import { createSilk } from "./silk-shader";

// `done` is the answer to "is the build finished?" of the parallel-compile
// extension; without `parallel` the browser has no such extension.
const COMPLETION = 99;

function fakeGl(linked = true, shaders = true, parallel = false, done = true) {
  const calls: string[] = [];
  const gl = new Proxy(
    {
      VERTEX_SHADER: 1,
      FRAGMENT_SHADER: 2,
      ARRAY_BUFFER: 3,
      STATIC_DRAW: 4,
      FLOAT: 5,
      TRIANGLE_STRIP: 6,
      LINK_STATUS: 7,
      getProgramParameter: (_program: unknown, name: number) =>
        name === COMPLETION ? done : linked,
      getExtension: () =>
        parallel ? { COMPLETION_STATUS_KHR: COMPLETION } : null,
      getAttribLocation: () => 0,
      createShader: () => (shaders ? {} : null),
    } as Record<string, unknown>,
    {
      get(target, key: string) {
        if (key in target) return target[key];
        return () => {
          calls.push(key);
          return {};
        };
      },
    },
  );
  return { gl, calls };
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

describe("createSilk with the parallel-compile extension", () => {
  const draws = (calls: string[]) =>
    calls.filter((c) => c === "drawArrays").length;

  it("does not wait for the build: it draws once the build is done", () => {
    const state = fakeGl(true, true, true, false);
    const silk = createSilk(canvasWith(state.gl));
    expect(silk).not.toBeNull();
    silk?.resize();
    silk?.draw(9);
    expect(draws(state.calls)).toBe(0);
    expect(state.calls).not.toContain("useProgram");

    const ready = fakeGl(true, true, true, true);
    const quick = createSilk(canvasWith(ready.gl));
    quick?.draw(9);
    expect(draws(ready.calls)).toBe(1);
    expect(ready.calls).toContain("viewport");
  });

  it("keeps the canvas empty when the finished build did not link", () => {
    const state = fakeGl(false, true, true, true);
    const silk = createSilk(canvasWith(state.gl));
    expect(silk).not.toBeNull();
    silk?.draw(9);
    silk?.draw(10);
    expect(draws(state.calls)).toBe(0);
  });
});

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

  it("sets the gold threads' strength on each frame (full by default)", () => {
    const { gl, calls } = fakeGl();
    const silk = createSilk(canvasWith(gl));
    const before = calls.filter((c) => c === "uniform1f").length;
    silk?.draw(9, 0.25);
    silk?.draw(9);
    expect(calls.filter((c) => c === "uniform1f")).toHaveLength(before + 4);
  });
});
