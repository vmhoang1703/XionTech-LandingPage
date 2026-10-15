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
    expect(forLocale("de", meta)).toEqual(meta.en);
  });

  it("builds a generateMetadata that reads the locale from params", async () => {
    const generate = localeMetadata(meta, "/news");
    expect(
      await generate({ params: Promise.resolve({ locale: "vi" }) }),
    ).toMatchObject(meta.vi);
    expect(
      await generate({ params: Promise.resolve({ locale: "en" }) }),
    ).toMatchObject(meta.en);
  });

  it("adds the canonical, hreflang alternates, Open Graph and Twitter card", async () => {
    const generate = localeMetadata(meta, "/news");
    const vi = await generate({ params: Promise.resolve({ locale: "vi" }) });
    expect(vi.alternates).toEqual({
      canonical: "/vi/news",
      languages: {
        en: "/en/news",
        vi: "/vi/news",
        "x-default": "/en/news",
      },
    });
    expect(vi.openGraph).toMatchObject({
      ...meta.vi,
      url: "/vi/news",
      locale: "vi_VN",
      siteName: "XionTech",
    });
    expect(vi.twitter).toMatchObject({
      card: "summary_large_image",
      ...meta.vi,
    });
  });

  it("uses the bare locale path for Home", async () => {
    const home = await localeMetadata(
      meta,
      "/",
    )({
      params: Promise.resolve({ locale: "en" }),
    });
    expect(home.alternates?.canonical).toBe("/en");
  });
});
