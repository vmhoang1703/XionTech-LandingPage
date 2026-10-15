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
// road (none before the first stop or after the last). Behind the card, the
// product's device (a phone, a laptop or a monitor) stands on a piece of the
// road. The scene is decoration; the card has the text. It fades out as it
// closes (the Close button, Esc or a click outside), at once with reduced
// motion; the browser then returns focus to the dot that opened it.

type Props = Readonly<{
  index: number | null;
  onMove: (index: number) => void;
  onClose: () => void;
}>;

// The exit animations in globals.css (the card sinks, all of it fades).
const EXIT = ["rd-fade-out", "rd-sink"];

export type RoadEndId = "start" | "finish";

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
  const { close, previous, next } = useLocalized("roadDialog", {
    en: roadDialog,
    vi: roadDialogVi,
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
    // A new stop starts at its top: Next is pressed at the card's bottom.
    const body = dialog.querySelector(".road-dialog-body");
    if (body) body.scrollTop = 0;
  }, [index]);

  // Closes with its exit animation: the dialog is marked closing, and closes
  // once its animations have finished (none with reduced motion, or where the
  // browser runs none: then at once).
  const closing = useRef(false);
  const shut = () => {
    const dialog = ref.current;
    if (!dialog?.open || closing.current) return;
    const still =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || typeof dialog.getAnimations !== "function") {
      dialog.close();
      return;
    }
    closing.current = true;
    dialog.dataset.closing = "true";
    const done = () => {
      closing.current = false;
      delete dialog.dataset.closing;
      dialog.close();
    };
    // Only the exit's own animations: the scene's loops never end.
    const running = dialog
      .getAnimations({ subtree: true })
      .filter(
        (a) => a instanceof CSSAnimation && EXIT.includes(a.animationName),
      );
    if (running.length === 0) return done();
    Promise.allSettled(running.map((a) => a.finished)).then(done);
  };
  // Esc animates out too.
  const onCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    shut();
  };

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
    shut();
  };

  const id = index === null ? null : road.stops[index];
  const app = id === null ? null : appById(id);
  const before = index === null ? null : road.stops[index - 1];
  const after = index === null ? null : road.stops[index + 1];
  return (
    <dialog
      ref={ref}
      className="road-dialog"
      aria-labelledby="road-dialog-h"
      onClose={onClose}
      onCancel={onCancel}
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
                onClick={shut}
              >
                <XIcon aria-hidden="true" />
                <span className="sr-only">{close}</span>
              </button>
            </div>
            {/* The app's name, and its logo on the right of the same row. */}
            <div className="road-dialog-name">
              <h2 id="road-dialog-h">{app.fullName}</h2>
              <MapBadge badge={app.badge} />
            </div>
            <p className="road-dialog-text">{taglines[id]}</p>

            <StopApp id={id} />

            <div className="road-dialog-nav">
              {before ? (
                <button
                  type="button"
                  className="road-dialog-go"
                  data-dir="prev"
                  onClick={() => onMove(index - 1)}
                >
                  <span className="road-dialog-go-arrow" aria-hidden="true">
                    <ArrowLeftIcon />
                  </span>
                  <span className="road-dialog-go-text">
                    <span className="road-dialog-go-label">{previous}</span>{" "}
                    {appById(before).shortName}
                  </span>
                </button>
              ) : (
                <span className="road-dialog-go-gap" aria-hidden="true" />
              )}
              {after ? (
                <button
                  type="button"
                  className="road-dialog-go"
                  data-dir="next"
                  onClick={() => onMove(index + 1)}
                >
                  <span className="road-dialog-go-text">
                    <span className="road-dialog-go-label">{next}</span>{" "}
                    {appById(after).shortName}
                  </span>
                  <span className="road-dialog-go-arrow" aria-hidden="true">
                    <ArrowRightIcon />
                  </span>
                </button>
              ) : (
                <span className="road-dialog-go-gap" aria-hidden="true" />
              )}
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
      <p className="road-dialog-made">
        {showcase.madeFor}: {detail.madeFor}
      </p>
      <h3>{showcase.featuresHeading}</h3>
      <ul>
        {detail.features.map((feature) => (
          <li key={feature.id}>{feature.title}</li>
        ))}
      </ul>
    </section>
  );
}
