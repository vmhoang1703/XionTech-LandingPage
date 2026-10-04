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
      '"title": title.en',
      '"excerpt": excerpt.en',
    ]) {
      expect(projection).toContain(line);
    }
    for (const field of ["publishedAt", "category", "app"]) {
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
  it("formats as day, upper-case month and year", () => {
    expect(newsDate("2026-09-18T03:00:00Z")).toBe("18 SEP 2026");
  });

  it("uses Ho Chi Minh time, not UTC", () => {
    expect(newsDate("2026-09-17T20:00:00Z")).toBe("18 SEP 2026");
  });
});

describe("categoryTag", () => {
  it("labels product with its app", () => {
    expect(categoryTag(post({ category: "product", app: "PXP" }))).toBe(
      "Product · PXP",
    );
  });

  it("labels product without an app", () => {
    expect(categoryTag(post({ category: "product" }))).toBe("Product");
  });

  it.each([
    ["team", "Team"],
    ["schools", "Schools"],
    ["company", "Company"],
  ])("labels %s as %s and ignores the app", (category, label) => {
    expect(categoryTag(post({ category, app: "LXP" }))).toBe(label);
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
