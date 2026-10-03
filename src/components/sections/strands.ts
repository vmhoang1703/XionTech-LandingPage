// Flowing strand ribbon behind inner page heroes, ported from the prototype
// (mockups/site-v3/js/site.js, canvas.strands). Canvas 2D needs colour
// strings, so the colours are written out here: navy (22 54 99) and amber
// (255 192 0) from DESIGN.md; the light-tone accent (230 173 0) and the pale
// blue strands on navy (170 195 235) are the prototype's own values (pending
// Amber: DESIGN.md amber-decor is 201 151 0).

export type StrandTone = "light" | "navy" | "amber";

export const STRAND_COUNT = 54;
const SEGMENTS = 46;
// Story 1.6: the ribbon moves for 5 seconds, then holds its last frame.
export const STRANDS_RUN_SECONDS = 5;
// Time the still frame is drawn at (the prototype holds at t = 4 + elapsed).
export const STRANDS_START_TIME = 4;

const PALETTE: Record<
  StrandTone,
  { strand: (alpha: number) => string; accent: string }
> = {
  light: {
    strand: (a) => `rgba(22, 54, 99, ${a})`,
    accent: "rgba(230, 173, 0, 0.55)",
  },
  navy: {
    strand: (a) => `rgba(170, 195, 235, ${a * 0.9})`,
    accent: "rgba(255, 192, 0, 0.6)",
  },
  amber: {
    strand: (a) => `rgba(255, 255, 255, ${a * 2.4})`,
    accent: "rgba(22, 54, 99, 0.35)",
  },
};

export function drawStrands(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  tone: StrandTone,
) {
  const colours = PALETTE[tone];
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < STRAND_COUNT; i++) {
    const offset = i / (STRAND_COUNT - 1) - 0.5;
    const isAccent = i % 9 === 4;
    ctx.beginPath();
    for (let j = 0; j <= SEGMENTS; j++) {
      const u = j / SEGMENTS;
      const x = -0.08 * width + u * 1.16 * width;
      const centre =
        height * (0.92 - 0.62 * u) +
        height * 0.07 * Math.sin(u * 3.2 + time * 0.25);
      const spread =
        height *
        0.2 *
        (0.35 + 0.65 * Math.pow(Math.sin(u * Math.PI * 0.95 + 0.2), 2));
      const y =
        centre +
        offset * spread * Math.cos(u * 4.2 + time * 0.45 + offset * 0.9);
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = isAccent
      ? colours.accent
      : colours.strand(0.06 + 0.12 * (1 - Math.abs(offset) * 2));
    ctx.lineWidth = isAccent ? 1.2 : 1;
    ctx.stroke();
  }
}
