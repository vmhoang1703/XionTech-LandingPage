import { describe, expect, it } from "vitest";
import { appById } from "@/content/apps";
import { journeyMap } from "@/content/products";

describe("journeyMap", () => {
  it("has the H1 and a lede", () => {
    expect(journeyMap.intro.title).toBe("Built apart. Better together.");
    expect(journeyMap.intro.lede).toBe(
      "A connected suite for school communities — bringing parents, learning, staff operations and campus technology into one shared ecosystem.",
    );
  });

  it("labels the hub XionTech", () => {
    expect(journeyMap.hub).toBe("XionTech");
  });

  it("lists the places in order parent hub, staff hub, AI tutor, IoT", () => {
    expect(journeyMap.places.map((p) => p.id)).toEqual([
      "parent-hub",
      "staff-hub",
      "ai-tutor",
      "iot",
    ]);
  });

  it.each(journeyMap.places)(
    "takes $id name, tagline, badge and anchor from apps.ts",
    (place) => {
      const app = appById(place.id);
      expect(place.name).toBe(app.shortName);
      expect(place.tagline).toBe(app.tagline);
      expect(place.badge).toBe(app.badge);
      expect(place.anchor).toBe(app.anchor);
    },
  );

  it("builds the open label as Open {app} details", () => {
    expect(journeyMap.openLabel("Staff Hub")).toBe("Open Staff Hub details");
    expect(journeyMap.places.map((p) => journeyMap.openLabel(p.name))).toEqual([
      "Open Parent Hub details",
      "Open Staff Hub details",
      "Open AI Tutor details",
      "Open IoT details",
    ]);
  });

  it("has a real mobile list heading and the motion labels", () => {
    expect(journeyMap.listHeading).toBe("Our apps");
    expect(journeyMap.motion).toEqual({
      pause: "Pause motion",
      play: "Play motion",
    });
  });
});
