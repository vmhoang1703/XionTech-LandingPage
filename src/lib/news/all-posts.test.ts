// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { sanityFetchMock } = vi.hoisted(() => ({ sanityFetchMock: vi.fn() }));

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: sanityFetchMock }));

import { getAllPosts } from "./all-posts";

describe("getAllPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches every post with Home's slug, title and date filter, newest first, tagged post", async () => {
    const posts = [{ slug: "a", title: "A", publishedAt: "2026-10-04" }];
    sanityFetchMock.mockResolvedValue(posts);

    await expect(getAllPosts()).resolves.toBe(posts);

    expect(sanityFetchMock).toHaveBeenCalledTimes(1);
    const { query, tags } = sanityFetchMock.mock.calls[0][0];
    expect(tags).toEqual(["post"]);
    expect(query).toContain(
      '*[_type == "post" && defined(slug.current) && defined(title.en) && defined(publishedAt)]',
    );
    expect(query).toContain("| order(publishedAt desc)");
    expect(query).not.toMatch(/\[0\.\.\./);
    for (const field of [
      '"slug": slug.current',
      '"title": title.en',
      '"excerpt": excerpt.en',
      "publishedAt",
      "category",
      "app",
    ]) {
      expect(query).toContain(field);
    }
  });
});
