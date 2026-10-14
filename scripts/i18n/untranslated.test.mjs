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
  it("flags a Japanese string left equal to its English", () => {
    const rows = [
      { location: "ja:homeHero.title", english: "Hello there" },
      { location: "ja:homeHero.tag", english: "Get IT done" },
    ];
    expect(untranslated(rows, "ja")).toEqual([
      "ja:homeHero.title: Hello there",
    ]);
  });

  it("allows French words that French spells the same, only in French", () => {
    const rows = [{ location: "x:a", english: "Parents" }];
    expect(untranslated(rows, "fr")).toEqual([]);
    expect(untranslated(rows, "ja")).toEqual(["x:a: Parents"]);
  });
});

describe.each(REVIEW_LOCALES)("%s dictionaries", (locale) => {
  it("leave no string in English unless it is on the allow-list", async () => {
    const same = await collectLocaleStrings(load, locale, { same: true });
    expect(untranslated(same, locale)).toEqual([]);
  }, 60_000);
});
