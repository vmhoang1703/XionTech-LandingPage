import type { ReactNode } from "react";
import { FlipToggle } from "@/components/sections/flip-toggle";
import type { careersValues, ValueIcon } from "@/content/careers";

type Card = (typeof careersValues.cards)[number];

// Line drawings from the prototype careers.html, one per value.
const ICONS: Record<ValueIcon, ReactNode> = {
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

// One value as a flip card (E-A7 CAP-3): its number, drawing and title on the
// front, its meaning in practice on the back. FlipToggle turns it over on
// click, tap, Enter or Space and keeps the hidden face inert.
export function FlipCard({
  card,
  num,
  frontHint,
  backHint,
}: Readonly<{
  card: Card;
  num: string;
  frontHint: string;
  backHint: string;
}>) {
  return (
    <FlipToggle
      accent={"accent" in card && card.accent}
      front={
        <>
          <span className="flip-num">{num}</span>
          <svg
            className="flip-ill"
            viewBox="0 0 120 120"
            aria-hidden="true"
            focusable="false"
          >
            {ICONS[card.icon]}
          </svg>
          <span className="flip-title">{card.title}</span>
          <span className="flip-hint">{frontHint}</span>
        </>
      }
      back={
        <>
          <span className="flip-num">{`${num} · ${card.label}`}</span>
          <span>
            <span className="flip-title">{card.backTitle}</span>
            <span className="flip-text">{card.text}</span>
          </span>
          <span className="flip-hint">{backHint}</span>
        </>
      }
    />
  );
}
