import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

const { default: CatchAll, generateMetadata } = await import("./page");
const { SHELL } = await import("@/i18n/shell");

describe("catch-all page", () => {
  it("answers 404 so an unknown path under a locale gets the locale Not found page", () => {
    expect(() => CatchAll()).toThrow("NEXT_NOT_FOUND");
  });

  it.each(["en", "vi", "ja", "fr", "ko", "zh"] as const)(
    "gives the %s Not found title",
    async (locale) => {
      const meta = await generateMetadata({
        params: Promise.resolve({ locale }),
      });
      expect(meta.title).toBe(SHELL[locale].notFound.metaTitle);
    },
  );

  it("falls back to the English title for an unknown locale", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ locale: "de" }),
    });
    expect(meta.title).toBe(SHELL.en.notFound.metaTitle);
  });
});
