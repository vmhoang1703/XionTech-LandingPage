import { journeyMap } from "@/content/products";
import { DayTour } from "./day-tour";

// Products hero: one school day as a guided 3D tour from Start to Finish.
export function DayRoadmap() {
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
        <DayTour />
      </div>
    </section>
  );
}
