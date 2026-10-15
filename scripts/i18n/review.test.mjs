import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import {
  LOCALE_INFO,
  REVIEW_LOCALES,
  buildLocaleReview,
  collectLocaleStrings,
  localePairs,
  outputOf,
  renderLocaleReview,
} from "./review.mjs";
import { walk } from "./vi-review.mjs";

const ROOT = join(import.meta.dirname, "../..");
const load = (file) =>
  import(/* @vite-ignore */ pathToFileURL(join(ROOT, file)).href);
const SLOW = 60_000;
const prototype = JSON.parse(
  readFileSync(join(ROOT, "src/i18n/prototype-vi.json"), "utf8"),
);

describe.each(REVIEW_LOCALES)("the generated %s review", (locale) => {
  it(
    "is up to date with the dictionaries",
    async () => {
      const fresh = await buildLocaleReview(load, locale, prototype);
      expect(
        readFileSync(outputOf(locale), "utf8").replaceAll("\r\n", "\n"),
      ).toBe(fresh);
    },
    SLOW,
  );
});

describe("localePairs", () => {
  it("fails loudly for a locale without a registered dictionary", async () => {
    await expect(localePairs(load, "de")).rejects.toThrow(
      "de: no dictionary registered",
    );
  });

  it("names the page of each registry key after the module that exports its English", async () => {
    const pairs = await localePairs(load, "ja");
    expect(pairs.find((p) => p.name === "servicesPage").page).toBe("Services");
    expect(pairs.find((p) => p.name === "shell").page).toMatch(/^Site shell/);
    expect(pairs.find((p) => p.name === "meta").page).toBe(
      "Site title and description",
    );
    expect(pairs.filter((p) => p.page === "Other")).toEqual([]);
  });
});

describe("collectLocaleStrings", () => {
  it(
    "returns the differing strings, or with same: true the equal ones",
    async () => {
      const differ = await collectLocaleStrings(load, "fr");
      const same = await collectLocaleStrings(load, "fr", { same: true });
      expect(differ.every((r) => r.english !== r.text)).toBe(true);
      expect(same.every((r) => r.english === r.text)).toBe(true);
      expect(differ[0].location).toMatch(/^fr:/);
    },
    SLOW,
  );
});

describe("renderLocaleReview", () => {
  const row = (location, english, text, page = "Home") => ({
    page,
    location,
    english,
    text,
  });
  const review = renderLocaleReview(
    [
      row("ja:a", "Pipe | and\nline", "パイプ | 行"),
      row("ja:b", "Pipe | and\nline", "パイプ | 行"),
      row("ja:c", "Other", "その他", "About"),
    ],
    "ja",
  );

  it("groups by page, counts the strings and tells the reader what to check", () => {
    expect(review).toMatch(/^# Japanese review\n/);
    expect(review).toContain("**Total:** 2 strings.");
    expect(review.indexOf("## Home")).toBeLessThan(review.indexOf("## About"));
    expect(review).toContain("| Where | English | 日本語 |");
    expect(review).toContain("**Privacy**: only the page strings");
    expect(review).toContain(LOCALE_INFO.ja.kept);
  });

  it("merges one pair used in several places and escapes table characters", () => {
    expect(review).toContain(
      "| `ja:a`<br>`ja:b` | Pipe \\| and<br>line | パイプ \\| 行 |",
    );
  });
});

describe("walk", () => {
  it("names the locale whose dictionary is wrong", () => {
    expect(() => walk({ a: "A" }, {}, "x", [], [], "ja")).toThrow(
      "x.a: missing in ja",
    );
    expect(() => walk({ a: {} }, { a: [] }, "x", [], [], "ko")).toThrow(
      "x.a: ko has no matching object",
    );
  });
});
