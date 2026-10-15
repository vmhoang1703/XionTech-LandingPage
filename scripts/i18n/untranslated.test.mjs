import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import {
  REVIEW_LOCALES,
  collectLocaleStrings,
  untranslated,
} from "./review.mjs";

// No translated string may be left equal to its English unless it is on purpose:
// a name, a tagline, a tag, contact data, an id, a link or a number.
const ROOT = join(import.meta.dirname, "../..");
const load = (file) =>
  import(/* @vite-ignore */ pathToFileURL(join(ROOT, file)).href);

describe("the untranslated guard", () => {
  it("flags a Vietnamese string left equal to its English", () => {
    const rows = [
      { location: "vi:homeHero.title", english: "Hello there" },
      { location: "vi:homeHero.tag", english: "Get IT done" },
    ];
    expect(untranslated(rows, "vi")).toEqual([
      "vi:homeHero.title: Hello there",
    ]);
  });

  it("flags a single lowercase English word, but not data keys or links", () => {
    const rows = [
      { location: "vi:a.label", english: "campus" },
      { location: "vi:a.links[0].href", english: "/products" },
      { location: "vi:a.stops[1].app", english: "staff-hub" },
      { location: "vi:a.cta", english: "#contact" },
    ];
    expect(untranslated(rows, "vi")).toEqual(["vi:a.label: campus"]);
  });

  it("fails clearly for a locale it has no allow-list for", () => {
    expect(() => untranslated([], "de")).toThrow("de: not a review locale");
  });

  it("allows the words a locale writes like the English", () => {
    const rows = [{ location: "x:a", english: "Logistics" }];
    expect(untranslated(rows, "vi")).toEqual([]);
  });
});

describe.each(REVIEW_LOCALES)("%s dictionaries", (locale) => {
  it("leave no string in English unless it is on the allow-list", async () => {
    const same = await collectLocaleStrings(load, locale, { same: true });
    expect(untranslated(same, locale)).toEqual([]);
  }, 60_000);
});
