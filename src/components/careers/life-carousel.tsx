"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { careersLife } from "@/content/careers";
import type { LifeSlide } from "@/lib/careers/life-photos";

const SWIPE_PX = 45;
const PLACES: Record<number, string> = { 0: "current", 1: "next" };

/** The slide `step` places from `index`, looping round. */
export const loop = (index: number, step: number, count: number) =>
  (((index + step) % count) + count) % count;

// "Life at XionTech" photo carousel (website copy v3).
// The current photo sits in the middle, larger and raised; its neighbours
// show smaller at the sides. Arrows, arrow keys and a horizontal swipe move
// one photo and loop. No slides: no section.
export function LifeCarousel({
  slides,
  copy,
}: Readonly<{
  slides: readonly LifeSlide[];
  copy: Pick<typeof careersLife, "heading" | "prevLabel" | "nextLabel">;
}>) {
  const [index, setIndex] = useState(0);
  const touch = useRef<number | null>(null);
  const count = slides.length;
  if (count === 0) return null;
  const go = (step: number) => setIndex((i) => loop(i, step, count));

  return (
    <section
      id="life-photos"
      className="sec life"
      aria-labelledby="life-photos-h"
    >
      <div className="wrap">
        <h2 id="life-photos-h" className="life-h" data-reveal="">
          {copy.heading}
        </h2>
        <div
          className="life-stage"
          role="group"
          aria-roledescription="carousel"
          aria-label={copy.heading}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              go(1);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              go(-1);
            }
          }}
          onTouchStart={(event) => {
            touch.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = touch.current;
            touch.current = null;
            const end = event.changedTouches[0]?.clientX;
            if (start == null || end == null) return;
            if (Math.abs(end - start) > SWIPE_PX) go(end < start ? 1 : -1);
          }}
        >
          {slides.map((slide, i) => {
            const offset = loop(i, -index, count);
            const place =
              PLACES[offset] ?? (offset === count - 1 ? "prev" : "away");
            return (
              <figure
                key={slide.src}
                className={`life-slide ${place}`}
                aria-hidden={place === "current" ? undefined : true}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  width={1600}
                  height={1000}
                  sizes="(width <= 640px) 86vw, 56vw"
                />
                <figcaption className="life-cap">{slide.caption}</figcaption>
              </figure>
            );
          })}
        </div>
        <div className="life-controls">
          <button
            type="button"
            className="life-arrow"
            aria-label={copy.prevLabel}
            onClick={() => go(-1)}
          >
            <ArrowLeftIcon aria-hidden="true" />
          </button>
          <p className="life-count" aria-live="polite">
            {index + 1} / {count}
          </p>
          <button
            type="button"
            className="life-arrow"
            aria-label={copy.nextLabel}
            onClick={() => go(1)}
          >
            <ArrowRightIcon aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
