import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LatestPost } from "@/lib/news/latest-posts";
import { undefinedClasses } from "@/test-utils/css-classes";
import { NewsCard } from "./news-card";

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: vi.fn() }));

const post: LatestPost = {
  slug: "pxp-launch",
  title: "Parent Hub launches",
  excerpt: "A short summary.",
  publishedAt: "2026-09-18T03:00:00.000Z",
  category: "schools",
  app: null,
};

const PHOTO = "https://cdn.sanity.io/images/1khn3hf4/production/abc.jpg";

describe("NewsCard", () => {
  it("is one link to the story, named by its title, date and audience", () => {
    const { container } = render(<NewsCard post={post} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    const link = screen.getByRole("link", {
      name: "Parent Hub launches 18 Sep 2026 Schools",
    });
    expect(link.getAttribute("href")).toBe("/en/news/pxp-launch");
    expect(link.className).toBe("scard");

    const time = container.querySelector("time");
    expect(time?.getAttribute("datetime")).toBe(post.publishedAt);
    expect(time?.className).toBe("scard-date");
    expect(screen.getByText("Schools").className).toBe("scard-pill");
    const heading = screen.getByRole("heading", {
      level: 3,
      name: "Parent Hub launches",
    });
    expect(heading.className).toBe("scard-title");
    expect(link.contains(heading)).toBe(true);
    // The excerpt stays on the story page.
    expect(screen.queryByText("A short summary.")).toBeNull();
  });

  it("puts the pill and date at the top, the title in the content and a hidden Read story", () => {
    const { container } = render(<NewsCard post={post} />);

    const card = container.querySelector(".scard");
    expect(
      Array.from(card?.children ?? [], (child) => child.className),
    ).toEqual(["home-media", "scard-meta", "scard-content", "scard-read"]);
    const read = container.querySelector(".scard-read");
    expect(read?.getAttribute("aria-hidden")).toBe("true");
    expect(read?.textContent).toBe("Read story");
    expect(read?.querySelector("svg")).not.toBeNull();
  });

  it("fills the card with the photo, decorative because the title names the link", () => {
    const { container } = render(<NewsCard post={{ ...post, image: PHOTO }} />);

    const img = container.querySelector("img");
    expect(img?.getAttribute("srcset")).toContain(
      `${PHOTO}?w=828&q=75&fit=max&auto=format 828w`,
    );
    expect(img?.getAttribute("sizes")).toBe("(width <= 900px) 100vw, 50vw");
    expect(img?.getAttribute("alt")).toBe("");
    expect(container.querySelector(".home-media")).toBeNull();
  });

  it("shows the empty frame when there is no photo", () => {
    const { container } = render(<NewsCard post={post} />);

    expect(container.querySelector("img")).toBeNull();
    expect(
      container.querySelector(".home-media")?.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("encodes the slug in the story link", () => {
    render(<NewsCard post={{ ...post, slug: "a/b?c" }} />);

    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "/en/news/a%2Fb%3Fc",
    );
  });

  it("gives Company its own pill colour and tags a product story with its audience", () => {
    const { rerender } = render(
      <NewsCard post={{ ...post, category: "team" }} />,
    );
    expect(screen.getByText("Company").className).toBe("scard-pill company");

    rerender(
      <NewsCard post={{ ...post, category: "product", app: "parent-hub" }} />,
    );
    expect(screen.getByText("Parents").className).toBe("scard-pill");
  });

  it("leaves out the pill with no audience and the date when it is unreadable", () => {
    const { container } = render(
      <NewsCard
        post={{ ...post, category: null, publishedAt: "not a date" }}
      />,
    );

    expect(container.querySelector(".scard-pill")).toBeNull();
    expect(container.querySelector("time")).toBeNull();
    expect(
      screen.getByRole("link", { name: "Parent Hub launches" }),
    ).toBeTruthy();
  });

  it("defines every class it uses in globals.css", () => {
    const { container } = render(
      <>
        <NewsCard post={{ ...post, category: "company" }} />
        <NewsCard post={{ ...post, slug: "b", image: PHOTO }} />
      </>,
    );

    expect(undefinedClasses(container)).toEqual([]);
  });
});
