import { describe, expect, it } from "vitest";
import { APPS } from "@/content/apps";
import {
  audienceFlow,
  FEATURE_PLACEHOLDER,
  productDetails,
} from "@/content/products";

describe("audienceFlow", () => {
  it("has the H1 and a lede", () => {
    expect(audienceFlow.intro.title).toBe("Built apart. Better together.");
    expect(audienceFlow.intro.lede).not.toBe("");
  });

  it("lists the chapters in order parent, staff, student, campus", () => {
    expect(audienceFlow.chapters.map((c) => c.id)).toEqual([
      "parent",
      "staff",
      "student",
      "campus",
    ]);
    expect(audienceFlow.chapters.map((c) => c.app.id)).toEqual([
      "parent-hub",
      "staff-hub",
      "ai-tutor",
      "iot",
    ]);
  });

  it("gives each chapter its own campus place", () => {
    const places = audienceFlow.chapters.map((c) => c.place);
    expect(places).toEqual(["gate", "staff-room", "classroom", "rooftop"]);
    expect(new Set(places).size).toBe(places.length);
  });

  it.each(audienceFlow.chapters)(
    "takes $id copy from apps.ts and productDetails",
    (chapter) => {
      const detail = productDetails[chapter.app.id];
      expect(chapter.app).toBe(APPS.find((a) => a.id === chapter.app.id));
      expect(chapter.tagline).toBe(chapter.app.tagline);
      expect(chapter.madeFor).toBe(detail.madeFor);
      expect(chapter.audience).not.toBe("");
    },
  );

  it.each(audienceFlow.chapters)(
    "makes every $id step a productDetails feature",
    (chapter) => {
      const features = productDetails[chapter.app.id].features;
      expect(chapter.steps.map((s) => s.title)).toEqual(
        features.map((f) => f.title),
      );
      for (const step of chapter.steps) {
        expect(step.description).toBe(FEATURE_PLACEHOLDER);
      }
    },
  );
});
