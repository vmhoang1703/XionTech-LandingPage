import { describe, expect, it } from "vitest";
import { forLocale, localeMetadata } from "./page-metadata";

const meta = {
  en: { title: "News", description: "All" },
  vi: { title: "Tin tức", description: "Tất cả" },
};

describe("page metadata per locale", () => {
  it("uses the English meta on en", () => {
    expect(forLocale("en", meta)).toEqual({
      title: "News",
      description: "All",
    });
  });

  it("uses the Vietnamese meta on vi, with no placeholder prefix added", () => {
    expect(forLocale("vi", meta)).toEqual({
      title: "Tin tức",
      description: "Tất cả",
    });
  });

  it("keeps a placeholder that is already in the Vietnamese source", () => {
    expect(
      forLocale("vi", {
        en: { title: "[Placeholder] Home" },
        vi: { title: "[Placeholder] Trang chủ" },
      }),
    ).toEqual({ title: "[Placeholder] Trang chủ" });
  });

  it("falls back to the English meta for a locale it does not know", () => {
    expect(forLocale("fr", meta)).toEqual(meta.en);
  });

  it("builds a generateMetadata that reads the locale from params", async () => {
    const generate = localeMetadata(meta);
    expect(
      await generate({ params: Promise.resolve({ locale: "vi" }) }),
    ).toEqual(meta.vi);
    expect(
      await generate({ params: Promise.resolve({ locale: "en" }) }),
    ).toEqual(meta.en);
  });
});
