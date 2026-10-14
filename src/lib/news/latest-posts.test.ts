// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { sanityFetchMock } = vi.hoisted(() => ({ sanityFetchMock: vi.fn() }));

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: sanityFetchMock }));

import {
  categoryTag,
  getLatestPosts,
  newsDate,
  type LatestPost,
} from "./latest-posts";

const post = (over: Partial<LatestPost> = {}): LatestPost => ({
  slug: "hello",
  title: "Hello",
  publishedAt: "2026-09-18T03:00:00Z",
  ...over,
});

describe("getLatestPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches with the post tag and the slug, title and date filter", async () => {
    sanityFetchMock.mockResolvedValue([]);

    await getLatestPosts();

    expect(sanityFetchMock).toHaveBeenCalledTimes(1);
    const { query, tags } = sanityFetchMock.mock.calls[0][0];
    expect(tags).toEqual(["post"]);
    expect(query).toContain(
      '*[_type == "post" && defined(slug.current) && defined(title.en) && defined(publishedAt)]',
    );
  });

  it("orders newest first and keeps three", async () => {
    sanityFetchMock.mockResolvedValue([]);

    await getLatestPosts();

    const { query } = sanityFetchMock.mock.calls[0][0];
    expect(query).toContain("order(publishedAt desc)[0...3]");
  });

  it("projects flat strings: slug, title, excerpt, publishedAt, category, app", async () => {
    sanityFetchMock.mockResolvedValue([]);

    await getLatestPosts();

    const { query } = sanityFetchMock.mock.calls[0][0];
    const projection = query.slice(
      query.indexOf("{", query.indexOf("[0...3]")),
    );
    for (const line of [
      '"slug": slug.current',
      '"title": select(length(title[$locale]) > 0 => title[$locale], title.en)',
      '"excerpt": select(length(excerpt[$locale]) > 0 => excerpt[$locale], excerpt.en)',
    ]) {
      expect(projection).toContain(line);
    }
    expect(projection).toContain('"image": image.asset->url');
    for (const field of ["publishedAt", "category", "app", "alt"]) {
      expect(projection).toMatch(
        new RegExp(String.raw`[,{]\s*${field}\s*[,}]`),
      );
    }
  });

  it("returns the posts from the fetch", async () => {
    const posts = [post()];
    sanityFetchMock.mockResolvedValue(posts);

    await expect(getLatestPosts()).resolves.toEqual(posts);
  });

  it("lets a failed fetch reach the caller", async () => {
    const error = new Error("Sanity fetch failed for tags [post]");
    sanityFetchMock.mockRejectedValue(error);

    await expect(getLatestPosts()).rejects.toBe(error);
  });
});

describe("newsDate", () => {
  it("returns an empty date for a value that is not a date, so one bad post cannot break Home", () => {
    expect(newsDate("not a date")).toBe("");
  });

  it("formats as day, month and year, not in capitals", () => {
    expect(newsDate("2026-07-31T03:00:00Z")).toBe("31 Jul 2026");
  });

  it("uses Ho Chi Minh time, not UTC", () => {
    expect(newsDate("2026-09-17T20:00:00Z")).toBe("18 Sep 2026");
  });

  it("formats Vietnamese as day/month/year with leading zeros", () => {
    expect(newsDate("2026-09-17T20:00:00Z", "vi")).toBe("18/09/2026");
  });

  it.each([
    ["ja", "2026年9月18日"],
    ["fr", "18 septembre 2026"],
    ["ko", "2026년 9월 18일"],
    ["zh", "2026年9月18日"],
  ] as const)("formats %s with that locale's Intl date", (locale, date) => {
    expect(newsDate("2026-09-17T20:00:00Z", locale)).toBe(date);
  });
});

describe("categoryTag", () => {
  it.each([
    [{ category: "product", app: "PXP" }, "Parents"],
    [{ category: "product", app: "ai-tutor" }, "Students"],
    [{ category: "product", app: "staff-hub" }, "Schools"],
    [{ category: "product" }, "Schools"],
    [{ category: "team", app: "LXP" }, "Company"],
    [{ category: "schools" }, "Schools"],
    [{ category: "students" }, "Students"],
    [{ category: "parents" }, "Parents"],
    [{ category: "company" }, "Company"],
  ])("labels %j as %s", (over, label) => {
    expect(categoryTag(post(over))).toBe(label);
  });

  it("returns null for an unknown category", () => {
    expect(categoryTag(post({ category: "sports" }))).toBeNull();
    expect(categoryTag(post({ category: "toString" }))).toBeNull();
  });

  it("returns null for a missing category", () => {
    expect(categoryTag(post())).toBeNull();
    expect(categoryTag(post({ category: null }))).toBeNull();
  });
});

describe("Vietnamese", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches with the locale and falls back to English per post", async () => {
    sanityFetchMock.mockResolvedValue([]);

    await getLatestPosts("vi");

    const { query, params } = sanityFetchMock.mock.calls[0][0];
    expect(params).toEqual({ locale: "vi" });
    expect(query).toContain(
      '"titleLang": select(length(title[$locale]) > 0 => $locale, "en")',
    );
    expect(query).toContain(
      '"excerptLang": select(length(excerpt[$locale]) > 0 => $locale, "en")',
    );
  });

  it("labels the audience in Vietnamese", () => {
    expect(categoryTag(post({ category: "parents" }), "vi")).toBe("Phụ huynh");
  });
});
