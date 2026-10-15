import { productRoad } from "@/content/products";

// The wide road's drawing space and its stops (peaks and troughs). The
// roadmap draws it; the stop scene lays the same road on its ground.
export const W = 1400;
export const H = 820;
// The road runs past the drawing at both ends; the mask must reach it.
export const PAD = 100;
// The road's Start and Finish markers sit on its two ends.
export const START = { x: 70, y: 430 };
export const FINISH = { x: 1330, y: 420 };
export const POINTS = productRoad.stops.map((_, i) => ({
  x: 330 + i * 370,
  y: i % 2 === 0 ? 340 : 500,
}));

// A smooth road through the points: each bend leaves and arrives level.
function roadPath() {
  const all = [START, ...POINTS, FINISH];
  let d = `M ${all[0].x} ${all[0].y}`;
  for (let i = 1; i < all.length; i += 1) {
    const a = all[i - 1];
    const b = all[i];
    const mid = (b.x - a.x) / 2;
    d += ` C ${a.x + mid} ${a.y} ${b.x - mid} ${b.y} ${b.x} ${b.y}`;
  }
  return d;
}

export const ROAD = roadPath();

// How much of the road leads up to a stop, 0 to 1.
export function shareOf(index: number) {
  const share = (POINTS[index].x - START.x) / (FINISH.x - START.x);
  return Math.round(share * 10000) / 10000;
}

// Groves of mixed kinds in the open ground, clear of the road, the pins, the cards
// and the Start and Finish labels: [x, y of the foot, size, kind].
export const TREES = [
  [618, 262, 1, "round"],
  [662, 286, 0.8, "birch"],
  [700, 266, 0.7, "poplar"],
  [742, 258, 0.95, "pine"],
  [96, 236, 0.85, "pine"],
  [134, 258, 0.75, "blossom"],
  [150, 676, 1, "round"],
  [190, 698, 0.75, "poplar"],
  [238, 684, 0.8, "pine"],
  [1150, 676, 0.95, "pine"],
  [1196, 700, 0.9, "blossom"],
  [1240, 690, 0.75, "birch"],
  [1292, 262, 0.9, "round"],
  [1336, 284, 0.8, "poplar"],
] as const;

// Each stop's place along the drawn road, 0 to 1 of its length, measured on
// the path itself (the road's x runs one way, so a search on x finds the
// length at a stop). Without SVG geometry (server, jsdom) it falls back to the
// stops' share of the road's width.
export function stopShares(path: SVGPathElement | null | undefined) {
  const fallback = POINTS.map((_, i) => shareOf(i));
  if (!path || typeof path.getTotalLength !== "function") return fallback;
  const total = path.getTotalLength();
  if (Number.isNaN(total) || total <= 0) return fallback;
  return POINTS.map(({ x }) => {
    let lo = 0;
    let hi = total;
    for (let step = 0; step < 40; step += 1) {
      const mid = (lo + hi) / 2;
      if (path.getPointAtLength(mid).x < x) lo = mid;
      else hi = mid;
    }
    return Math.round(((lo + hi) / 2 / total) * 1e6) / 1e6;
  });
}

