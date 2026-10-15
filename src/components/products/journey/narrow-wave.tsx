"use client";

import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import { RoadTree } from "./road-tree";

// The narrow road as one smooth wave, like the wide road: it runs through the
// pins (Start's flag, each stop's number, Finish's flag) and leaves and
// reaches each pin heading straight down, so its bends are as soft as the wide
// road's. It is measured from the laid-out pins, so it follows the cards'
// heights. Before it is measured (server HTML, no JavaScript) each row draws
// its own bend (road-map.tsx, RoadPiece).

type Point = Readonly<{ x: number; y: number }>;
export type Wave = Readonly<{ width: number; height: number; points: Point[] }>;

// A smooth road through the points: each bend leaves and arrives upright (the
// wide road's roadPath, turned a quarter).
export function wavePath(points: readonly Point[]) {
  let d = "M" + points[0].x + " " + points[0].y;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const mid = (b.y - a.y) / 2;
    d +=
      " C " + a.x + " " + (a.y + mid) + ", " + b.x + " " + (b.y - mid) + ", ";
    d += b.x + " " + b.y;
  }
  return d;
}

// Fewer trees on the narrow road: one beside each pin on the left of the
// column (where the road bends away from the cards), in the open ground
// between the road and the card. None where that ground is too narrow.
export function waveTrees(wave: Wave) {
  const stops = wave.points.slice(1, -1);
  const mid = wave.points[0].x;
  return stops
    .filter((pin) => pin.x < mid - 20)
    .map((pin) => ({ x: Math.round(pin.x + 42), y: Math.round(pin.y + 12) }));
}

// Each pair is a little grove: a tall tree behind a fuller one.
const NARROW_KINDS = [
  ["poplar", "round"],
  ["pine", "blossom"],
  ["birch", "pine"],
] as const;

const PINS = ".rm-end-pin, .rm-pin";

// Measures the pins' centres inside the stage, again whenever the stage
// changes size (fonts, rotation, a card's text wrapping). Null until there is
// a laid-out stage with a pin for each end and stop.
export function useWave(stage: RefObject<HTMLElement | null>, count: number) {
  const [wave, setWave] = useState<Wave | null>(null);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const points = Array.from(el.querySelectorAll(PINS), (pin) => {
        const r = pin.getBoundingClientRect();
        const x = r.left + r.width / 2 - box.left;
        const y = r.top + r.height / 2 - box.top;
        return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
      });
      const laidOut = box.height > 0 && points.length === count;
      setWave(
        laidOut ? { width: box.width, height: box.height, points } : null,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [stage, count]);
  return wave;
}

// How far down the wave is drawn: from Start to the pin of the last stop
// shown (Start is pin 0, stop i is pin i + 1), on to Finish's pin once the
// last stop is shown, or all of it when nothing is armed. It ends exactly at
// the centre of a pin, never past it.
export function reachOf(
  wave: Wave,
  shown: ReadonlySet<number>,
  armed: boolean,
) {
  if (!armed) return wave.height;
  if (shown.size === 0) return 0;
  const pin = Math.max(...shown) + 1;
  const last = wave.points.length - 1;
  return wave.points[pin >= last - 1 ? last : pin].y;
}

export function NarrowWave({
  wave,
  shown,
  armed,
}: Readonly<{ wave: Wave; shown: ReadonlySet<number>; armed: boolean }>) {
  const d = wavePath(wave.points);
  return (
    <>
      <svg
        className="rm-wave"
        viewBox={"0 0 " + wave.width + " " + wave.height}
        aria-hidden="true"
        focusable="false"
        style={
          { "--reach": reachOf(wave, shown, armed) + "px" } as CSSProperties
        }
      >
        <path className="rm-edge" d={d} />
        <path className="rm-asphalt" d={d} />
        <path className="rm-line" d={d} />
      </svg>
      {/* The trees stand outside the wave's clip: whole from the start. */}
      <svg
        className="rm-wave rm-wave-trees"
        viewBox={"0 0 " + wave.width + " " + wave.height}
        aria-hidden="true"
        focusable="false"
      >
        {waveTrees(wave).map(({ x, y }, i) => {
          const [tall, full] = NARROW_KINDS[i % NARROW_KINDS.length];
          return (
            <g key={`${x}-${y}`}>
              <RoadTree x={x - 10} y={y - 5} size={0.48} kind={tall} />
              <RoadTree x={x + 4} y={y + 2} size={0.5} kind={full} />
            </g>
          );
        })}
      </svg>
    </>
  );
}
