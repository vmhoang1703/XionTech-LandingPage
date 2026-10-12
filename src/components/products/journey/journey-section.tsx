import { dayRoad, journeyBoard, journeyMap } from "@/content/products";
import { JourneyBoard } from "./journey-board";

// Products hero: the page title, then the school day as a journey map.
export function JourneySection() {
  const { title, lede } = journeyMap.intro;
  return (
    <section
      id="map"
      aria-labelledby="map-h"
      className="sec surface-paper map-sec"
    >
      <div className="wrap">
        <h1 id="map-h">{title}</h1>
        <p className="lede">{lede}</p>
        <div className="jb-head">
          <h2>{dayRoad.heading}</h2>
          <p>{dayRoad.lede}</p>
          <p className="jb-hint">{journeyBoard.hint}</p>
        </div>
        <JourneyBoard />
      </div>
    </section>
  );
}
