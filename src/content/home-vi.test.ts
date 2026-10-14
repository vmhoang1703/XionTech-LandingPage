import { describe, expect, it } from "vitest";
import { contentMismatches } from "@/i18n/content";
import { appTaglinesVi, APPS } from "./apps";
import * as home from "./home";
import { processFlow, processFlowVi } from "./process";
import {
  aboutValues,
  aboutValuesVi,
  homeValuesHeading,
  homeValuesHeadingVi,
} from "./values";

// Every Vietnamese dictionary has exactly the shape of its English one.
describe("Home, values, process and apps in Vietnamese", () => {
  it.each([
    ["homeMeta", home.homeMeta, home.homeMetaVi],
    ["homeHero", home.homeHero, home.homeHeroVi],
    ["homeStats", home.homeStats, home.homeStatsVi],
    ["homeDoors", home.homeDoors, home.homeDoorsVi],
    ["homeCapabilities", home.homeCapabilities, home.homeCapabilitiesVi],
    ["homeProcess", home.homeProcess, home.homeProcessVi],
    ["homeOutcomes", home.homeOutcomes, home.homeOutcomesVi],
    ["homeApps", home.homeApps, home.homeAppsVi],
    ["homeFaq", home.homeFaq, home.homeFaqVi],
    ["aboutValues", aboutValues, aboutValuesVi],
    ["homeValuesHeading", homeValuesHeading, homeValuesHeadingVi],
    ["processFlow", processFlow, processFlowVi],
  ])("%s has the English shape", (_name, en, vi) => {
    expect(contentMismatches(en, vi)).toEqual([]);
  });

  it("keeps numbers, links and icons shared with English", () => {
    expect(home.homeStatsVi.stats.map((stat) => stat.value)).toEqual(
      home.homeStats.stats.map((stat) => stat.value),
    );
    expect(processFlowVi.steps.map((step) => step.icon)).toEqual(
      processFlow.steps.map((step) => step.icon),
    );
    expect(aboutValuesVi.items.map((item) => item.icon)).toEqual(
      aboutValues.items.map((item) => item.icon),
    );
    expect(home.homeDoorsVi.services.chips).toHaveLength(
      home.homeDoors.services.chips.length,
    );
  });

  it("has a Vietnamese tagline for every app, keeping the placeholder mark", () => {
    expect(Object.keys(appTaglinesVi).sort()).toEqual(
      APPS.map((app) => app.id).sort(),
    );
    expect(appTaglinesVi["ai-tutor"].startsWith("[Placeholder] ")).toBe(true);
  });
});
