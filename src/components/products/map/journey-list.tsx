"use client";

import { journeyMap } from "@/content/products";
import { MapBadge } from "./map-badge";
import { openAppDialog } from "./open-app-dialog";

// The four apps as a plain list under the map. Without JavaScript each link
// jumps to its card; with it, the app's dialog opens.
export function JourneyList() {
  return (
    <nav className="map-list" aria-label={journeyMap.listHeading}>
      <h2 className="map-list-h">{journeyMap.listHeading}</h2>
      <ul>
        {journeyMap.places.map((place) => (
          <li key={place.id}>
            <a
              href={`#${place.anchor}`}
              aria-haspopup="dialog"
              onClick={(event) => {
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                if (openAppDialog(place.anchor, event.currentTarget))
                  event.preventDefault();
              }}
            >
              <MapBadge badge={place.badge} />
              {place.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
