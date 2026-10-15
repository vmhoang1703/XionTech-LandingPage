import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAllPosts } from "@/lib/news/all-posts";
import type { LatestPost } from "@/lib/news/latest-posts";
import { undefinedClasses } from "@/test-utils/css-classes";
import NewsPage, { generateMetadata } from "./page";

const metadata = await generateMetadata({
  params: Promise.resolve({ locale: "en" }),
});

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: vi.fn() }));
vi.mock("@/lib/news/all-posts", () => ({ getAllPosts: vi.fn() }));

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
  return render(await NewsPage({ params: Promise.resolve({ locale: "en" }) }));
}

describe("NewsPage", () => {
  beforeEach(() => {
    // jsdom has no IntersectionObserver: the cards never unfold here.
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
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
    expect(metadata.title).toBe(
      "Technology news and stories | AI and school technology | XionTech",
    );
    expect(String(metadata.description)).toContain("client visits");
  });

  it("renders the hero with no breadcrumb, the filters with no sample note, every story as a card and the Let's talk band", async () => {
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
    // Each word rises on its own (lead, 2026-10-13).
    expect(
      Array.from(h1.querySelectorAll("[data-hw]"), (w) => w.textContent),
    ).toEqual(["Catch", "up", "with", "us"]);
    expect(h1.nextElementSibling?.tagName).toBe("P");
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
    expect(container.textContent).not.toContain("[Placeholder]");
    const cards = container.querySelectorAll("#newsGrid a.scard");
    expect(cards).toHaveLength(4);
    expect(cards[0].getAttribute("href")).toBe("/en/news/story-1");
    // Rendered for 3 columns: the first is the lead, a full row follows.
    expect(cards[0].parentElement?.className).toBe("s-lead");
    expect(cards[1].parentElement?.className).toBe("");
    const talk = flow?.lastElementChild;
    expect(talk?.querySelector("h2")?.textContent).toBe(
      "Have something you want to build?",
    );
    expect(talk?.textContent).toContain(
      "Tell us about your idea and we'll get back to you.",
    );
    expect(talk?.querySelector("a")?.getAttribute("href")).toBe("/en#contact");
    expect(talk?.querySelector("input, form")).toBeNull();
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
      const { container } = render(
        await NewsPage({ params: Promise.resolve({ locale: "en" }) }),
      );

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

describe("NewsPage in Vietnamese", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    vi.mocked(getAllPosts).mockReset();
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches in Vietnamese and shows the Vietnamese hero", async () => {
    vi.mocked(getAllPosts).mockResolvedValue([post(1, "parents")]);
    render(await NewsPage({ params: Promise.resolve({ locale: "vi" }) }));

    expect(getAllPosts).toHaveBeenCalledWith("vi");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Cập nhật cùng chúng tôi",
    );
    expect(screen.getByText("04/10/2026")).toBeTruthy();
  });
});

it("falls back to English for an unknown locale", async () => {
  vi.mocked(getAllPosts).mockResolvedValue([]);
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  try {
    await NewsPage({ params: Promise.resolve({ locale: "xx" }) });
    expect(getAllPosts).toHaveBeenCalledWith("en");
  } finally {
    vi.unstubAllGlobals();
  }
});

describe("NewsPage metadata in Vietnamese", () => {
  it("uses the Vietnamese title and description", async () => {
    const viMeta = await generateMetadata({
      params: Promise.resolve({ locale: "vi" }),
    });
    expect(String(viMeta.title)).toBe(
      "Tin tức và câu chuyện công nghệ | AI và công nghệ trường học | XionTech",
    );
    expect(String(viMeta.title)).not.toContain("[Placeholder]");
  });
});
