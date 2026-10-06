import { describe, expect, it, vi } from "vitest";
import { createSilk } from "./silk-shader";

function fakeGl(linked = true, shaders = true) {
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
      getProgramParameter: () => linked,
      getAttribLocation: () => 0,
      getExtension: () => null,
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

describe("createSilk", () => {
  it("returns null when WebGL is not available", async () => {
    expect(await createSilk(canvasWith(null))).toBeNull();
  });

  it("returns null when a shader cannot be created", async () => {
    expect(await createSilk(canvasWith(fakeGl(true, false).gl))).toBeNull();
  });

  it("returns null when the shader program fails to link", async () => {
    expect(await createSilk(canvasWith(fakeGl(false).gl))).toBeNull();
  });

  it("sizes the canvas to its box and draws a frame", async () => {
    const { gl, calls } = fakeGl();
    const canvas = canvasWith(gl);
    const silk = await createSilk(canvas);

    expect(silk).not.toBeNull();
    silk?.resize();
    expect(canvas.width).toBe(
      400 * Math.min(window.devicePixelRatio || 1, 1.5),
    );
    expect(calls).toContain("viewport");

    const drawsAfterResize = calls.filter((c) => c === "drawArrays").length;
    silk?.draw(9);
    expect(calls.filter((c) => c === "drawArrays").length).toBe(
      drawsAfterResize + 1,
    );
  });
});
