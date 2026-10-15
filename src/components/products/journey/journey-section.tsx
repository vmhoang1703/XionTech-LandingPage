import { homeApps, homeAppsVi } from "@/content/home";
import { journeyMap, journeyMapVi } from "@/content/products";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { RoadMap } from "./road-map";
import { heroWords } from "@/components/sections/hero-words";

// Products hero: the page title, then the three products as a winding roadmap.
export function JourneySection({
  locale = "en",
}: Readonly<{ locale?: Locale }>) {
  const { title, lede } = pickLocale(locale, {
    en: journeyMap,
    vi: journeyMapVi,
  }).intro;
  // The roadmap's heading is Home's heading for the same apps.
  const { title: heading } = pickLocale(locale, {
    en: homeApps,
    vi: homeAppsVi,
  });
  const t = heroWords();
  return (
    <section
      id="map"
      aria-labelledby="map-h"
      className="sec surface-paper map-sec"
    >
      <div className="wrap">
        <h1 id="map-h">{t.words(title)}</h1>
        <p className="lede">{lede}</p>
        <div className="rm-head">
          <h2>{heading}</h2>
        </div>
        <RoadMap />
      </div>
    </section>
  );
}
