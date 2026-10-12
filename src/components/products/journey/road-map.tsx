"use client";

import {
  ArrowRightIcon,
  FlagCheckeredIcon,
  FlagIcon,
} from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { APPS, appById } from "@/content/apps";
import { dayRoad, journeyBoard, type RoadStop } from "@/content/products";
import { MapBadge } from "../map/map-badge";
import { RoadStopDialog } from "../roadmap/road-stop-dialog";

// The school day as a 2D roadmap: a winding road from Start to Finish with a
// pin per stop and the stop's card beside it. Wide screens draw one road
// across the section with the cards above and below its bends; narrow
// screens wind the road down the left of the cards.
//
// The draw-in follows FlowReveal: server HTML and reduced motion stay
// "static" (fully drawn); a roadmap already 30% in view at load goes straight
// to "on"; otherwise it is "armed" (dimmed, road masked) until 30% visible,
// then "on", once. The road draws at a steady pace, so each stop's delay is
// the road's duration times its share of the route.

type Phase = "static" | "armed" | "on";

const REVEAL_AT = 0.3;
const ROAD_SECONDS = 1.6;

// Narrow screens stack the stops down a tall list that may never be 30% in
// view (landscape phone, zoom), so each stop reveals on its own when a
// quarter of it is in view.
const NARROW = "(width < 1100px)";
const STOP_AT = 0.25;

// The share of an element inside the window, 0 to 1.
function seenShare(el: Element) {
  const { top, bottom, height } = el.getBoundingClientRect();
  const seen = Math.min(bottom, window.innerHeight) - Math.max(top, 0);
  return height > 0 ? seen / height : 0;
}

// Calls `show` once 30% of the roadmap is in view. Returns the cleanup.
function revealMap(map: HTMLElement, show: () => void) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      show();
      observer.disconnect();
    },
    { threshold: REVEAL_AT },
  );
  observer.observe(map);
  return () => observer.disconnect();
}

// Marks each stop shown once it is in view; stops already in view at load
// are shown at once. Returns the cleanup.
function revealStops(map: HTMLElement, show: (index: number) => void) {
  const stops = Array.from(map.querySelectorAll(".rm-stop"));
  const observer = new IntersectionObserver(
    (entries, self) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(stops.indexOf(entry.target));
        self.unobserve(entry.target);
      }
    },
    { threshold: STOP_AT },
  );
  for (const [i, stop] of stops.entries()) {
    if (seenShare(stop) >= STOP_AT) show(i);
    else observer.observe(stop);
  }
  return () => observer.disconnect();
}

const STOPS = dayRoad.stops;
const LAST = STOPS.length - 1;

