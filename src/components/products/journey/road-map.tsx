"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { APPS, appById } from "@/content/apps";
import { dayRoad, journeyBoard, type RoadStop } from "@/content/products";
import { MapBadge } from "../map/map-badge";
import { RoadStopDialog } from "../roadmap/road-stop-dialog";

// The school day as a 2D roadmap: a winding road with a pin per stop and the
// stop's card beside it. Wide screens draw one road across the section with
// the cards above and below its bends; narrow screens wind the road down the
// left of the cards.
//
// Server HTML, reduced motion and a layout switch stay "static" (fully drawn,
// nothing hidden). Wide screens with JavaScript run the scroll tour
// (data-tour="on"): the stage sticks below the header over a track of one
// step per stop; the stop whose step is in the window is active and
// selected, and the road is drawn up to it. Narrow screens are "armed": each
// stop reveals on its own as it scrolls in.

type Mode = "static" | "armed" | "tour";

// In view at load: play after this pause, so the reveal is seen.
const PLAY_AFTER_MS = 300;

// Narrow screens stack the stops down a tall list that may never be 30% in
// view (landscape phone, zoom), so each stop reveals on its own when a
// quarter of it is in view.
const NARROW = "(width < 1100px)";
const STOP_AT = 0.25;
// Tolerance for a threshold crossing reported a hair under the threshold.
const SLACK = 0.01;

// The share of an element inside the window, 0 to 1.
function seenShare(el: Element) {
  const { top, bottom, height } = el.getBoundingClientRect();
  const seen = Math.min(bottom, window.innerHeight) - Math.max(top, 0);
  return height > 0 ? seen / height : 0;
}

// Marks each stop shown once it is in view; stops already in view at load
// play shortly after load. Returns the cleanup.
function revealStops(map: HTMLElement, show: (index: number) => void) {
  const stops = Array.from(map.querySelectorAll(".rm-stop"));
  const observer = new IntersectionObserver(
    (entries, self) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.intersectionRatio < STOP_AT - SLACK)
          continue;
        show(stops.indexOf(entry.target));
        self.unobserve(entry.target);
      }
    },
    { threshold: STOP_AT },
  );
  const inView: number[] = [];
  for (const [i, stop] of stops.entries()) {
    if (seenShare(stop) > 0) inView.push(i);
    else observer.observe(stop);
  }
  const timer = setTimeout(() => {
    for (const i of inView) show(i);
  }, PLAY_AFTER_MS);
  return () => {
    clearTimeout(timer);
    observer.disconnect();
  };
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

// How much of the road leads up to a stop, 0 to 1.
function shareOf(index: number) {
  const share = (POINTS[index].x - START.x) / (FINISH.x - START.x);
  return Math.round(share * 10000) / 10000;
}

// The tour: the active stop is the step of the track the pinned stage has
// travelled into (each stop an equal share). Calls `show` when it changes.
// Native scroll only: this reads the scroll position, it never sets it.
// Returns the cleanup.
function followScroll(map: HTMLElement, show: (index: number) => void) {
  const stage = map.querySelector(".rm-stage") as HTMLElement;
  let last = -1;
  const follow = () => {
    const track = map.getBoundingClientRect();
    const pinned = stage.getBoundingClientRect();
    const length = track.height - pinned.height;
    const travel = pinned.top - track.top;
    const step = length > 0 ? Math.floor((travel / length) * STOPS.length) : 0;
    const index = Math.min(LAST, Math.max(0, step));
    if (index === last) return;
    last = index;
    show(index);
  };
  follow();
  addEventListener("scroll", follow, { passive: true });
  addEventListener("resize", follow);
  return () => {
    removeEventListener("scroll", follow);
    removeEventListener("resize", follow);
  };
}

// A deep link (/products#sxp) landed on the stop before the tour moved its
// anchor onto a step of the track: land on the step instead. Smooth (the
// page's scroll-behavior), so it takes over the browser's own smooth scroll to
// the fragment; an instant jump is undone by it. The anchors are plain
// ASCII, so the hash is not decoded (a stray "%" would throw).
function landHash(map: HTMLElement) {
  const id = location.hash.slice(1);
  const target = id ? document.getElementById(id) : null;
  if (target && map.contains(target)) {
    target.scrollIntoView();
  }
}

