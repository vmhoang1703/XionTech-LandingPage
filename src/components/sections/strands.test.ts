import { describe, expect, it, vi } from "vitest";
import { drawStrands, STRAND_COUNT, STRANDS_RUN_SECONDS } from "./strands";

function fakeContext() {
  const strokes: string[] = [];
  const ctx = {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(function (this: { strokeStyle: string }) {
      strokes.push(this.strokeStyle);
    }),
    strokeStyle: "",
    lineWidth: 1,
  };
  return { ctx, strokes };
}

describe("drawStrands", () => {
  it("clears the canvas and draws every strand", () => {
    const { ctx, strokes } = fakeContext();

    drawStrands(
      ctx as unknown as CanvasRenderingContext2D,
      800,
      400,
      4,
      "navy",
    );

    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 400);
    expect(strokes).toHaveLength(STRAND_COUNT);
  });

  it("uses an amber accent on every ninth strand, per tone", () => {
    for (const [tone, accent] of [
      ["light", "rgba(230, 173, 0, 0.55)"],
      ["navy", "rgba(255, 192, 0, 0.6)"],
      ["amber", "rgba(22, 54, 99, 0.35)"],
    ] as const) {
      const { ctx, strokes } = fakeContext();
      drawStrands(
        ctx as unknown as CanvasRenderingContext2D,
        800,
        400,
        4,
        tone,
      );
      expect(strokes[4]).toBe(accent);
      expect(strokes[13]).toBe(accent);
      expect(strokes[0]).not.toBe(accent);
    }
  });

  it("moves with time", () => {
    const a = fakeContext();
    const b = fakeContext();

    drawStrands(
      a.ctx as unknown as CanvasRenderingContext2D,
      800,
      400,
      4,
      "light",
    );
    drawStrands(
      b.ctx as unknown as CanvasRenderingContext2D,
      800,
      400,
      6,
      "light",
    );

    expect(a.ctx.lineTo.mock.calls).not.toEqual(b.ctx.lineTo.mock.calls);
  });

  it("runs for 5 seconds", () => {
    expect(STRANDS_RUN_SECONDS).toBe(5);
  });
});
