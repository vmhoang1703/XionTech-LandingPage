"use client";

import {
  ArrowRightIcon,
  FlagIcon,
  FlagCheckeredIcon,
} from "@phosphor-icons/react";
import { useState, type CSSProperties } from "react";
import { APPS, appById } from "@/content/apps";
import { dayRoad, journeyBoard, type RoadStop } from "@/content/products";
import { MapBadge } from "../map/map-badge";
import { RoadStopDialog } from "../roadmap/road-stop-dialog";

// The school day as a user-journey map: one row per person in the school,
// one column per moment of the day, and each step placed in the row of the
// person who acts. Static by design: no motion. Every card opens the step's
// modal. On narrow screens the board reads as a vertical timeline.

const STOPS = dayRoad.stops;
const LAST = STOPS.length - 1;
const LANES = journeyBoard.lanes;

type Place = CSSProperties & Record<"--col" | "--row" | "--rows", number>;

function placeOf(stop: RoadStop, index: number): Place {
  const lane = journeyBoard.laneOf[stop.id];
  const row = lane === "all" ? 2 : LANES.findIndex((l) => l.id === lane) + 2;
  return {
    "--col": index + 2,
    "--row": row,
    "--rows": lane === "all" ? LANES.length : 1,
  };
}

function laneLabel(stop: RoadStop) {
  const lane = journeyBoard.laneOf[stop.id];
  if (lane === "all") return journeyBoard.everyone;
  return LANES.find((l) => l.id === lane)?.label ?? "";
}

export function JourneyBoard() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="jb">
      <div className="jb-grid">
        {/* Decorations for the wide board: time rail, lanes, column rails. */}
        <div className="jb-corner jb-deco" aria-hidden="true">
          {journeyBoard.timeLabel}
        </div>
        {STOPS.map((stop, i) => (
          <div
            key={`tick-${stop.id}`}
            className="jb-tick jb-deco"
            style={{ "--col": i + 2 } as CSSProperties}
            aria-hidden="true"
          >
            {i === 0 ? (
              <span className="jb-end">
                <FlagIcon weight="fill" />
                {dayRoad.start}
              </span>
            ) : null}
            {i === LAST ? (
              <span className="jb-end">
                <FlagCheckeredIcon weight="fill" />
                {dayRoad.finish}
              </span>
            ) : null}
            <span className="jb-dot" />
            <span className="jb-time">{stop.time ?? ""}</span>
          </div>
        ))}
        {LANES.map((lane, r) => {
          const app = appById(lane.app);
          return (
            <div
              key={lane.id}
              className="jb-lane jb-deco"
              style={{ "--row": r + 2 } as CSSProperties}
              aria-hidden="true"
            >
              <MapBadge badge={app.badge} />
              <span>
                <strong>{lane.label}</strong>
                <span>{app.shortName}</span>
              </span>
            </div>
          );
        })}
        {LANES.map((lane, r) => (
          <div
            key={`stripe-${lane.id}`}
            className="jb-stripe jb-deco"
            style={{ "--row": r + 2 } as CSSProperties}
            aria-hidden="true"
          />
        ))}
        {STOPS.map((stop, i) => (
          <div
            key={`rail-${stop.id}`}
            className="jb-rail jb-deco"
            style={{ "--col": i + 2 } as CSSProperties}
            aria-hidden="true"
          />
        ))}

        <ol className="jb-stops">
          {STOPS.map((stop, i) => (
            <JourneyCard
              key={stop.id}
              stop={stop}
              index={i}
              onOpen={() => setOpen(i)}
            />
          ))}
        </ol>
      </div>

      <RoadStopDialog
        index={open}
        onMove={setOpen}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}

function JourneyCard({
  stop,
  index,
  onOpen,
}: Readonly<{ stop: RoadStop; index: number; onOpen: () => void }>) {
  const app = stop.app ? appById(stop.app) : null;
  const everyone = journeyBoard.laneOf[stop.id] === "all";
  return (
    <li
      className="jb-stop"
      data-everyone={everyone ? "true" : undefined}
      style={placeOf(stop, index)}
    >
      <p className="jb-kicker">
        <span className="jb-num">{index + 1}</span>
        {stop.time ? <time dateTime={stop.time}>{stop.time}</time> : null}
        <span className="jb-who">{laneLabel(stop)}</span>
      </p>
      <h3 className="jb-title">
        <button
          type="button"
          className="jb-open"
          aria-haspopup="dialog"
          onClick={onOpen}
        >
          {stop.title}
        </button>
      </h3>
      <p className="jb-text">{stop.text}</p>
      <div className="jb-foot">
        {app ? (
          <span className="jb-app">
            <MapBadge badge={app.badge} />
            {app.shortName}
          </span>
        ) : null}
        {everyone ? (
          <span className="jb-apps">
            {APPS.map((one) => (
              <MapBadge key={one.id} badge={one.badge} />
            ))}
          </span>
        ) : null}
        <span className="jb-more" aria-hidden="true">
          {journeyBoard.details}
          <ArrowRightIcon />
        </span>
      </div>
    </li>
  );
}
