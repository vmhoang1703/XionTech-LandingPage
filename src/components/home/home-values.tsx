import { FlipToggle } from "@/components/sections/flip-toggle";
import {
  aboutValues,
  aboutValuesVi,
  homeValuesHeading,
  homeValuesHeadingVi,
} from "@/content/values";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";

// Home core values as flip cards: the front shows the icon, the title and a
// short line; the back the full value. Home is the only page with them. No
// id="values": the About page no longer has that anchor either.
export function HomeValues({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  const heading = pickLocale(locale, {
    en: homeValuesHeading,
    vi: homeValuesHeadingVi,
  });
  const values = pickLocale(locale, { en: aboutValues, vi: aboutValuesVi });
  const { frontHint, backHint } = heading;

  return (
    <section aria-labelledby="home-values-h" className="sec home-values">
      <div className="wrap">
        <div className="sec-head" data-reveal="">
          <h2 id="home-values-h">{heading.title}</h2>
          <p className="lede">{heading.lede}</p>
        </div>
        <div className="flip-cards" data-reveal="">
          {values.items.map(
            ({ icon: ValueIcon, title, short, text, featured }) => (
              <FlipToggle
                key={title}
                accent={featured}
                front={
                  <>
                    <ValueIcon aria-hidden="true" className="flip-icon" />
                    <span>
                      <span className="flip-title">{title}</span>
                      <span className="flip-text">{short}</span>
                    </span>
                    <span className="flip-hint">{frontHint}</span>
                  </>
                }
                back={
                  <>
                    <span>
                      <span className="flip-title">{title}</span>
                      <span className="flip-text">{text}</span>
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
