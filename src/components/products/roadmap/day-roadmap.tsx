import { dayRoad, journeyMap } from "@/content/products";
import { RoadCanvas } from "./road-canvas";

// Products hero: one school day as a 3D road from Start to Finish. Each stop
// with an app opens that app's detail dialog.
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
        <h2 className="road-h">{dayRoad.heading}</h2>
        <p className="road-lede">{dayRoad.lede}</p>
        <RoadCanvas />
      </div>
    </section>
  );
}
