import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./site-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("SiteHeader", () => {
  it("puts the skip link first and points it at #main", () => {
    render(<SiteHeader />);
    const first = screen.getAllByRole("link")[0];
    expect(first.textContent).toBe("Skip to content");
    expect(first.getAttribute("href")).toBe("#main");
  });

  it("links the logo to the home page with its labels", () => {
    render(<SiteHeader />);
    const home = screen.getByRole("link", { name: "XionTech home" });
    expect(home.getAttribute("href")).toBe("/");
    const logo = screen.getByAltText("XionTech, Get IT Done");
    expect(home.contains(logo)).toBe(true);
  });

  it("has no Book a demo link and no bottom border", () => {
    render(<SiteHeader />);
    expect(screen.queryByRole("link", { name: "Book a demo" })).toBeNull();
    expect(screen.getByRole("banner").className).not.toMatch(/border/);
  });

  it("renders the primary nav inside a header", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("banner")).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeTruthy();
  });

  it("puts the main nav after the logo and the Menu button last", () => {
    render(<SiteHeader />);
    const header = screen.getByRole("banner");
    const logo = screen.getByRole("link", { name: "XionTech home" });
    const nav = screen.getAllByRole("navigation", { name: "Main" })[0];
    const menu = screen.getByRole("button", { name: "Menu" });
    expect(header.contains(menu)).toBe(true);
    expect(menu.getAttribute("aria-expanded")).toBe("false");
    expect(
      logo.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      nav.compareDocumentPosition(menu) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(nav.className).toContain("ml-auto");
  });
});
