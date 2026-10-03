import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import NotFound, { metadata } from "./not-found";

// jsdom has no canvas: HeroArt skips the ribbon, the aurora is CSS.
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("NotFound page", () => {
  it("shows the label, the only H1 with a highlight, and the lede", () => {
    render(<NotFound />);

    expect(screen.getByText("404")).toBeDefined();
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe("We couldn't find that page.");
    expect(headings[0].querySelector(".hl")?.textContent).toBe("that page");
    expect(
      screen.getByText(
        "The link may be old or mistyped. These pages can help.",
      ),
    ).toBeDefined();
  });

  it("has one primary button to Home and glass links to the three routes", () => {
    render(<NotFound />);

    const home = screen.getByRole("link", { name: "Go to Home" });
    expect(home.getAttribute("href")).toBe("/");
    expect(home.className).toContain("btn-primary");
    for (const [name, href] of [
      ["Products", "/products"],
      ["Services", "/services"],
      ["News", "/news"],
    ]) {
      const link = screen.getByRole("link", { name });
      expect(link.getAttribute("href")).toBe(href);
      expect(link.className).toContain("btn-glass");
    }
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });

  it("has no capture band and leaves main to the root layout", () => {
    render(<NotFound />);

    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("main")).toBeNull();
  });

  it("sets a Not found title and keeps the page out of search results", () => {
    expect(metadata.title).toBe("Page not found");
    expect(metadata.robots).toEqual({ index: false });
  });

  it("puts the shared aurora and strand ribbon behind the navy hero", () => {
    const { container } = render(<NotFound />);

    const hero = container.querySelector("section.hero-navy.page-hero");
    expect(hero).not.toBeNull();
    const [aurora, canvas] = Array.from(hero?.children ?? []);
    expect(aurora.classList.contains("aurora")).toBe(true);
    expect(canvas.matches("canvas.strands")).toBe(true);
    expect(aurora.getAttribute("aria-hidden")).toBe("true");
    expect(canvas.getAttribute("aria-hidden")).toBe("true");
  });
});
