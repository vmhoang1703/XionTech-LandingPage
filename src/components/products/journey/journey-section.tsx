import {
  dayRoad,
  dayRoadVi,
  journeyBoard,
  journeyBoardVi,
  journeyMap,
  journeyMapVi,
  type DayRoad,
  type JourneyBoard,
} from "@/content/products";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { RoadMap } from "./road-map";

// Products hero: the page title, then the school day as a winding roadmap.
export function JourneySection({
  locale = "en",
}: Readonly<{ locale?: Locale }>) {
  const { title, lede } = pickLocale(locale, {
    en: journeyMap,
    vi: journeyMapVi,
  }).intro;
  const road = pickLocale<DayRoad>(locale, { en: dayRoad, vi: dayRoadVi });
  const board = pickLocale<JourneyBoard>(locale, {
    en: journeyBoard,
    vi: journeyBoardVi,
  });
  return (
    <section
      id="map"
      aria-labelledby="map-h"
      className="sec surface-paper map-sec"
    >
      <div className="wrap">
        <h1 id="map-h">{title}</h1>
        <p className="lede">{lede}</p>
        <div className="rm-head">
          <h2>{road.heading}</h2>
          <p>{road.lede}</p>
          <p className="rm-hint">{board.hint}</p>
        </div>
        <RoadMap />
      </div>
    </section>
  );
}
