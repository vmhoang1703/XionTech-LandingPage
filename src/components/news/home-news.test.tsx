import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LatestPost } from "@/lib/news/latest-posts";
import { getLatestPosts } from "@/lib/news/latest-posts";
import { HomeNews } from "./home-news";

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: vi.fn() }));
vi.mock("@/lib/news/latest-posts", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/news/latest-posts")>()),
  getLatestPosts: vi.fn(),
}));

const makePost = (n: number): LatestPost => ({
  slug: `story-${n}`,
  title: `Story ${n}`,
  excerpt: `Summary ${n}`,
  publishedAt: "2026-09-18T03:00:00.000Z",
  category: "team",
  app: null,
});

async function renderNews(posts: LatestPost[]) {
  vi.mocked(getLatestPosts).mockResolvedValue(posts);
  return render(await HomeNews());
}

describe("HomeNews", () => {
  beforeEach(() => {
    vi.mocked(getLatestPosts).mockReset();
  });

  it("shows three cards, the sample note and the links", async () => {
    const { container } = await renderNews([1, 2, 3].map(makePost));

    const section = container.querySelector("section");
    expect(section?.className).toBe("sec surface-mist");
    expect(section?.getAttribute("aria-labelledby")).toBe("news-h");
    expect(
      screen.getByRole("heading", { level: 2, name: "Latest from XionTech." }),
    ).toBeTruthy();
    expect(screen.getByText(/^\[Placeholder\]/)).toBeTruthy();
    expect(container.querySelectorAll("article")).toHaveLength(3);
    expect(
      screen.getByRole("link", { name: "See all news" }).getAttribute("href"),
    ).toBe("/news");
  });

  it("shows only the stories it has, with no empty slots", async () => {
    const { container } = await renderNews([makePost(1)]);

    expect(container.querySelectorAll("article")).toHaveLength(1);
    expect(screen.getByText(/^\[Placeholder\]/)).toBeTruthy();
  });

  it("hides the grid and the note with no stories but keeps the heading and link", async () => {
    const { container } = await renderNews([]);

    expect(container.querySelector(".news-grid")).toBeNull();
    expect(container.querySelector("article")).toBeNull();
    expect(screen.queryByText(/^\[Placeholder\]/)).toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "Latest from XionTech." }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "See all news" }).getAttribute("href"),
    ).toBe("/news");
  });
});
