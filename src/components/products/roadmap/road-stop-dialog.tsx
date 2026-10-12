"use client";

import { ArrowLeftIcon, ArrowRightIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { APPS, appById, type AppId } from "@/content/apps";
import { dayRoad, productDetails, productsShowcase } from "@/content/products";
import { MapBadge } from "../map/map-badge";
import { openAppDialog } from "../map/open-app-dialog";

// The modal for one stop on the school-day road: the step in full, the app
// at work there (its "Made for" line and features), and Previous/Next to walk
// the road. "See all … details" hands over to the app's own dialog.

type Props = Readonly<{
  index: number | null;
  onMove: (index: number) => void;
  onClose: () => void;
}>;

const LAST = dayRoad.stops.length - 1;

export function RoadStopDialog({ index, onMove, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  // A click on the backdrop (the dialog element itself, outside its box) closes it.
  const onClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = ref.current;
    if (!dialog || event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= box.left &&
      event.clientX <= box.right &&
      event.clientY >= box.top &&
      event.clientY <= box.bottom;
    if (!inside) dialog.close();
  };

  const stop = index === null ? null : dayRoad.stops[index];

  return (
    <dialog
      ref={ref}
      className="road-dialog"
      aria-labelledby="road-dialog-h"
      onClose={onClose}
      onClick={onClick}
    >
      {stop && index !== null ? (
        <div className="road-dialog-body">
          <div className="road-dialog-top">
            <span className="road-dialog-step">
              {index + 1} / {dayRoad.stops.length}
              {stop.time ? ` · ${stop.time}` : ""}
            </span>
            <button
              type="button"
              className="road-dialog-close"
              onClick={() => ref.current?.close()}
            >
              <XIcon aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <h2 id="road-dialog-h">{stop.title}</h2>
          <p className="road-dialog-text">{stop.text}</p>

          {stop.app ? (
            <StopApp id={stop.app} onLeave={() => ref.current?.close()} />
          ) : null}
          {!stop.app && index === LAST ? (
            <AllApps onLeave={() => ref.current?.close()} />
          ) : null}

          <div className="road-dialog-nav">
            <button
              type="button"
              className="btn btn-glass"
              disabled={index === 0}
              onClick={() => onMove(index - 1)}
            >
              <ArrowLeftIcon aria-hidden="true" />
              {index > 0 ? dayRoad.stops[index - 1].title : dayRoad.start}
            </button>
            <button
              type="button"
              className="btn btn-glass"
              disabled={index === LAST}
              onClick={() => onMove(index + 1)}
            >
              {index < LAST ? dayRoad.stops[index + 1].title : dayRoad.finish}
              <ArrowRightIcon aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

type Leave = Readonly<{ onLeave: () => void }>;

// Hands over to an app's own dialog, giving it the button as its opener.
function handOver(anchor: string, opener: HTMLElement, onLeave: () => void) {
  onLeave();
  openAppDialog(anchor, opener);
}

// The app at work at this stop: name, tagline, "Made for" and features.
function StopApp({ id, onLeave }: Readonly<{ id: AppId }> & Leave) {
  const app = appById(id);
  const detail = productDetails[id];
  return (
    <section className="road-dialog-app" aria-label={app.shortName}>
      <div className="road-dialog-app-h">
        <MapBadge badge={app.badge} />
        <div>
          <h3>{app.fullName}</h3>
          <p>{app.tagline}</p>
        </div>
      </div>
      <p className="road-dialog-made">
        {productsShowcase.madeFor}: {detail.madeFor}
      </p>
      <h4>{productsShowcase.featuresHeading}</h4>
      <ul>
        {detail.features.map((feature) => (
          <li key={feature.id}>{feature.title}</li>
        ))}
      </ul>
      <button
        type="button"
        className="btn btn-primary road-dialog-more"
        onClick={(event) => handOver(app.anchor, event.currentTarget, onLeave)}
      >
        {productsShowcase.openLabel(app.shortName)}
        <ArrowRightIcon aria-hidden="true" />
      </button>
    </section>
  );
}

// The last stop: every app that kept the day connected.
function AllApps({ onLeave }: Leave) {
  return (
    <ul className="road-dialog-apps">
      {APPS.map((one) => (
        <li key={one.id}>
          <button
            type="button"
            onClick={(event) =>
              handOver(one.anchor, event.currentTarget, onLeave)
            }
          >
            <MapBadge badge={one.badge} />
            <span>
              <strong>{one.shortName}</strong>
              <span>{one.tagline}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
