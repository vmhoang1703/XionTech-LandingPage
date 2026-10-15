import type { ReactNode } from "react";
import { FlipToggle } from "@/components/sections/flip-toggle";

export type ValueDrawing =
  "agile" | "outcome" | "innovate" | "together" | "done";

// Line drawings from the prototype careers.html, one per value.
export const VALUE_DRAWINGS: Record<ValueDrawing, ReactNode> = {
  agile: (
    <>
      <path className="stroke" d="M28 72c9-28 34-43 62-34M88 27l4 12-13 1" />
      <path className="stroke" d="M92 50c-7 28-32 46-61 37M33 98l-5-12 13-2" />
    </>
  ),
  outcome: (
    <>
      <circle className="stroke" cx="60" cy="60" r="34" />
      <circle className="stroke" cx="60" cy="60" r="19" />
      <path className="stroke" d="M84 35l15-14M87 22h12v12" />
    </>
  ),
  innovate: (
    <>
      <path
        className="stroke"
        d="M60 22c-19 0-34 14-34 32 0 13 7 22 17 29v11h34V83c10-7 17-16 17-29 0-18-15-32-34-32Z"
      />
      <path className="stroke" d="M45 101h30M49 110h22" />
      <path className="stroke" d="M60 42v28M46 56h28" />
    </>
  ),
  together: (
    <>
      <circle className="stroke" cx="44" cy="45" r="15" />
      <circle className="stroke" cx="78" cy="49" r="12" />
      <path
        className="stroke"
        d="M19 94c2-21 13-32 27-32s26 11 28 32M65 92c2-15 10-24 21-24 9 0 17 7 20 20"
      />
    </>
  ),
  done: (
    <>
      <path className="stroke" d="M25 63l22 22 49-51" />
      <path className="stroke" d="M25 35h40M25 48h29M25 98h71" />
    </>
  ),
};

// Website copy v3: the Careers flip card (moved here from
// components/careers when the Careers values section left the page), now used
// by About "What drives us". Front: number and label, drawing, title. Back:
// number and label, the line. FlipToggle turns it over on click, tap, Enter
// or Space and keeps the hidden face inert.
export function ValueFlipCard({
  num,
  label,
  title,
  text,
  drawing,
  accent = false,
  frontHint,
  backHint,
}: Readonly<{
  num: string;
  label: string;
  title: string;
  text: string;
  drawing: ValueDrawing;
  accent?: boolean;
  frontHint: string;
  backHint: string;
}>) {
  return (
    <FlipToggle
      accent={accent}
      front={
        <>
          <span className="flip-num">{`${num} · ${label}`}</span>
          <svg
            className="flip-ill"
            viewBox="0 0 120 120"
            aria-hidden="true"
            focusable="false"
          >
            {VALUE_DRAWINGS[drawing]}
          </svg>
          <span className="flip-title">{title}</span>
          <span className="flip-hint">{frontHint}</span>
        </>
      }
      back={
        <>
          <span className="flip-num">{`${num} · ${label}`}</span>
          <span className="flip-text">{text}</span>
          <span className="flip-hint">{backHint}</span>
        </>
      }
    />
  );
}
