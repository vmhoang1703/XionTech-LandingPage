"use client";

import { ArrowRightIcon, FlagIcon } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import {
  APPS,
  APP_TAGLINES,
  appById,
  appTaglinesVi,
  type AppId,
} from "@/content/apps";
import { useLocalized } from "@/components/layout/locale-link";
import {
  journeyBoard,
  journeyBoardVi,
  productRoad,
  productRoadVi,
  type JourneyBoard,
  type ProductRoad,
} from "@/content/products";
import { RoadStopDialog } from "../roadmap/road-stop-dialog";
import {
  FINISH,
  H,
  PAD,
  POINTS,
  ROAD,
  START,
  TREES,
  W,
  shareOf,
} from "./road-geometry";

// The products as a 2D roadmap: a winding road with a pin per product and its
// card beside it. Wide screens draw one road across the section with
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

const STOPS = productRoad.stops;
const LAST = STOPS.length - 1;
const FINISH_AT = 0.7;
// An app with no stop on the road: its old deep link (/products#iot) lands at
// the start of the roadmap.
const ALIASES = APPS.filter(
  (app) => !STOPS.some((stop) => stop === app.id),
).map((app) => app.anchor);

// The tour: the active stop is the step of the track the pinned stage has
// travelled into (each stop an equal share). Past FINISH_AT of the last step
// (after its anchor, mid-step, where a deep link lands) the road is drawn on
// to Finish. Calls `show` when either
// changes. Native scroll only: this reads the scroll position, it never sets
// it. Returns the cleanup.
function followScroll(
  map: HTMLElement,
  show: (index: number, finished: boolean) => void,
) {
  const stage = map.querySelector(".rm-stage") as HTMLElement;
  let last = "";
  const follow = () => {
    const track = map.getBoundingClientRect();
    const pinned = stage.getBoundingClientRect();
    const length = track.height - pinned.height;
    const travel = pinned.top - track.top;
    const at = length > 0 ? (travel / length) * STOPS.length : 0;
    const index = Math.min(LAST, Math.max(0, Math.floor(at)));
    const finished = at >= LAST + FINISH_AT;
    const key = `${index}${finished}`;
    if (key === last) return;
    last = key;
    show(index, finished);
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

// The smallest zoom the tour accepts. Below it (a wide but short window)
// the 11.5px text floor would grow the cards past the window (measured with
// the earlier 104px margin: 0.68 overflowed, 0.73 fitted). With the 96px
// header room plus 16px (STAGE_MARGIN), a window needs about 702px of height
// to tour: 1280x700 stays static, 1280x720 tours.
const MIN_ZOOM = 0.72;
// The stage pins at --spacing-header-room (the 72px header pill plus its
// 24px strip; the tour only runs above 1080px, where it is 96px) and keeps
// 16px below it (globals.css, .rm[data-tour="on"]).
const STAGE_MARGIN = 96 + 16;

// The tour zooms the stage with `zoom` and a tan(atan2()) ratio; without
// them the stage would be an unscaled 1400px, so the roadmap stays static.
// It also stays static when the stage would have to shrink below MIN_ZOOM.
function canTour() {
  const zoom = Math.min(
    (innerWidth - 32) / W,
    (innerHeight - STAGE_MARGIN) / H,
  );
  return (
    zoom >= MIN_ZOOM &&
    CSS.supports("zoom", "0.5") &&
    CSS.supports("width", "calc(1px * tan(atan2(1px, 2px)))")
  );
}

// The narrow road is one piece per row (Start, each stop, Finish), each its
// own stretched SVG (80 x 100). Pieces meet at x 40 heading straight down, so
// a joint looks the same whatever the rows' heights: a piece that ended at a
// slant left a wedge and a kink at the flat row edge (seen on phones). Where
// two pieces meet, each runs on a little past its row (JOIN), so a fractional
// row height leaves no hairline gap; the asphalt runs further than the edge,
// so the next piece's edge never paints across the asphalt.
type Piece = Readonly<{ from: string; curve: string; top: boolean }>;

// The bend beside each card, alternating left and right: out to the pin
// (x 13 or 67, y 50) and back.
const BEND = {
  left: {
    from: "40 0",
    curve: "C 40 25, 13 25, 13 50 C 13 75, 40 75, 40 100",
    top: true,
  },
  right: {
    from: "40 0",
    curve: "C 40 25, 67 25, 67 50 C 67 75, 40 75, 40 100",
    top: true,
  },
} satisfies Record<string, Piece>;

const JOIN = { "rm-edge": 1, "rm-asphalt": 2, "rm-line": 0 } as const;

// The three strokes of one piece. `top`: it joins a piece above at y 0; it
// always joins one below at y 100 unless it ends at a pin (y 50).
function RoadPiece({ from, curve, top }: Piece) {
  const bottom = curve.endsWith("100");
  return Object.entries(JOIN).map(([stroke, run]) => {
    const head = top ? "M40 " + -run + " L" : "M";
    const tail = bottom ? " L40 " + (100 + run) : "";
    return (
      <path
        key={stroke}
        className={stroke}
        d={head + from + " " + curve + tail}
      />
    );
  });
}

// Who the app is for.
function who(app: AppId, board: JourneyBoard) {
  return board.lanes.find((lane) => lane.app === app)?.label ?? "";
}

export function RoadMap() {
  const { stops, start, finish } = useLocalized<"productRoad", ProductRoad>(
    "productRoad",
    {
      en: productRoad,
      vi: productRoadVi,
    },
  );
  const board = useLocalized<"journeyBoard", JourneyBoard>("journeyBoard", {
    en: journeyBoard,
    vi: journeyBoardVi,
  });
  const [open, setOpen] = useState<number | null>(null);
  // The stop last opened: its pin stays highlighted after the modal closes.
  const [selected, setSelected] = useState<number | null>(null);
  const choose = (index: number) => {
    setOpen(index);
    setSelected(index);
  };
  // The tour leaves the selection alone while the modal is open (a wheel
  // over its backdrop still scrolls the page).
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  const [mode, setMode] = useState<Mode>("static");
  const tour = mode === "tour";
  const [active, setActive] = useState(0);
  // The road moves (transition) only once the tour has painted it empty at
  // Start, so it does not run back from the static full road.
  const [roadMoving, setRoadMoving] = useState(false);
  // The tour has passed the last stop: the road is drawn on to Finish.
  const [finished, setFinished] = useState(false);
  let share = 0;
  if (roadMoving) share = finished ? 1 : shareOf(active);
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
    const stopFollowing = followScroll(map, (i, end) => {
      setActive(i);
      setFinished(end);
      if (openRef.current === null) setSelected(i);
    });
    landHash(map);
    // Two frames: the first paints the road empty at Start, still; then it
    // draws on to the active stop.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setRoadMoving(true));
    });
    return () => {
      cancelAnimationFrame(frame);
      stopFollowing();
      // Leaving the tour: no pin stays selected by it, the road stops moving.
      setSelected(null);
      setRoadMoving(false);
      setFinished(false);
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
        tour
          ? ({
              "--share": share,
              "--rm-stops": STOPS.length,
            } as CSSProperties)
          : undefined
      }
    >
      {/* The anchors of apps with no stop: at the start of the roadmap. */}
      {ALIASES.map((anchor) => (
        <span key={anchor} id={anchor} className="rm-alias" />
      ))}

      {/* The tour's track: one step per stop. A stop's step holds its
          anchor, where that stop is active. */}
      {tour
        ? STOPS.map((app, i) => (
            <span
              key={app}
              id={appById(app).anchor}
              className="rm-step"
              style={{ "--step": i } as CSSProperties}
            />
          ))
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

        <RoadEnd end="start" label={start} shown={shown.has(0)} />
        <ol className="rm-stops">
          {stops.map((app, i) => (
            <RoadCard
              key={app}
              app={app}
              board={board}
              index={i}
              shown={shown.has(i)}
              anchored={!tour}
              active={tour && active === i}
              selected={selected === i}
              onOpen={() => choose(i)}
            />
          ))}
        </ol>
        <RoadEnd end="finish" label={finish} shown={shown.has(LAST)} />
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
  app: id,
  board,
  index,
  shown,
  anchored,
  active,
  selected,
  onOpen,
}: Readonly<{
  app: AppId;
  board: JourneyBoard;
  index: number;
  shown: boolean;
  anchored: boolean;
  active: boolean;
  selected: boolean;
  onOpen: () => void;
}>) {
  const app = appById(id);
  const tagline = useLocalized("appTaglines", {
    en: APP_TAGLINES,
    vi: appTaglinesVi,
  })[id];
  const point = POINTS[index];
  const bend = index % 2 === 0 ? BEND.left : BEND.right;
  const place = {
    "--x": `${(point.x / W) * 100}%`,
    "--y": `${(point.y / H) * 100}%`,
  } as CSSProperties;
  return (
    <li
      // The app's anchor (#sxp, …), unless the tour holds it on its step.
      id={anchored ? app.anchor : undefined}
      className="rm-stop"
      data-side={index % 2 === 0 ? "above" : "below"}
      data-bend={index % 2 === 0 ? "left" : "right"}
      data-first={index === 0 ? "true" : undefined}
      data-last={index === LAST ? "true" : undefined}
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
        <RoadPiece {...bend} />
      </svg>
      <span className="rm-pin" aria-hidden="true">
        {index + 1}
      </span>

      <div className="rm-card">
        <p className="rm-kicker">
          <span className="rm-who">{who(id, board)}</span>
        </p>
        <h3 className="rm-title">
          <button
            type="button"
            className="rm-open"
            aria-haspopup="dialog"
            onClick={onOpen}
          >
            <span className="sr-only">{index + 1}. </span>
            {app.shortName}
          </button>
        </h3>
        <p className="rm-text">{tagline}</p>
        <div className="rm-foot">
          <span className="rm-more" aria-hidden="true">
            {board.details}
            <ArrowRightIcon />
          </span>
        </div>
      </div>
    </li>
  );
}

