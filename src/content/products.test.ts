import { describe, expect, it } from "vitest";
import { APPS, appById } from "@/content/apps";
import {
  journeyBoard,
  journeyMap,
  productDetails,
  productRoad,
} from "@/content/products";

describe("journeyMap", () => {
  it("has the H1 and a lede", () => {
    expect(journeyMap.intro.title).toBe("Built apart. Better together");
    expect(journeyMap.intro.lede).toBe(
      "A connected suite for school communities — bringing parents, learning, staff operations and campus technology into one shared ecosystem.",
    );
  });
});

describe("productRoad", () => {
  it("has three milestones, each one a product, in road order", () => {
    expect(productRoad.stops).toEqual(["parent-hub", "staff-hub", "ai-tutor"]);
  });

  it("names real apps, each once", () => {
    for (const id of productRoad.stops) {
      expect(appById(id).id).toBe(id);
    }
    expect(new Set(productRoad.stops).size).toBe(productRoad.stops.length);
  });

  it("leaves IoT off the road, and keeps its details for the rest of the site", () => {
    expect(productRoad.stops).not.toContain("iot");
    expect(APPS.map((app) => app.id)).toContain("iot");
    expect(productDetails.iot.features.length).toBeGreaterThan(0);
  });

  it("labels the two ends of the road", () => {
    expect(productRoad.start).toBe("Start");
    expect(productRoad.finish).toBe("Finish");
  });
});

describe("journeyBoard", () => {
  it("gives every stop a tag for who the app is for", () => {
    for (const id of productRoad.stops) {
      expect(
        journeyBoard.lanes.filter((lane) => lane.app === id),
        id,
      ).toHaveLength(1);
    }
  });

  it("points every tag at an app on the road", () => {
    expect(journeyBoard.lanes.map((lane) => lane.app).sort()).toEqual(
      [...productRoad.stops].sort(),
    );
    expect(journeyBoard.lanes.map((lane) => lane.label)).toEqual([
      "Student",
      "Teacher and staff",
      "Parent",
    ]);
  });

  it("has the Details cue of a card", () => {
    expect(journeyBoard.details).toBe("Details");
  });
});
