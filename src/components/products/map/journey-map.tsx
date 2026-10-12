import { journeyMap } from "@/content/products";
import { JourneyCanvas } from "./journey-canvas";
import { JourneyList } from "./journey-list";

// Products hero: the isometric journey map. Each island opens its app's
// detail dialog; the list under the map does the same for every width.
export function JourneyMap() {
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
        <JourneyCanvas />
        <JourneyList />
      </div>
    </section>
  );
}
