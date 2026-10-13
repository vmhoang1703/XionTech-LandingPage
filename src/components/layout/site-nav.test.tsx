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
    render(<SiteNav locale="en" />);
    expect(links().map((a) => [a.textContent, a.getAttribute("href")])).toEqual(
      [
        ["Home", "/en"],
        ["Products", "/en/products"],
        ["Services", "/en/services"],
        ["News", "/en/news"],
        ["About", "/en/about"],
        ["Careers", "/en/careers"],
      ],
    );
    expect(error).not.toHaveBeenCalled();
  });

  it("has no menu buttons and no mega-menu panels", () => {
    const { container } = render(<SiteNav locale="en" />);
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
    render(<SiteNav locale="en" />);
    expect(current()).toEqual(expected);
  });

  it("shows only above 1080px, in the middle of the pill, 4px apart", () => {
    render(<SiteNav locale="en" />);
    const css = nav().className;
    expect(css).toContain("hidden");
    expect(css).toContain("min-[1081px]:flex");
    expect(css).toContain("mx-auto");
    expect(css).toContain("gap-1");
  });

  it("styles links as small pills: light blue on hover, soft amber when current", () => {
    render(<SiteNav locale="en" />);
    const css = links()[1].className;
    expect(css).toContain("h-11");
    expect(css).toContain("rounded-full");
    expect(css).toContain("px-4");
    expect(css).toContain("font-semibold");
    expect(css).toContain(
      "hover:bg-[color-mix(in_srgb,var(--color-ice)_70%,transparent)]",
    );
    expect(css).toContain(
      "aria-[current=page]:bg-[color-mix(in_srgb,var(--color-amber-light)_38%,white)]",
    );
    expect(css).not.toContain("shadow");
  });
});
