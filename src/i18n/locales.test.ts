import { describe, expect, it } from "vitest";
import { htmlLang, isLocale, LOCALES, localeHref } from "./locales";

describe("locales", () => {
  it("lists the six locales, English first", () => {
    expect(LOCALES).toEqual(["en", "vi", "ja", "fr", "ko", "zh"]);
  });

  it("isLocale accepts only supported locales", () => {
    expect(isLocale("vi")).toBe(true);
    expect(isLocale("zh")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("htmlLang marks Chinese as Simplified", () => {
    expect(htmlLang("zh")).toBe("zh-Hans");
    expect(htmlLang("ja")).toBe("ja");
  });

  it("localeHref prefixes paths, keeping hash and query", () => {
    expect(localeHref("vi", "/")).toBe("/vi");
    expect(localeHref("en", "/products")).toBe("/en/products");
    expect(localeHref("vi", "/services#cloud")).toBe("/vi/services#cloud");
    expect(localeHref("vi", "/?a=1")).toBe("/vi?a=1");
  });
});
