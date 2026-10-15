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

  it("has the approved taglines, with no placeholder", () => {
    expect(APPS.map((app) => app.tagline)).toEqual([
      "Keep parents informed and connected to their child’s school life.",
      "Bring daily school operations into one connected workspace.",
      "Simplify how schools manage connected campus technology.",
      "Help students understand mistakes and build confidence through guided learning.",
    ]);
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
