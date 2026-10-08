"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { productsHero } from "@/content/products";
import {
  readMotionPaused,
  saveMotionPaused,
} from "@/lib/motion/motion-preference";

// Client island for the Products hero: the drifting glows and the Pause
// motion button. The choice is shared with the Home silk (one stored key).
// Before hydration, and with no JavaScript, the button is not rendered and
// the glows follow CSS alone (still under reduced motion).
export function EcoMotion() {
  const [paused, setPaused] = useState<boolean | null>(null);

  useEffect(() => {
    setPaused(readMotionPaused());
  }, []);

  let motion: "on" | "off" | undefined;
  if (paused !== null) motion = paused ? "off" : "on";
  const { pause, play } = productsHero.motion;

  return (
    <>
      <div className="eco-bg" aria-hidden="true" data-motion={motion}>
        <i className="g1" />
        <i className="g2" />
        <i className="g3" />
        <i className="sheen" />
      </div>
      {paused === null ? null : (
        <button
          type="button"
          className="eco-toggle"
          onClick={() => {
            saveMotionPaused(!paused);
            setPaused(!paused);
          }}
        >
          {paused ? (
            <PlayIcon aria-hidden="true" weight="fill" />
          ) : (
            <PauseIcon aria-hidden="true" weight="fill" />
          )}
          <span>{paused ? play : pause}</span>
        </button>
      )}
    </>
  );
}
