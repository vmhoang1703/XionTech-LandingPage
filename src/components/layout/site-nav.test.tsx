import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteNav } from "./site-nav";

let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

const nav = () => screen.getByRole("navigation", { name: "Main" });
const links = () => [...nav().querySelectorAll("a")];
const current = () =>
  links()
    .filter((a) => a.getAttribute("aria-current") === "page")
    .map((a) => a.textContent);

beforeEach(() => {
  mockPathname = "/";
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SiteNav", () => {
  it("lists six plain links in order, with no React warning", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<SiteNav />);
    expect(links().map((a) => [a.textContent, a.getAttribute("href")])).toEqual(
      [
        ["Home", "/"],
        ["Products", "/products"],
        ["Services", "/services"],
        ["News", "/news"],
        ["About", "/about"],
        ["Careers", "/careers"],
      ],
    );
    expect(error).not.toHaveBeenCalled();
  });

  it("has no menu buttons and no mega-menu panels", () => {
    const { container } = render(<SiteNav />);
    expect(container.querySelector("button")).toBeNull();
    expect(container.querySelector("[aria-expanded]")).toBeNull();
    expect(document.getElementById("mega-products")).toBeNull();
    expect(document.getElementById("mega-services")).toBeNull();
  });

  it.each([
    ["/", ["Home"]],
    ["/products", ["Products"]],
    ["/services", ["Services"]],
    ["/news/some-story", ["News"]],
    ["/about", ["About"]],
    ["/careers/a-role", ["Careers"]],
    ["/demo", []],
    ["/privacy", []],
    ["/no-such-page", []],
  ])("on %s marks %j as the current page", (path, expected) => {
    mockPathname = path;
    render(<SiteNav />);
    expect(current()).toEqual(expected);
  });

  it("shows only above 1080px, on the right, 30px apart", () => {
    render(<SiteNav />);
    const css = nav().className;
    expect(css).toContain("hidden");
    expect(css).toContain("min-[1081px]:flex");
    expect(css).toContain("ml-auto");
    expect(css).toContain("gap-[30px]");
  });

  it("styles links as words: no side padding, no pill, amber underline on hover and when current", () => {
    render(<SiteNav />);
    const css = links()[1].className;
    expect(css).toContain("h-11");
    expect(css).not.toMatch(/(^|\s)p[xl]?-/);
    expect(css).not.toContain("hover:bg-");
    expect(css).not.toContain("rounded-full");
    expect(css).toContain("hover:shadow-[inset_0_-2px_0_var(--color-amber)]");
    expect(css).toContain(
      "aria-[current=page]:shadow-[inset_0_-2px_0_var(--color-amber)]",
    );
    expect(css).toContain("aria-[current=page]:font-medium");
  });
});
