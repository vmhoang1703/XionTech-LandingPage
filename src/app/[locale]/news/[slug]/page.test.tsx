import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { newsMeta, newsMetaVi } from "@/content/news";
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

afterEach(() => {
  vi.clearAllMocks();
});

const PHOTO = "https://cdn.sanity.io/images/1khn3hf4/production/abc.jpg";

const story: NewsStory = {
  slug: "pxp-day",
  title: "Parent Hub: the school day",
  excerpt: "Alerts and payments in one app.",
  publishedAt: "2026-10-04T03:00:00.000Z",
  category: "product",
  app: "parent-hub",
  body: [
    { _key: "k0", style: "normal", text: "First paragraph." },
    { _key: "k1", style: "h2", text: "A subheading" },
    { _key: "k2", style: "normal", text: "Second paragraph." },
    { _key: "k3", style: "normal", text: "" },
  ],
};

const props = (slug: string) => ({
  params: Promise.resolve({ locale: "en", slug }),
  searchParams: Promise.resolve({}),
});

async function renderPage(found: NewsStory | null = story) {
  vi.mocked(getPost).mockResolvedValue(found);
  return render(await StoryPage(props(found?.slug ?? "x")));
}

const bodyParagraphs = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll(".art-body > p:not(.sample)"),
    (p) => p.textContent,
  );

