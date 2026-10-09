import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import NotFound, { metadata } from "./not-found";

describe("NotFound page", () => {
  it("shows the lost-trail H1 without a label or highlight, and the lede", () => {
    const { container } = render(<NotFound />);

    expect(screen.queryByText("404")).toBeNull();
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe("You’ve wandered off the trail.");
    expect(headings[0].querySelector(".hl")).toBeNull();
    expect(container.querySelector(".label")).toBeNull();
    expect(
      screen.getByText(
        "The page you were looking for isn’t here. Follow the trail back home, or pick a path below.",
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

  it("draws a decorative trail map from You are here to Home, with the X at Home", () => {
    const { container } = render(<NotFound />);

    const map = container.querySelector("figure.trail-map");
    expect(map?.getAttribute("aria-hidden")).toBe("true");
    const labels = Array.from(map?.querySelectorAll("text") ?? []).map(
      (t) => t.textContent,
    );
    expect(labels).toEqual(["You are here", "Home"]);
    expect(map?.querySelector("path.tm-trail")).not.toBeNull();
    const x = map?.querySelector("img.tm-x");
    expect(x?.getAttribute("alt")).toBe("");
    expect(x?.getAttribute("src")).toContain("x-mark");
  });

  it("no longer uses the shared hero art", () => {
    const { container } = render(<NotFound />);

    expect(container.querySelector(".aurora, canvas.strands")).toBeNull();
  });

  it("has no capture band and leaves main to the root layout", () => {
    render(<NotFound />);

    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("main")).toBeNull();
  });

  it("sets the Not found title and keeps the page out of search results", () => {
    expect(metadata.title).toBe("Page not found | XionTech");
    expect(metadata.robots).toEqual({ index: false });
  });

  it("uses only defined classes, and stops the trail motion under reduced motion", () => {
    const { container } = render(<NotFound />);

    expect(
      undefinedClasses(
        container,
        /^(sr-only|wrap|flex|min-h-\[70dvh\]|items-center|mt-8|flex-wrap|gap-3\.5)$/,
      ),
    ).toEqual([]);
    const css = globalsCss();
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*\.tm-trail[^}]*\{[^}]*animation: none/,
    );
  });
});
