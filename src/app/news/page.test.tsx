import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAllPosts } from "@/lib/news/all-posts";
import type { LatestPost } from "@/lib/news/latest-posts";
import { undefinedClasses } from "@/test-utils/css-classes";
import NewsPage, { metadata } from "./page";

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: vi.fn() }));
vi.mock("@/lib/news/all-posts", () => ({ getAllPosts: vi.fn() }));
vi.mock("@/components/contact/capture-band", () => ({
  CaptureBand: ({ kind }: { kind: string }) => (
    <section data-testid={`capture-${kind}`} />
  ),
}));
vi.mock("@/components/sections/hero-art", () => ({ HeroArt: () => null }));

const post = (n: number, category: string): LatestPost => ({
  slug: `story-${n}`,
  title: `Story ${n}`,
  excerpt: `Summary ${n}`,
  publishedAt: "2026-10-04T03:00:00.000Z",
  category,
  app: category === "product" ? "PXP" : null,
});

async function renderPage(posts: LatestPost[]) {
  vi.mocked(getAllPosts).mockResolvedValue(posts);
  return render(await NewsPage());
}

describe("NewsPage", () => {
  beforeEach(() => {
    vi.mocked(getAllPosts).mockReset();
  });

  it("has its own title and description", () => {
    expect(metadata.title).toBe("News | XionTech");
    expect(String(metadata.description)).toContain("products");
  });

  it("renders the light hero, the chips, every story with the first as the feature, and the demo capture", async () => {
    const { container } = await renderPage([
      post(1, "product"),
      post(2, "team"),
      post(3, "company"),
    ]);

    const hero = container.querySelector("section.hero-light.page-hero");
    expect(hero?.getAttribute("aria-labelledby")).toBe("news-h1");
    const crumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(crumbs.querySelector('a[href="/"]')?.textContent).toBe("Home");
    expect(crumbs.textContent).toContain("News");
    expect(crumbs.querySelectorAll("a")).toHaveLength(1);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.id).toBe("news-h1");
    expect(h1.textContent).toBe("What we've been up to.");
    expect(h1.querySelector(".hl")?.textContent).toBe("up to");
    expect(
      screen.getByText(
        "Short stories about our products, schools, team and client work.",
      ),
    ).toBeTruthy();

    const h2 = screen.getByRole("heading", { level: 2, name: "All stories" });
    expect(h2.className).toBe("sr-only");
    expect(screen.getByRole("group", { name: "Filter stories" })).toBeTruthy();
    const cards = container.querySelectorAll("article.ncard");
    expect(cards).toHaveLength(3);
    expect(cards[0].classList.contains("big")).toBe(true);
    expect(cards[1].classList.contains("big")).toBe(false);
    expect(cards[0].textContent).toContain("Story 1");
    expect(screen.getByTestId("capture-demo")).toBeTruthy();
    expect(screen.queryByText(/\[Placeholder\]|sample/i)).toBeNull();
  });

  it("passes each story's category to the filter, so a chip shows only its stories", async () => {
    await renderPage([post(1, "product"), post(2, "team"), post(3, "company")]);

    fireEvent.click(screen.getByRole("button", { name: "Team" }));

    expect(
      screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
    ).toEqual(["Story 2"]);
    expect(document.querySelector("[aria-live]")?.textContent).toBe(
      "Showing 1 story",
    );
  });

  it("keeps the page up when the fetch fails: logs it and shows the empty panel", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      vi.mocked(getAllPosts).mockRejectedValue(new Error("Sanity down"));
      const { container } = render(await NewsPage());

      expect(container.querySelector("article")).toBeNull();
      expect(screen.getByText("No stories in this category yet.")).toBeTruthy();
      expect(screen.queryByRole("button", { name: "Show all" })).toBeNull();
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining("News page"),
        expect.any(Error),
      );
    } finally {
      error.mockRestore();
    }
  });

  it("defines every class it uses in globals.css", async () => {
    const { container } = await renderPage([
      post(1, "product"),
      post(2, "team"),
    ]);
    expect(undefinedClasses(container, /^(sr-only|mt-4\.5|pt-14)$/)).toEqual(
      [],
    );
  });
});