// The tour zooms the stage with `zoom` and a tan(atan2()) ratio; without
// them the stage would be an unscaled 1400px, so the roadmap stays static.
function canTour() {
  return (
    CSS.supports("zoom", "0.5") &&
    CSS.supports("width", "calc(1px * tan(atan2(1px, 2px)))")
  );
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
  // The stop last opened: its pin stays highlighted after the modal closes.
  const [selected, setSelected] = useState<number | null>(null);
  const choose = (index: number) => {
    setOpen(index);
    setSelected(index);
  };
  const [mode, setMode] = useState<Mode>("static");
  const tour = mode === "tour";
  const [active, setActive] = useState(0);
  // The road moves (transition) only once the tour has painted it at its
  // first stop, so it does not run back from the static full road.
  const [roadMoving, setRoadMoving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<ReadonlySet<number>>(new Set());
  const mask = useId();

  useEffect(() => {
    const map = ref.current;
    if (!map || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layout = matchMedia(NARROW);
    const wide: Mode = canTour() ? "tour" : "static";
    setMode(layout.matches ? "armed" : wide);
    const stop = layout.matches
      ? revealStops(map, (i) =>
          setShown((prev) => (prev.has(i) ? prev : new Set(prev).add(i))),
        )
      : () => undefined;
    // A resize or rotation across the breakpoint: show it all at once
    // ("static": nothing hidden, nothing moves, no tour).
    const showAll = () => {
      stop();
      setMode("static");
    };
    layout.addEventListener("change", showAll);
    return () => {
      layout.removeEventListener("change", showAll);
      stop();
    };
  }, []);

  useEffect(() => {
    const map = ref.current;
    if (!tour || !map) return;
    const stopFollowing = followScroll(map, (i) => {
      setActive(i);
      setSelected(i);
    });
    landHash(map);
    // Two frames: the first paints the road at its stop, still.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setRoadMoving(true));
    });
    return () => {
      cancelAnimationFrame(frame);
      stopFollowing();
    };
  }, [tour]);

  return (
    <div
      ref={ref}
      className="rm"
      data-reveal={mode === "armed" ? "armed" : "static"}
      data-tour={tour ? "on" : undefined}
      data-road={tour && roadMoving ? "moving" : undefined}
      style={
        tour ? ({ "--share": shareOf(active) } as CSSProperties) : undefined
      }
    >
      {/* The tour's track: one step per stop. An app stop's step holds its
          anchor, where that stop is active. */}
      {tour
        ? STOPS.map((stop, i) =>
            stop.app ? (
              <span
                key={stop.id}
                id={appById(stop.app).anchor}
                className="rm-step"
                style={{ "--step": i } as CSSProperties}
              />
            ) : null,
          )
        : null}

      <div className="rm-stage">
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

        <ol className="rm-stops">
          {STOPS.map((stop, i) => (
            <RoadCard
              key={stop.id}
              stop={stop}
              index={i}
              shown={shown.has(i)}
              anchored={!tour}
              active={tour && active === i}
              selected={selected === i}
              onOpen={() => choose(i)}
            />
          ))}
        </ol>
      </div>

      <RoadStopDialog
        index={open}
        onMove={choose}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}

function RoadCard({
  stop,
  index,
  shown,
  anchored,
  active,
  selected,
  onOpen,
}: Readonly<{
  stop: RoadStop;
  index: number;
  shown: boolean;
  anchored: boolean;
  active: boolean;
  selected: boolean;
  onOpen: () => void;
}>) {
  const app = stop.app ? appById(stop.app) : null;
  const everyone = journeyBoard.laneOf[stop.id] === "all";
  const point = POINTS[index];
  const bend = index % 2 === 0 ? BEND.left : BEND.right;
  const place = {
    "--x": `${(point.x / W) * 100}%`,
    "--y": `${(point.y / H) * 100}%`,
  } as CSSProperties;
  return (
    <li
      // The app's anchor (#sxp, …), unless the tour holds it on its step.
      id={anchored ? app?.anchor : undefined}
      className="rm-stop"
      data-side={index % 2 === 0 ? "above" : "below"}
      data-bend={index % 2 === 0 ? "left" : "right"}
      data-first={index === 0 ? "true" : undefined}
      data-last={index === LAST ? "true" : undefined}
      data-everyone={everyone ? "true" : undefined}
      data-in={shown ? "true" : undefined}
      data-active={active ? "true" : undefined}
      data-selected={selected ? "true" : undefined}
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
