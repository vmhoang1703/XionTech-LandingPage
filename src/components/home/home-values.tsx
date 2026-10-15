import { FlipToggle } from "@/components/sections/flip-toggle";
import { ValueFlipCard } from "@/components/sections/value-flip-card";
import {
  aboutValues,
  aboutValuesVi,
  homeValuesHeading,
  homeValuesHeadingVi,
} from "@/content/values";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";

type HomeValuesProps = {
  locale?: Locale;
  /** About reuses the cards with its own ids. */
  id?: string;
  headingId?: string;
  title?: string;
  lede?: string;
  /** "drawing" is the Careers flip-card look (About); Home keeps "icon". */
  variant?: "icon" | "drawing";
};

// "What drives us" as flip cards (website copy v3). Front: icon, number and
// label, title, hint. Back: label and the line. Home and About both show it;
// About uses the Careers card (line drawing) through variant="drawing".
export function HomeValues({
  locale = "en",
  id,
  headingId = "home-values-h",
  title,
  lede,
  variant = "icon",
}: Readonly<HomeValuesProps> = {}) {
  const heading = pickLocale(locale, {
    en: homeValuesHeading,
    vi: homeValuesHeadingVi,
  });
  const values = pickLocale(locale, { en: aboutValues, vi: aboutValuesVi });
  const { frontHint, backHint } = heading;
  const drawing = variant === "drawing";

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={drawing ? "sec values-drawn" : "sec home-values"}
    >
      <div className="wrap">
        <div className="sec-head" data-reveal="">
          <h2 id={headingId}>{title ?? heading.title}</h2>
          <p className="lede">{lede ?? heading.lede}</p>
        </div>
        <div
          className={
            drawing ? "flip-cards flip-cards-drawn" : "flip-cards flip-cards-5"
          }
          data-reveal=""
        >
          {values.items.map((item) =>
            drawing ? (
              <ValueFlipCard
                key={item.number}
                num={item.number}
                label={item.label}
                title={item.title}
                text={item.text}
                drawing={item.drawing}
                accent={item.featured}
                frontHint={frontHint}
                backHint={backHint}
              />
            ) : (
              <FlipToggle
                key={item.number}
                accent={item.featured}
                front={
                  <>
                    <item.icon aria-hidden="true" className="flip-icon" />
                    <span>
                      <span className="flip-label">
                        {item.number} · {item.label}
                      </span>
                      <span className="flip-title">{item.title}</span>
                    </span>
                    <span className="flip-hint">{frontHint}</span>
                  </>
                }
                back={
                  <>
                    <span>
                      <span className="flip-label">
                        {item.number} · {item.label}
                      </span>
                      <span className="flip-text">{item.text}</span>
                    </span>
                    <span className="flip-hint">{backHint}</span>
                  </>
                }
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
