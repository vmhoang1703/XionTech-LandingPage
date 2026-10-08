// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { sanityFetchMock, getAllPostsMock } = vi.hoisted(() => ({
  sanityFetchMock: vi.fn(),
  getAllPostsMock: vi.fn(),
}));

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: sanityFetchMock }));
vi.mock("./all-posts", () => ({ getAllPosts: getAllPostsMock }));

import { getPost, productLink } from "./post";

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
    expect(params).toEqual({ slug: "b" });
    expect(tags).toEqual(["post"]);
    expect(query).toContain(
      '*[_type == "post" && defined(slug.current) && defined(title.en) && defined(publishedAt) && slug.current == $slug][0]',
    );
    for (const field of [
      '"slug": slug.current',
      '"title": title.en',
      '"excerpt": excerpt.en',
      "publishedAt",
      "category",
      "app",
      '"body": body.en[_type == "block"]',
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

describe("productLink", () => {
  it("links a new app id to its Products section", () => {
    expect(productLink("staff-hub")).toEqual({
      href: "/products#sxp",
      label: "Staff Hub",
    });
  });

  it("links an old value to the renamed app", () => {
    expect(productLink("PXP")).toEqual({
      href: "/products#pxp",
      label: "Parent Hub",
    });
    expect(productLink("IoT")).toEqual({
      href: "/products#iot",
      label: "IoT",
    });
  });

  it("gives no link for LXP, unknown, null or missing", () => {
    expect(productLink("LXP")).toBeNull();
    expect(productLink("CRM")).toBeNull();
    expect(productLink(null)).toBeNull();
    expect(productLink(undefined)).toBeNull();
  });
});
