import { describe, expect, it, vi } from "vitest";
import { homeHero, homeHeroVi } from "@/content/home";
import { otherLocations } from "@/content/offices";
import { pickLocale } from "./content";
import { META } from "./site-meta";
import { SHELL } from "./shell";
import { registeredTranslation } from "./translations";

const { jaHero, jaShell, jaMeta } = vi.hoisted(() => ({
  jaHero: { title: "ja title" },
  jaShell: { label: "ja shell" },
  jaMeta: { title: "XionTech", description: "ja description" },
}));

vi.mock("./dictionaries", () => ({
  DICTIONARIES: {
    ja: {
      homeHero: jaHero,
      otherLocations: "ja other locations",
      shell: jaShell,
      meta: jaMeta,
    },
    fr: {},
  },
}));

describe("translation registry", () => {
  it("finds a locale's translation of an English value", () => {
    expect(registeredTranslation("ja", homeHero)).toBe(jaHero);
    expect(registeredTranslation("ja", otherLocations)).toBe(
      "ja other locations",
    );
  });

  it("has nothing for a value it does not know or a locale not yet filled", () => {
    expect(registeredTranslation("ja", { title: "unknown" })).toBeUndefined();
    expect(registeredTranslation("fr", homeHero)).toBeUndefined();
    expect(registeredTranslation("ko", homeHero)).toBeUndefined();
  });

  it("lets pickLocale use the registry and keeps the vi twin", () => {
    expect(pickLocale("ja", { en: homeHero, vi: homeHeroVi })).toBe(jaHero);
    expect(pickLocale("vi", { en: homeHero, vi: homeHeroVi })).toBe(homeHeroVi);
    expect(pickLocale("fr", { en: homeHero, vi: homeHeroVi })).toBe(homeHero);
  });

  it("builds SHELL and META from a locale's dictionary, else English", () => {
    expect(SHELL.ja).toBe(jaShell);
    expect(SHELL.fr).toBe(SHELL.en);
    expect(META.ja).toBe(jaMeta);
    expect(META.zh).toBe(META.en);
  });
});
