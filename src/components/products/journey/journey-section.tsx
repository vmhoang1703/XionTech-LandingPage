import { dayRoad, journeyBoard, journeyMap } from "@/content/products";
import { RoadMap } from "./road-map";
import { heroWords } from "@/components/sections/hero-words";

// Products hero: the page title, then the school day as a winding roadmap.
export function JourneySection() {
  const { title, lede } = journeyMap.intro;
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
          <h2>{dayRoad.heading}</h2>
          <p>{dayRoad.lede}</p>
          <p className="rm-hint">{journeyBoard.hint}</p>
        </div>
        <RoadMap />
      </div>
    </section>
  );
}