// The narrow road's ends: half a bend from the flag (y 50, where the pin
// stands: x 67 on the right, 13 on the left) to the stop's joint (x 40). The
// first stop bends left, so Start comes in from the right; Finish leaves on
// the side the last stop does not bend to.
const END_BEND = {
  start: {
    box: "0 50 80 50",
    piece: { from: "67 50", curve: "C 67 75, 40 75, 40 100", top: false },
    x: 67,
  },
  finish:
    LAST % 2 === 0
      ? {
          box: "0 0 80 50",
          piece: { from: "40 0", curve: "C 40 25, 67 25, 67 50", top: true },
          x: 67,
        }
      : {
          box: "0 0 80 50",
          piece: { from: "40 0", curve: "C 40 25, 13 25, 13 50", top: true },
          x: 13,
        },
} satisfies Record<string, { box: string; piece: Piece; x: number }>;

// The road's Start or Finish marker: a flag pin on the road's end and its name.
// Wide screens place it on the drawn road; narrow ones show it above the first
// stop and below the last, joined to them by half a bend that draws in with
// that stop (`shown`). Decoration: the stops carry the content.
function RoadEnd({
  end,
  label,
  shown,
}: Readonly<{ end: "start" | "finish"; label: string; shown: boolean }>) {
  const point = end === "start" ? START : FINISH;
  const bend = END_BEND[end];
  return (
    <div
      className="rm-end"
      data-end={end}
      data-in={shown ? "true" : undefined}
      aria-hidden="true"
      style={
        {
          "--x": `${(point.x / W) * 100}%`,
          "--y": `${(point.y / H) * 100}%`,
          "--end-x": `${bend.x}px`,
        } as CSSProperties
      }
    >
      <svg
        className="rm-seg"
        viewBox={bend.box}
        preserveAspectRatio="none"
        focusable="false"
      >
        <RoadPiece {...bend.piece} />
      </svg>
      <span className="rm-end-pin">
        <FlagIcon weight="fill" />
      </span>
      <span className="rm-end-label">{label}</span>
    </div>
  );
}
