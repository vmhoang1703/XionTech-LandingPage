import { describe, expect, it } from "vitest";
import { isLocale, LOCALES, localeHref } from "./locales";

describe("locales", () => {
  it("lists en and vi", () => {
    expect(LOCALES).toEqual(["en", "vi"]);
  });

  it("isLocale accepts only supported locales", () => {
    expect(isLocale("vi")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("localeHref prefixes paths, keeping hash and query", () => {
    expect(localeHref("vi", "/")).toBe("/vi");
    expect(localeHref("en", "/products")).toBe("/en/products");
    expect(localeHref("vi", "/services#cloud")).toBe("/vi/services#cloud");
    expect(localeHref("vi", "/?a=1")).toBe("/vi?a=1");
  });
});
