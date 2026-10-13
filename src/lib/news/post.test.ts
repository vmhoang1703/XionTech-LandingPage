// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { sanityFetchMock, getAllPostsMock } = vi.hoisted(() => ({
  sanityFetchMock: vi.fn(),
  getAllPostsMock: vi.fn(),
}));

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: sanityFetchMock }));
vi.mock("./all-posts", () => ({ getAllPosts: getAllPostsMock }));

import { getPost } from "./post";

const listed = [
  { slug: "a", title: "A", publishedAt: "2026-10-04" },
  { slug: "b", title: "B", publishedAt: "2026-10-03" },
];

describe("getPost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAllPostsMock.mockResolvedValue(listed);
  });

  it("returns null for a slug that is not in the cached post list, with no Sanity request of its own", async () => {
    await expect(getPost("no-such-story")).resolves.toBeNull();
    expect(getAllPostsMock).toHaveBeenCalledTimes(1);
    expect(sanityFetchMock).not.toHaveBeenCalled();
  });

  it("fetches a listed story by slug with Home's filter, tagged post", async () => {
    const story = { slug: "b", title: "B", body: [] };
    sanityFetchMock.mockResolvedValue(story);

    await expect(getPost("b")).resolves.toBe(story);

    const { query, params, tags } = sanityFetchMock.mock.calls[0][0];
    expect(params).toEqual({ slug: "b", locale: "en" });
    expect(tags).toEqual(["post"]);
    expect(query).toContain(
      '*[_type == "post" && defined(slug.current) && defined(title.en) && defined(publishedAt) && slug.current == $slug][0]',
    );
    for (const field of [
      '"slug": slug.current',
      '"title": coalesce(title[$locale], title.en)',
      '"excerpt": coalesce(excerpt[$locale], excerpt.en)',
      "publishedAt",
      "category",
      "app",
      '"image": image.asset->url',
      "alt",
      '"body": coalesce(body[$locale], body.en)[_type == "block"]',
      '"text": pt::text(@)',
      "style",
    ]) {
      expect(query).toContain(field);
    }
  });

  it("returns null when the story is gone between the list and the fetch", async () => {
    sanityFetchMock.mockResolvedValue(null);
    await expect(getPost("a")).resolves.toBeNull();
  });
});

describe("getPost in Vietnamese", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAllPostsMock.mockResolvedValue(listed);
  });

  it("lists and fetches in the locale and marks an English body fallback", async () => {
    sanityFetchMock.mockResolvedValue(null);

    await getPost("b", "vi");

    expect(getAllPostsMock).toHaveBeenCalledWith("vi");
    const { query, params } = sanityFetchMock.mock.calls[0][0];
    expect(params).toEqual({ slug: "b", locale: "vi" });
    expect(query).toContain(
      '"bodyLang": select(defined(body[$locale]) => $locale, "en")',
    );
  });
});
