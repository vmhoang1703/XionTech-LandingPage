import { careersInside, careersInsideVi } from "@/content/careers";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";

// Server Component. Inside XionTech: five text tiles, no links (E-A7 CAP-2).
// Navy tiles use the base `.ins-card` look; the others add their tone.
export function Inside({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  const { heading, lede, tiles } = pickLocale(locale, {
    en: careersInside,
    vi: careersInsideVi,
  });

  return (
    <section id="life" className="sec" aria-labelledby="life-h">
      <div className="wrap">
        <div className="sec-head ins-head" data-reveal="">
          <h2 id="life-h">{heading}</h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="ins-grid" data-reveal="">
          {tiles.map(({ tag, title, text, tone, big }) => (
            <article
              key={title}
              className={[
                "ins-card",
                big ? "big" : undefined,
                tone === "navy" ? undefined : tone,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="ins-tag">{tag}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
