import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { newsMeta } from "@/content/news";
import { getPost, type NewsStory } from "@/lib/news/post";
import { undefinedClasses } from "@/test-utils/css-classes";

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: vi.fn() }));
vi.mock("@/lib/news/post", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/news/post")>()),
  getPost: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

import { notFound } from "next/navigation";
import StoryPage, { generateMetadata } from "./page";

// jsdom has no canvas: HeroArt skips the ribbon.
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

const story: NewsStory = {
  slug: "pxp-day",
  title: "Parent Hub: the school day",
  excerpt: "Alerts and payments in one app.",
  publishedAt: "2026-10-04T03:00:00.000Z",
  category: "product",
  app: "parent-hub",
  body: [
    { style: "normal", text: "First paragraph." },
    { style: "h2", text: "A subheading" },
    { style: "normal", text: "Second paragraph." },
    { style: "normal", text: "" },
  ],
};

const props = (slug: string) => ({
  params: Promise.resolve({ slug }),
  searchParams: Promise.resolve({}),
});

async function renderPage(found: NewsStory | null = story) {
  vi.mocked(getPost).mockResolvedValue(found);
  return render(await StoryPage(props(found?.slug ?? "x")));
}

describe("StoryPage", () => {
  it("renders crumbs, H1, mono date and tag, the frame, the body, See Parent Hub and Back to News, with no capture band", async () => {
    const { container } = await renderPage();

    const crumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    const links = [...crumbs.querySelectorAll("a")].map((a) => [
      a.textContent,
      a.getAttribute("href"),
    ]);
    expect(links).toEqual([
      ["Home", "/"],
      ["News", "/news"],
    ]);
    expect(crumbs.querySelector('[aria-current="page"]')?.textContent).toBe(
      story.title,
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      story.title,
    );
    const time = container.querySelector("time");
    expect(time?.getAttribute("datetime")).toBe(story.publishedAt);
    expect(time?.textContent).toBe("4 Oct 2026");
    expect(screen.getByText("Parents").className).toBe("cat");
    expect(
      container.querySelector(".story-media")?.getAttribute("aria-hidden"),
    ).toBe("true");

    const paragraphs = [...container.querySelectorAll(".story-body > p")].map(
      (p) => p.textContent,
    );
    expect(paragraphs).toEqual(["First paragraph.", "Second paragraph."]);
    expect(
      screen.getByRole("heading", { level: 2, name: "A subheading" }),
    ).toBeTruthy();

    expect(screen.queryByRole("link", { name: /^See / })).toBeNull();
    expect(
      screen.getByRole("link", { name: "Back to News" }).getAttribute("href"),
    ).toBe("/news");
    expect(container.querySelector("#cap-h")).toBeNull();
    expect(vi.mocked(getPost)).toHaveBeenCalledWith("pxp-day");
  });

  it("shows only Back to News for a story with no product", async () => {
    await renderPage({ ...story, category: "company", app: null });

    expect(screen.queryByRole("link", { name: /^See / })).toBeNull();
    expect(screen.getByText("Company").className).toBe("cat");
    expect(screen.getByRole("link", { name: "Back to News" })).toBeTruthy();
  });

  it("shows no product link when the category is not Product, even with an app left over", async () => {
    await renderPage({ ...story, category: "company", app: "parent-hub" });

    expect(screen.queryByRole("link", { name: /^See / })).toBeNull();
    expect(screen.getByText("Company").className).toBe("cat");
  });

  it("shows the excerpt when the story has no body text", async () => {
    const { container } = await renderPage({
      ...story,
      category: null,
      app: null,
      body: [
        { style: "normal", text: "" },
        { style: "normal", text: "  " },
      ],
    });

    expect(container.querySelector(".cat")).toBeNull();
    const paragraphs = [...container.querySelectorAll(".story-body > p")].map(
      (p) => p.textContent,
    );
    expect(paragraphs).toEqual([story.excerpt]);
  });

  it.each([null, "  "])(
    "renders no body paragraph when there is no body and the excerpt is %j",
    async (excerpt) => {
      const { container } = await renderPage({ ...story, excerpt, body: null });
      expect(container.querySelectorAll(".story-body > p")).toHaveLength(0);
    },
  );

  it("calls notFound for an unknown slug", async () => {
    await expect(renderPage(null)).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("defines every class it uses in globals.css", async () => {
    const { container } = await renderPage();
    expect(
      undefinedClasses(
        container,
        /^(sr-only|pb-12|pt-10|mt-4\.5|mt-9|flex|flex-wrap|gap-3)$/,
      ),
    ).toEqual([]);
  });
});

describe("generateMetadata", () => {
  it("gives each story its own title and the excerpt as description", async () => {
    vi.mocked(getPost).mockResolvedValue(story);
    await expect(generateMetadata(props("pxp-day"))).resolves.toEqual({
      title: "Parent Hub: the school day | XionTech",
      description: "Alerts and payments in one app.",
    });
  });

  it("falls back to the News description without an excerpt", async () => {
    vi.mocked(getPost).mockResolvedValue({ ...story, excerpt: null });
    const metadata = await generateMetadata(props("pxp-day"));
    expect(metadata.description).toBe(newsMeta.description);
  });

  it("returns no metadata for an unknown slug (the Not found page sets its own)", async () => {
    vi.mocked(getPost).mockResolvedValue(null);
    await expect(generateMetadata(props("x"))).resolves.toEqual({});
  });
});
