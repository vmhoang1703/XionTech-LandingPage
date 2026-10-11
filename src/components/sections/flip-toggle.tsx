"use client";

import { useState, type ReactNode } from "react";

// A card that turns over (globals.css, flip cards): a toggle button that
// shows its back on click, tap, Enter or Space, and its front again on the
// next. The face not on show is inert, so a screen reader reads one face
// only. Used by the Careers flip cards and the Home core values.
export function FlipToggle({
  front,
  back,
  accent = false,
}: Readonly<{ front: ReactNode; back: ReactNode; accent?: boolean }>) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className={["flip-card", accent ? "accent" : "", flipped ? "flipped" : ""]
        .filter(Boolean)
        .join(" ")}
      aria-pressed={flipped}
      onClick={() => setFlipped((on) => !on)}
    >
      <span className="flip-inner">
        <span className="flip-face flip-front" inert={flipped}>
          {front}
        </span>
        <span className="flip-face flip-back" inert={!flipped}>
          {back}
        </span>
      </span>
    </button>
  );
}
