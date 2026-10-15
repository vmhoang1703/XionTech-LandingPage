import { productRoad } from "@/content/products";

// The wide road's drawing space and its stops (peaks and troughs). The
// roadmap draws it; the stop scene lays the same road on its ground.
export const W = 1400;
export const H = 820;
// The road runs past the drawing at both ends; the mask must reach it.
export const PAD = 100;
const START = { x: -20, y: 430 };
const FINISH = { x: 1420, y: 420 };
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

// Trees in the open ground between the cards.
export const TREES = [
  [610, 230],
  [660, 254],
  [740, 226],
  [150, 640],
  [194, 666],
  [1150, 640],
  [1194, 666],
] as const;
