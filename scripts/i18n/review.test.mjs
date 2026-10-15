import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import {
  REVIEW_LOCALES,
  buildLocaleReview,
  localePairs,
  outputOf,
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
});

describe("walk", () => {
  it("names the locale whose dictionary is wrong", () => {
    expect(() => walk({ a: "A" }, {}, "x", [], [], "vi")).toThrow(
      "x.a: missing in vi",
    );
    expect(() => walk({ a: {} }, { a: [] }, "x", [], [], "vi")).toThrow(
      "x.a: vi has no matching object",
    );
  });
});
