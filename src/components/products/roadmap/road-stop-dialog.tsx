"use client";

import { ArrowLeftIcon, ArrowRightIcon, XIcon } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useLocalized } from "@/components/layout/locale-link";
import {
  APP_TAGLINES,
  appById,
  appTaglinesVi,
  type AppId,
} from "@/content/apps";
import {
  productDetails,
  productDetailsVi,
  productRoad,
  productRoadVi,
  productsShowcase,
  productsShowcaseVi,
  roadDialog,
  roadDialogVi,
  type ProductRoad,
} from "@/content/products";
import { MapBadge } from "../map/map-badge";

// The 3D scene behind the card is built on the first click on a stop: its code
// and stylesheet do not load with the page.
const ProductScene = dynamic(
  () => import("../scene/product-scene").then((m) => m.ProductScene),
  { ssr: false },
);

// The modal for one stop on the road, which is one product: its name, its
// tagline, who it is made for and its features, and Previous/Next to walk the
// road. Behind the card, the product's name stands up as 3D towers on a piece
// of the road. The scene is decoration; the card has the text.

type Props = Readonly<{
  index: number | null;
  onMove: (index: number) => void;
  onClose: () => void;
}>;

const LAST = productRoad.stops.length - 1;

export function RoadStopDialog({ index, onMove, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const road = useLocalized<"productRoad", ProductRoad>("productRoad", {
    en: productRoad,
    vi: productRoadVi,
  });
  const taglines = useLocalized("appTaglines", {
    en: APP_TAGLINES,
    vi: appTaglinesVi,
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

  // A click anywhere outside the card (the scene fills the window) closes it,
  // unless the press began in the card: a text selection dragged out of it
  // ends with a click on the scene.
  const pressedInCard = useRef(false);
  const inCard = (target: EventTarget) =>
    (target as Element).closest(".road-dialog-body") !== null;
  const onPointerDown = (event: React.PointerEvent<HTMLDialogElement>) => {
    pressedInCard.current = inCard(event.target);
  };
  const onClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (inCard(event.target) || pressedInCard.current) return;
    ref.current?.close();
  };

  const id = index === null ? null : road.stops[index];
  const app = id === null ? null : appById(id);
  // The neighbour's name, or the end of the road.
  const name = (at: number, end: string) =>
    road.stops[at] ? appById(road.stops[at]).shortName : end;

  return (
    <dialog
      ref={ref}
      className="road-dialog"
      aria-labelledby="road-dialog-h"
      onClose={onClose}
      onPointerDown={onPointerDown}
      onClick={onClick}
    >
      {app && id && index !== null ? (
        <>
          <ProductScene index={index} app={id} />
          <div className="road-dialog-body">
            <div className="road-dialog-top">
              <span className="road-dialog-step">
                {index + 1} / {road.stops.length}
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
            <h2 id="road-dialog-h">{app.fullName}</h2>
            <p className="road-dialog-text">{taglines[id]}</p>

            <StopApp id={id} />

            <div className="road-dialog-nav">
              <button
                type="button"
                className="btn btn-glass"
                disabled={index === 0}
                onClick={() => onMove(index - 1)}
              >
                <ArrowLeftIcon aria-hidden="true" />
                {name(index - 1, road.start)}
              </button>
              <button
                type="button"
                className="btn btn-glass"
                disabled={index === LAST}
                onClick={() => onMove(index + 1)}
              >
                {name(index + 1, road.finish)}
                <ArrowRightIcon aria-hidden="true" />
              </button>
            </div>
          </div>
        </>
      ) : null}
    </dialog>
  );
}

// The product at this stop: who it is made for, and its features.
function StopApp({ id }: Readonly<{ id: AppId }>) {
  const app = appById(id);
  const detail = useLocalized("productDetails", {
    en: productDetails,
    vi: productDetailsVi,
  })[id];
  const showcase = useLocalized("productsShowcase", {
    en: productsShowcase,
    vi: productsShowcaseVi,
  });
  return (
    <section className="road-dialog-app" aria-label={app.shortName}>
      <div className="road-dialog-app-h">
        <MapBadge badge={app.badge} />
        <p className="road-dialog-made">
          {showcase.madeFor}: {detail.madeFor}
        </p>
      </div>
      <h3>{showcase.featuresHeading}</h3>
      <ul>
        {detail.features.map((feature) => (
          <li key={feature.id}>{feature.title}</li>
        ))}
      </ul>
    </section>
  );
}
