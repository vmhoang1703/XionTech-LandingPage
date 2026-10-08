import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LatestPost } from "@/lib/news/latest-posts";
import { NewsCard } from "./news-card";

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: vi.fn() }));

const post: LatestPost = {
  slug: "pxp-launch",
  title: "Parent Hub launches",
  excerpt: "A short summary.",
  publishedAt: "2026-09-18T03:00:00.000Z",
  category: "company",
  app: null,
};

describe("NewsCard", () => {
  it("shows date, tag, title, excerpt and a link to the story", () => {
    const { container } = render(<NewsCard post={post} />);

    const time = container.querySelector("time");
    expect(time?.getAttribute("datetime")).toBe(post.publishedAt);
    expect(time?.textContent).toBe("18 Sep 2026");
    expect(screen.getByText("Company").className).toBe("cat");
    expect(
      screen.getByRole("heading", { level: 3, name: "Parent Hub launches" }),
    ).toBeTruthy();
    expect(screen.getByText("A short summary.")).toBeTruthy();
    const link = screen.getByRole("link", {
      name: "Read story Parent Hub launches",
    });
    expect(link.getAttribute("href")).toBe("/news/pxp-launch");
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
  });

  it("is a plain card by default and a wide feature card with the feature flag", () => {
    const { container, rerender } = render(<NewsCard post={post} />);
    expect(container.querySelector("article")?.className).toBe("spot ncard");

    rerender(<NewsCard post={post} feature />);
    expect(container.querySelector("article")?.className).toBe(
      "spot ncard big",
    );
  });

  it("encodes the slug in the story link", () => {
    render(<NewsCard post={{ ...post, slug: "a/b?c" }} />);

    expect(
      screen
        .getByRole("link", { name: "Read story Parent Hub launches" })
        .getAttribute("href"),
    ).toBe("/news/a%2Fb%3Fc");
  });

  it("tags a product story with its audience", () => {
    render(
      <NewsCard post={{ ...post, category: "product", app: "parent-hub" }} />,
    );

    expect(screen.getByText("Parents").className).toBe("cat");
  });

  it("leaves out the tag and the excerpt when they are missing", () => {
    const { container } = render(
      <NewsCard post={{ ...post, category: null, excerpt: null }} />,
    );

    expect(container.querySelector(".cat")).toBeNull();
    expect(container.querySelector("p")).toBeNull();
  });
});
