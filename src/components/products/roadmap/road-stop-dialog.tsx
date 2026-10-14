"use client";

import { ArrowLeftIcon, ArrowRightIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { useLocalized } from "@/components/layout/locale-link";
import {
  APP_TAGLINES,
  APPS,
  appById,
  appTaglinesVi,
  type AppId,
} from "@/content/apps";
import {
  dayRoad,
  dayRoadVi,
  productDetails,
  productDetailsVi,
  productsShowcase,
  productsShowcaseVi,
  roadDialog,
  roadDialogVi,
  type DayRoad,
} from "@/content/products";
import { MapBadge } from "../map/map-badge";

// The modal for one stop on the school-day road: the step in full, the app
// at work there (its "Made for" line and features), and Previous/Next to walk
// the road.

type Props = Readonly<{
  index: number | null;
  onMove: (index: number) => void;
  onClose: () => void;
}>;

const LAST = dayRoad.stops.length - 1;

export function RoadStopDialog({ index, onMove, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const road = useLocalized<"dayRoad", DayRoad>("dayRoad", {
    en: dayRoad,
    vi: dayRoadVi,
  });
  const { close } = useLocalized("roadDialog", {
    en: roadDialog,
    vi: roadDialogVi,
  });

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

  const stop = index === null ? null : road.stops[index];

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
              {index + 1} / {road.stops.length}
              {stop.time ? ` · ${stop.time}` : ""}
            </span>
            <button
              type="button"
              className="road-dialog-close"
              onClick={() => ref.current?.close()}
            >
              <XIcon aria-hidden="true" />
              <span className="sr-only">{close}</span>
            </button>
          </div>
          <h2 id="road-dialog-h">{stop.title}</h2>
          <p className="road-dialog-text">{stop.text}</p>

          {stop.app ? <StopApp id={stop.app} /> : null}
          {!stop.app && index === LAST ? <AllApps /> : null}

          <div className="road-dialog-nav">
            <button
              type="button"
              className="btn btn-glass"
              disabled={index === 0}
              onClick={() => onMove(index - 1)}
            >
              <ArrowLeftIcon aria-hidden="true" />
              {index > 0 ? road.stops[index - 1].title : road.start}
            </button>
            <button
              type="button"
              className="btn btn-glass"
              disabled={index === LAST}
              onClick={() => onMove(index + 1)}
            >
              {index < LAST ? road.stops[index + 1].title : road.finish}
              <ArrowRightIcon aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

// The app at work at this stop: name, tagline, "Made for" and features.
function StopApp({ id }: Readonly<{ id: AppId }>) {
  const app = appById(id);
  const detail = useLocalized("productDetails", {
    en: productDetails,
    vi: productDetailsVi,
  })[id];
  const taglines = useLocalized("appTaglines", {
    en: APP_TAGLINES,
    vi: appTaglinesVi,
  });
  const showcase = useLocalized("productsShowcase", {
    en: productsShowcase,
    vi: productsShowcaseVi,
  });
  return (
    <section className="road-dialog-app" aria-label={app.shortName}>
      <div className="road-dialog-app-h">
        <MapBadge badge={app.badge} />
        <div>
          <h3>{app.fullName}</h3>
          <p>{taglines[app.id]}</p>
        </div>
      </div>
      <p className="road-dialog-made">
        {showcase.madeFor}: {detail.madeFor}
      </p>
      <h4>{showcase.featuresHeading}</h4>
      <ul>
        {detail.features.map((feature) => (
          <li key={feature.id}>{feature.title}</li>
        ))}
      </ul>
    </section>
  );
}

// The last stop: every app that kept the day connected.
function AllApps() {
  const taglines = useLocalized("appTaglines", {
    en: APP_TAGLINES,
    vi: appTaglinesVi,
  });
  return (
    <ul className="road-dialog-apps">
      {APPS.map((one) => (
        <li key={one.id}>
          <MapBadge badge={one.badge} />
          <span>
            <strong>{one.shortName}</strong>
            <span>{taglines[one.id]}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
