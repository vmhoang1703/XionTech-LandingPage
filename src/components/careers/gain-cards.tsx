import type { ReactNode } from "react";
import { careersGain, careersGainVi } from "@/content/careers";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";

const NAVY = "#163663";
const AMBER = "#f0b300";

// The four icons from Amber's mock, recoloured to navy and amber.
const ART: ReactNode[] = [
  <svg key="learn" viewBox="0 0 90 80" fill="none" aria-hidden="true">
    <path d="M18 27L45 16L72 27L45 38Z" fill={NAVY} />
    <path
      d="M25 34V52Q45 66 65 52V34"
      stroke={NAVY}
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path d="M72 27V48" stroke={AMBER} strokeWidth="3" strokeLinecap="round" />
    <circle cx="72" cy="53" r="5" fill={AMBER} />
  </svg>,
  <svg key="ai" viewBox="0 0 90 80" fill="none" aria-hidden="true">
    <path d="M45 10L51 30L71 36L51 43L45 63L38 43L18 36L38 30Z" fill={NAVY} />
    <path d="M72 6L75 15L84 18L75 21L72 30L69 21L60 18L69 15Z" fill={AMBER} />
    <circle cx="18" cy="63" r="7" fill={AMBER} />
  </svg>,
  <svg
    key="projects"
    viewBox="0 0 90 80"
    fill="none"
    stroke={NAVY}
    strokeWidth="3"
    aria-hidden="true"
  >
    <circle cx="41" cy="41" r="26" />
    <circle cx="41" cy="41" r="15" />
    <circle cx="41" cy="41" r="4" fill={AMBER} stroke={AMBER} />
    <path
      d="M44 38L74 8M65 8H74V17"
      stroke={AMBER}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  <svg key="team" viewBox="0 0 90 80" aria-hidden="true">
    <g fill={AMBER}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="45"
          cy="20"
          rx="12"
          ry="19"
          transform={deg ? `rotate(${deg} 45 40)` : undefined}
        />
      ))}
    </g>
    <circle cx="45" cy="40" r="11" fill="#fff4cc" />
  </svg>,
];

// Careers "What you’ll gain along the way" (website copy v3):
// four staggered-height cards (amber tint, blue-grey, ice, deep navy), each
// with its number, title, line and icon. The shared reveal brings the heading
// and the cards in; hover lifts a card.
export function GainCards({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  const { heading, intro, cards } = pickLocale(locale, {
    en: careersGain,
    vi: careersGainVi,
  });

  return (
    <section id="gain" className="sec" aria-labelledby="gain-h">
      <div className="wrap">
        <div className="sec-head" data-reveal="">
          <h2 id="gain-h">{heading}</h2>
          <p className="lede">{intro}</p>
        </div>
        <ol className="gain-cards" data-reveal="">
          {cards.map((card, index) => (
            <li key={card.number} className="gain-card">
              <span className="gain-num">{card.number}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <div className="gain-art">{ART[index]}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