describe("StoryPage", () => {
  it("shows the photo with its alt inside .art-img, and no breadcrumb", async () => {
    const { container } = await renderPage({
      ...story,
      image: PHOTO,
      alt: "Parents at the school gate",
    });

    const img = screen.getByRole("img", { name: "Parents at the school gate" });
    expect(img.closest(".art-img")).not.toBeNull();
    expect(img.getAttribute("src")).toBe(`${PHOTO}?w=1800&auto=format`);
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(container.querySelector(".crumbs")).toBeNull();
  });

  it.each([
    ["no image", { image: null, alt: "Parents" }],
    ["an image with no alt", { image: PHOTO, alt: "  " }],
  ])("shows no photo block for %s", async (_, fields) => {
    const { container } = await renderPage({ ...story, ...fields });

    expect(container.querySelector(".art-img")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });

  it("renders Back to News, pill and date, H1, summary and body, with no See-app link and no capture band", async () => {
    const { container } = await renderPage();

    const hero = container.querySelector(".art-hero");
    const back = screen.getByRole("link", { name: "Back to News" });
    expect(back.getAttribute("href")).toBe("/en/news");
    expect(back.className).toBe("art-back");
    expect(hero?.firstElementChild?.firstElementChild).toBe(back);

    expect(screen.getByText("Parents").className).toBe("art-pill");
    const time = container.querySelector("time");
    expect(time?.className).toBe("art-date");
    expect(time?.getAttribute("datetime")).toBe(story.publishedAt);
    expect(time?.textContent).toBe("4 Oct 2026");

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe(story.title);
    expect(h1.id).toBe("story-h1");
    expect(container.querySelector(".art-dek")?.textContent).toBe(
      story.excerpt,
    );

    expect(bodyParagraphs(container)).toEqual([
      "First paragraph.",
      "Second paragraph.",
    ]);
    expect(
      screen.getByRole("heading", { level: 2, name: "A subheading" }),
    ).toBeTruthy();

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.queryByRole("link", { name: /^See / })).toBeNull();
    expect(container.querySelector(".sample")).toBeNull();
    expect(container.querySelector("#cap-h")).toBeNull();
    expect(vi.mocked(getPost)).toHaveBeenCalledWith("pxp-day", "en");
  });

  it("shows the Company pill for a company story", async () => {
    await renderPage({ ...story, category: "company", app: null });

    expect(screen.getByText("Company").className).toBe("art-pill");
  });

  it("leaves out the pill, date and summary when the story has none", async () => {
    const { container } = await renderPage({
      ...story,
      category: null,
      publishedAt: "not a date",
      excerpt: "  ",
    });

    expect(container.querySelector(".art-pill")).toBeNull();
    expect(container.querySelector("time")).toBeNull();
    expect(container.querySelector(".art-dek")).toBeNull();
  });

  it("shows no sample note, even under a [Placeholder] story", async () => {
    const { container } = await renderPage({
      ...story,
      title: "[Placeholder] Making the school day easier",
    });

    expect(container.querySelector(".sample")).toBeNull();
  });

  it.each([
    ["is null", null],
    ["has only empty blocks", [{ _key: "k9", style: "normal", text: " " }]],
  ])(
    "renders no body paragraph when the body %s (the summary is above)",
    async (_, body) => {
      const { container } = await renderPage({ ...story, body });

      expect(bodyParagraphs(container)).toEqual([]);
      expect(container.querySelector(".art-dek")?.textContent).toBe(
        story.excerpt,
      );
    },
  );

  it("calls notFound for an unknown slug", async () => {
    await expect(renderPage(null)).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("defines every class it uses in globals.css", async () => {
    const { container } = await renderPage({
      ...story,
      title: "[Placeholder] A sample",
      image: PHOTO,
      alt: "Parents at the school gate",
    });
    expect(undefinedClasses(container, /^sr-only$/)).toEqual([]);
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

describe("StoryPage in Vietnamese", () => {
  it("shows Vietnamese chrome and date, and marks an English fallback", async () => {
    vi.mocked(getPost).mockResolvedValue({
      ...story,
      title: "Parent Hub: ngày học",
      titleLang: "vi",
      excerptLang: "en",
      bodyLang: "en",
    });
    const { container } = render(
      await StoryPage({
        params: Promise.resolve({ locale: "vi", slug: "pxp-day" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(getPost).toHaveBeenCalledWith("pxp-day", "vi");
    expect(screen.getByText("Quay lại Tin tức")).toBeTruthy();
    expect(container.querySelector(".art-date")?.textContent).toBe(
      "04/10/2026",
    );
    expect(container.querySelector(".art-pill")?.textContent).toBe("Phụ huynh");
    expect(screen.getByRole("heading", { level: 1 }).hasAttribute("lang")).toBe(
      false,
    );
    expect(container.querySelector(".art-dek")?.getAttribute("lang")).toBe(
      "en",
    );
    expect(screen.getByText("First paragraph.").getAttribute("lang")).toBe(
      "en",
    );
    expect(screen.getByText("A subheading").getAttribute("lang")).toBe("en");
  });

  it("marks the English photo alt on vi", async () => {
    vi.mocked(getPost).mockResolvedValue({
      ...story,
      image: PHOTO,
      alt: "Parents at the school gate",
    });
    render(
      await StoryPage({
        params: Promise.resolve({ locale: "vi", slug: "pxp-day" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(
      screen.getByAltText("Parents at the school gate").getAttribute("lang"),
    ).toBe("en");
  });

  it("adds no lang attribute on /en when every field is English", async () => {
    vi.mocked(getPost).mockResolvedValue({
      ...story,
      titleLang: "en",
      excerptLang: "en",
      bodyLang: "en",
    });
    const { container } = render(await StoryPage(props("pxp-day")));

    expect(container.querySelector("[lang]")).toBeNull();
  });

  it("fetches the metadata story in Vietnamese", async () => {
    vi.mocked(getPost).mockResolvedValue(story);
    await generateMetadata({
      params: Promise.resolve({ locale: "vi", slug: "pxp-day" }),
      searchParams: Promise.resolve({}),
    });
    expect(getPost).toHaveBeenCalledWith("pxp-day", "vi");
  });

  it("titles the story in Vietnamese and falls back to the Vietnamese News description", async () => {
    vi.mocked(getPost).mockResolvedValue({ ...story, excerpt: null });
    await expect(
      generateMetadata({
        params: Promise.resolve({ locale: "vi", slug: "pxp-day" }),
        searchParams: Promise.resolve({}),
      }),
    ).resolves.toEqual({
      title: "Parent Hub: the school day | XionTech",
      description: newsMetaVi.description,
    });
  });
});
