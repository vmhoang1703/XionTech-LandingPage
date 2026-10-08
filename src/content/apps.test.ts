import { describe, expect, it } from "vitest";

import { APPS, appById, badgeLabel, type AppId } from "./apps";

describe("APPS", () => {
  it("lists the four apps in order", () => {
    expect(APPS.map((a) => a.id)).toEqual([
      "parent-hub",
      "staff-hub",
      "iot",
      "ai-tutor",
    ]);
  });

  it("has the short and full names", () => {
    expect(APPS.map((a) => [a.shortName, a.fullName])).toEqual([
      ["Parent Hub", "Parent Hub"],
      ["Staff Hub", "Staff Hub"],
      ["IoT", "IoT Device Management"],
      ["AI Tutor", "AI Tutor"],
    ]);
  });

  it("has the badges", () => {
    expect(APPS.map((a) => a.badge)).toEqual([
      { kind: "text", text: "P-Hub" },
      { kind: "text", text: "S-Hub" },
      { kind: "icon", icon: "Cpu" },
      { kind: "icon", icon: "Sparkle" },
    ]);
  });

  it("has the anchors", () => {
    expect(APPS.map((a) => a.anchor)).toEqual([
      "pxp",
      "sxp",
      "iot",
      "ai-tutor",
    ]);
  });

  it("has the taglines, and marks the AI Tutor one as a placeholder", () => {
    expect(appById("parent-hub").tagline).toBe(
      "Keeps parents close to every school day, on their phone.",
    );
    expect(appById("staff-hub").tagline).toBe(
      "One workspace where staff, teachers and leaders share the same data.",
    );
    expect(appById("iot").tagline).toBe(
      "Run classroom devices, lighting, climate and access from one screen.",
    );
    expect(appById("ai-tutor").tagline.startsWith("[Placeholder]")).toBe(true);
  });
});

describe("appById", () => {
  it("returns the record for an id", () => {
    expect(appById("staff-hub").shortName).toBe("Staff Hub");
  });

  it("throws for an unknown id", () => {
    expect(() => appById("lxp" as AppId)).toThrow("Unknown app id: lxp");
  });
});

describe("badgeLabel", () => {
  it("returns the text of a text badge", () => {
    expect(badgeLabel(appById("parent-hub"))).toBe("P-Hub");
  });

  it("returns the short name for an icon badge", () => {
    expect(badgeLabel(appById("iot"))).toBe("IoT");
  });
});
