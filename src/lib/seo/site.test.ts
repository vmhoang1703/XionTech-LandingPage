import { describe, expect, it } from "vitest";
import {
  DEFAULT_SITE_URL,
  siteUrl,
  languageAlternates,
  localePath,
  seoMetadata,
  SITE_URL,
  summaryDescription,
} from "./site";

describe("SEO helpers", () => {
  it("reads the origin from NEXT_PUBLIC_SITE_URL, else the challenge host", () => {
    expect(SITE_URL).toBe(DEFAULT_SITE_URL);
    expect(siteUrl("https://example.org/")).toBe("https://example.org");
    expect(siteUrl("")).toBe("https://xiontech-hoangvu-dev.vercel.app");
  });

  it("builds locale paths, Home without a trailing slash", () => {
    expect(localePath("vi", "/")).toBe("/vi");
    expect(localePath("en", "/services")).toBe("/en/services");
  });

  it("lists every locale and x-default on English", () => {
    expect(languageAlternates("/about")).toEqual({
      en: "/en/about",
      vi: "/vi/about",
      "x-default": "/en/about",
    });
  });

  it("mirrors the title and description in Open Graph and Twitter", () => {
    const meta = { title: "T", description: "D" };
    const out = seoMetadata("en", "/news", meta);
    expect(out.openGraph).toMatchObject({ ...meta, url: "/en/news" });
    expect(out.twitter).toMatchObject({
      card: "summary_large_image",
      ...meta,
    });
  });

  it("keeps a short summary and cuts a long one at a word", () => {
    expect(summaryDescription("  Short   text. ")).toBe("Short text.");
    const long = "word ".repeat(60);
    const cut = summaryDescription(long);
    expect(cut.length).toBeLessThanOrEqual(155);
    expect(cut).toMatch(/word…$/);
  });
});
