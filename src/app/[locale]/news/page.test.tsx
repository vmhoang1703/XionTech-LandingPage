import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

const post = (n: number, category: string): LatestPost => ({
  slug: `story-${n}`,
  title: `Story ${n}`,
  excerpt: `Summary ${n}`,
  publishedAt: "2026-10-04T03:00:00.000Z",
  category,
  app: category === "product" ? "parent-hub" : null,
});

async function renderPage(posts: LatestPost[]) {
  vi.mocked(getAllPosts).mockResolvedValue(posts);
  return render(await NewsPage());
}

describe("NewsPage", () => {
  beforeEach(() => {
    vi.mocked(getAllPosts).mockReset();
    // A 1280px window: the filter reads its column count from matchMedia.
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("has its own title and description", () => {
    expect(metadata.title).toBe("News | XionTech");
    expect(String(metadata.description)).toContain("products");
  });

  it("renders the hero with no breadcrumb, the filters with the sample note, every story as a card and the demo capture", async () => {
    const { container } = await renderPage([
      post(1, "product"),
      post(2, "team"),
      post(3, "company"),
      post(4, "schools"),
    ]);

    const flow = container.querySelector(".page-scene");
    const hero = flow?.querySelector("section.hero-light.page-hero.nhead-sec");
    expect(hero?.getAttribute("aria-labelledby")).toBe("news-h1");
    expect(screen.queryByRole("navigation")).toBeNull();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.id).toBe("news-h1");
    expect(h1.textContent).toBe("Catch up with us");
    expect(
      screen.getByText(
        "Stay informed with the latest news and announcements, fresh off the press.",
      ),
    ).toBeTruthy();

    const h2 = screen.getByRole("heading", { level: 2, name: "All stories" });
    expect(h2.className).toBe("sr-only");
    expect(flow?.contains(h2)).toBe(true);
    expect(
      screen.getByRole("group", { name: "Filter stories by audience" }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Stories from the newXion newsroom; those marked [Placeholder] are samples.",
      ),
    ).toBeTruthy();
    const cards = container.querySelectorAll("#newsGrid a.scard");
    expect(cards).toHaveLength(4);
    expect(cards[0].getAttribute("href")).toBe("/en/news/story-1");
    // Rendered for 3 columns: the first is the lead, a full row follows.
    expect(cards[0].parentElement?.className).toBe("s-lead");
    expect(cards[1].parentElement?.className).toBe("");
    const capture = screen.getByTestId("capture-demo");
    expect(flow?.lastElementChild).toBe(capture);
    expect(container.firstElementChild).toBe(flow);
  });

  it("passes each story's audience to the filter, so a chip shows only its stories", async () => {
    await renderPage([post(1, "product"), post(2, "team"), post(3, "company")]);

    fireEvent.click(screen.getByRole("button", { name: "Parents" }));

    expect(
      Array.from(
        document.querySelectorAll(".scard-title"),
        (t) => t.textContent,
      ),
    ).toEqual(["Story 1"]);
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
      expect(
        screen.getByText("No stories are available in this category yet."),
      ).toBeTruthy();
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
    expect(undefinedClasses(container, /^sr-only$/)).toEqual([]);
  });
});
