"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/layout/locale-link";
import { careersGrowth, careersGrowthVi } from "@/content/careers";
import { pickLocale } from "@/i18n/content";

// Angle of each step on the ring, clockwise from the top (prototype careers.html).
const ANGLES = [-90, -18, 54, 126, 198];
// The ring plays once 40% of it is visible: first step after 1.2s, then one
// step every 2.6s (prototype site.js).
const PLAY_AT = 0.4;
const FIRST_STEP_MS = 1200;
const STEP_MS = 2600;

const dotAt = (angle: number) =>
  `rotate(${angle}deg) translateX(var(--cycle-radius)) rotate(${-angle}deg)`;

// The Growth Learning Model (E-A7 CAP-1). The amber dot travels once round
// the ring, lighting each step, and rests on the last. Server HTML and
// reduced motion show the first step and never move.
export function GrowthRing() {
  const { caption, center, steps } = pickLocale(useLocale(), {
    en: careersGrowth,
    vi: careersGrowthVi,
  });
  const [current, setCurrent] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let timer = 0;
    let played = false;
    const next = (step: number) => {
      setCurrent(step);
      if (step + 1 < ANGLES.length) {
        timer = window.setTimeout(() => next(step + 1), STEP_MS);
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (played || !entries.at(-1)?.isIntersecting) return;
        played = true;
        observer.disconnect();
        timer = window.setTimeout(() => next(1), FIRST_STEP_MS);
      },
      { threshold: PLAY_AT },
    );
    observer.observe(stage);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <figure className="cycle" aria-label={`${caption}: ${steps.join(", ")}`}>
      <div ref={stageRef} className="cycle-stage" aria-hidden="true">
        <div className="cycle-ring" />
        <div
          className="cycle-dot"
          style={{ transform: dotAt(ANGLES[current]) }}
        />
        <div className="cycle-center">
          <strong>{center}</strong>
        </div>
        {steps.map((step, index) => (
          <div
            key={step}
            className={index === current ? "cycle-node current" : "cycle-node"}
            data-step={index + 1}
          >
            <span className="stepno">{String(index + 1).padStart(2, "0")}</span>
            <span>{step}</span>
          </div>
        ))}
      </div>
      {/* The figure's name already says it, so it is read once. */}
      <figcaption aria-hidden="true">{caption}</figcaption>
    </figure>
  );
}
