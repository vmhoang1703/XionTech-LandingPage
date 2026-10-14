import { describe, expect, it } from "vitest";
import { APPS } from "@/content/apps";
import { dayRoad, dayRoadVi } from "@/content/products";
import { BRAND, sceneWords } from "./scene-words";

const LAST = dayRoad.stops.length - 1;

describe("sceneWords", () => {
  it("stands an app's name at the stop where the app works", () => {
    expect(sceneWords(dayRoad.stops[1], false)).toEqual(["Staff Hub"]);
    expect(sceneWords(dayRoad.stops[2], false)).toEqual(["Parent Hub"]);
    expect(sceneWords(dayRoad.stops[3], false)).toEqual(["AI Tutor"]);
    expect(sceneWords(dayRoad.stops[4], false)).toEqual(["IoT"]);
  });

  it("stands the brand at the first stop, which has no app", () => {
    expect(BRAND).toBe("XionTech");
    expect(sceneWords(dayRoad.stops[0], false)).toEqual([BRAND]);
  });

  it("stands every app at the last stop, where they keep the day connected", () => {
    expect(sceneWords(dayRoad.stops[LAST], true)).toEqual(
      APPS.map((app) => app.shortName),
    );
  });

  it("gives every stop the same words in Vietnamese", () => {
    for (const [i, stop] of dayRoadVi.stops.entries()) {
      expect(sceneWords(stop, i === LAST)).toEqual(
        sceneWords(dayRoad.stops[i], i === LAST),
      );
    }
  });
});
