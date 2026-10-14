import { describe, expect, it } from "vitest";
import {
  contentMismatches,
  fallbackLang,
  pickLocale,
  type Localized,
} from "./content";

const en = {
  title: "Hello",
  cta: { label: "Go", href: "/go" },
  items: [{ name: "One" }, { name: "Two" }],
  count: 2,
};

describe("contentMismatches", () => {
  it("is empty when vi has the shape of en", () => {
    const vi: Localized<typeof en> = {
      title: "Xin chào",
      cta: { label: "Đi", href: "/go" },
      items: [{ name: "Một" }, { name: "Hai" }],
      count: 2,
    };

    expect(contentMismatches(en, vi)).toEqual([]);
  });

  it("reports a key of en that vi lacks", () => {
    const vi = { ...en, title: "Xin chào", cta: { href: "/go" } };

    expect(contentMismatches(en, vi)).toEqual(["cta.label: missing in vi"]);
  });

  it("reports a key vi has and en lacks", () => {
    const vi = { ...en, extra: "Thêm" };

    expect(contentMismatches(en, vi)).toEqual(["extra: not in en"]);
  });

  it("reports a missing top-level key", () => {
    const { title, ...vi } = en;

    expect(title).toBe("Hello");
    expect(contentMismatches(en, vi)).toEqual(["title: missing in vi"]);
  });

  it("reports an array of a different length and still checks the shared items", () => {
    const vi = { ...en, items: [{ nom: "Một" }] };

    expect(contentMismatches(en, vi)).toEqual([
      "items: length 2 in en, 1 in vi",
      "items[0].name: missing in vi",
      "items[0].nom: not in en",
    ]);
  });

  it("reports a value of another kind", () => {
    expect(contentMismatches(en, { ...en, cta: "Đi" })).toEqual([
      "cta: expected object",
    ]);
    expect(contentMismatches(en, { ...en, items: {} })).toEqual([
      "items: expected array",
    ]);
    expect(contentMismatches(en, { ...en, count: "2" })).toEqual([
      "count: expected number",
    ]);
  });

  it("names the root when the top-level kinds differ", () => {
    expect(contentMismatches(en, null)).toEqual(["(root): expected object"]);
    expect(contentMismatches([], {})).toEqual(["(root): expected array"]);
  });
});

describe("pickLocale", () => {
  it("returns the value of the requested locale", () => {
    const dict = { en: "Hello", vi: "Xin chào" };

    expect(pickLocale("en", dict)).toBe("Hello");
    expect(pickLocale("vi", dict)).toBe("Xin chào");
  });

  it("falls back to English for a locale with no translation", () => {
    expect(pickLocale("ja", { en: "Hello", vi: "Xin chào" })).toBe("Hello");
  });
});

describe("fallbackLang", () => {
  it("returns the field's language only when it differs from the page locale", () => {
    expect(fallbackLang("en", "vi")).toBe("en");
    expect(fallbackLang("en", "en")).toBeUndefined();
    expect(fallbackLang("vi", "vi")).toBeUndefined();
    expect(fallbackLang(null, "vi")).toBeUndefined();
  });
});