// The wide road's drawing space and its stops (peaks and troughs).
const W = 1400;
const H = 820;
// The road runs past the drawing at both ends; the mask must reach it.
const PAD = 100;
const START = { x: -20, y: 430 };
const FINISH = { x: 1420, y: 420 };
const POINTS = STOPS.map((_, i) => ({
  x: 150 + i * 220,
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

const ROAD = roadPath();

// When the drawing road reaches a stop, in seconds.
function delayOf(index: number) {
  const share = (POINTS[index].x - START.x) / (FINISH.x - START.x);
  return `${Math.round(ROAD_SECONDS * share * 1000) / 1000}s`;
}

// Trees in the open ground between the cards.
const TREES = [
  [360, 230],
  [400, 254],
  [800, 226],
  [840, 250],
  [1240, 230],
  [1280, 252],
  [140, 640],
  [184, 666],
  [580, 644],
  [620, 670],
  [1020, 640],
  [1064, 664],
] as const;

// The narrow road's bend beside each card, alternating left and right.
const BEND = {
  left: "M40 0 C 4 30, 4 70, 40 100",
  right: "M40 0 C 76 30, 76 70, 40 100",
};

function who(stop: RoadStop) {
  const lane = journeyBoard.laneOf[stop.id];
  if (lane === "all") return journeyBoard.everyone;
  return journeyBoard.lanes.find((l) => l.id === lane)?.label ?? "";
}

export function RoadMap() {
  const [open, setOpen] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("static");
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<ReadonlySet<number>>(new Set());
  const mask = useId();

  useEffect(() => {
    const map = ref.current;
    if (!map || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layout = matchMedia(NARROW);
    const narrow = layout.matches;
    // Already 30% on screen at load: show it as is (no hide, no replay).
    if (!narrow && seenShare(map) >= REVEAL_AT) {
      setPhase("on");
      return;
    }
    setPhase("armed");
    // A resize or rotation across the breakpoint mid-reveal: show it all.
    const showAll = () => {
      setPhase("on");
      setShown(new Set(STOPS.keys()));
    };
    layout.addEventListener("change", showAll);
    const stop = narrow
      ? revealStops(map, (i) =>
          setShown((prev) => (prev.has(i) ? prev : new Set(prev).add(i))),
        )
      : revealMap(map, () => setPhase("on"));
    return () => {
      layout.removeEventListener("change", showAll);
      stop();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="rm"
      data-reveal={phase}
      style={{ "--road": `${ROAD_SECONDS}s` } as CSSProperties}
    >
      <svg
        className="rm-road"
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Draws the road: a white stroke along it, revealed by dashoffset. */}
          <mask
            id={mask}
            maskUnits="userSpaceOnUse"
            x={-PAD}
            y={-PAD}
            width={W + 2 * PAD}
            height={H + 2 * PAD}
          >
            <path className="rm-draw" d={ROAD} pathLength="1" />
          </mask>
        </defs>
        <ellipse className="rm-hill" cx="260" cy="760" rx="420" ry="150" />
        <ellipse className="rm-hill" cx="1080" cy="110" rx="460" ry="150" />
        <ellipse
          className="rm-hill rm-hill-soft"
          cx="760"
          cy="780"
          rx="380"
          ry="120"
        />
        {TREES.map(([x, y]) => (
          <g
            key={`${x}-${y}`}
            className="rm-tree"
            transform={`translate(${x} ${y})`}
          >
            <rect x="-3" y="10" width="6" height="16" rx="2" />
            <circle r="18" />
          </g>
        ))}
        <g mask={`url(#${mask})`}>
          <path className="rm-edge" d={ROAD} />
          <path className="rm-asphalt" d={ROAD} />
          <path className="rm-line" d={ROAD} />
        </g>
      </svg>

      <p className="rm-end">
        <FlagIcon aria-hidden="true" weight="fill" />
        {dayRoad.start}
      </p>

      <ol className="rm-stops">
        {STOPS.map((stop, i) => (
          <RoadCard
            key={stop.id}
            stop={stop}
            index={i}
            shown={shown.has(i)}
            onOpen={() => setOpen(i)}
          />
        ))}
      </ol>

      <p className="rm-end rm-end-finish">
        <FlagCheckeredIcon aria-hidden="true" weight="fill" />
        {dayRoad.finish}
      </p>

      <RoadStopDialog
        index={open}
        onMove={setOpen}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}

function RoadCard({
  stop,
  index,
  shown,
  onOpen,
}: Readonly<{
  stop: RoadStop;
  index: number;
  shown: boolean;
  onOpen: () => void;
}>) {
  const app = stop.app ? appById(stop.app) : null;
  const everyone = journeyBoard.laneOf[stop.id] === "all";
  const point = POINTS[index];
  const bend = index % 2 === 0 ? BEND.left : BEND.right;
  const place = {
    "--x": `${(point.x / W) * 100}%`,
    "--y": `${(point.y / H) * 100}%`,
    "--delay": delayOf(index),
  } as CSSProperties;
  return (
    <li
      className="rm-stop"
      data-side={index % 2 === 0 ? "above" : "below"}
      data-bend={index % 2 === 0 ? "left" : "right"}
      data-first={index === 0 ? "true" : undefined}
      data-last={index === LAST ? "true" : undefined}
      data-everyone={everyone ? "true" : undefined}
      data-in={shown ? "true" : undefined}
      style={place}
    >
      {/* The narrow road: one bend per stop, drawn beside the card. */}
      <svg
        className="rm-seg"
        viewBox="0 0 80 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path className="rm-edge" d={bend} />
        <path className="rm-asphalt" d={bend} />
        <path className="rm-line" d={bend} />
      </svg>
      <span className="rm-pin" aria-hidden="true">
        {index + 1}
      </span>

      <div className="rm-card">
        <p className="rm-kicker">
          {stop.time ? <time dateTime={stop.time}>{stop.time}</time> : null}
          <span className="rm-who">{who(stop)}</span>
        </p>
        <h3 className="rm-title">
          <button
            type="button"
            className="rm-open"
            aria-haspopup="dialog"
            onClick={onOpen}
          >
            <span className="sr-only">{index + 1}. </span>
            {stop.title}
          </button>
        </h3>
        <p className="rm-text">{stop.text}</p>
        <div className="rm-foot">
          {app ? (
            <span className="rm-app">
              <MapBadge badge={app.badge} />
              {app.shortName}
            </span>
          ) : null}
          {everyone ? (
            <span className="rm-apps">
              {APPS.map((one) => (
                <MapBadge key={one.id} badge={one.badge} />
              ))}
            </span>
          ) : null}
          <span className="rm-more" aria-hidden="true">
            {journeyBoard.details}
            <ArrowRightIcon />
          </span>
        </div>
      </div>
    </li>
  );
}
