import { describe, expect, it } from "vitest";
import { forLocale, localeMetadata } from "./page-metadata";

describe("page metadata per locale", () => {
  it("keeps en as written", () => {
    expect(forLocale("en", { title: "News", description: "All" })).toEqual({
      title: "News",
      description: "All",
    });
  });

  it("marks the English title and description as placeholder on vi", () => {
    expect(forLocale("vi", { title: "News", description: "All" })).toEqual({
      title: "[Placeholder] News",
      description: "[Placeholder] All",
    });
  });

  it("does not mark a placeholder twice, and adds no description that was not given", () => {
    expect(forLocale("vi", { title: "[Placeholder] Home" })).toEqual({
      title: "[Placeholder] Home",
    });
  });

  it("builds a generateMetadata that reads the locale from params", async () => {
    const generate = localeMetadata({ title: "About" });
    expect(
      await generate({ params: Promise.resolve({ locale: "vi" }) }),
    ).toEqual({ title: "[Placeholder] About" });
  });
});
