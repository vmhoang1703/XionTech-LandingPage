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
    const home = screen.getByRole("link", { name: "XionTechs home" });
    expect(home.getAttribute("href")).toBe("/");
    const logo = screen.getByAltText("XionTechs, Get IT Done");
    expect(home.contains(logo)).toBe(true);
  });

  it("links Book a demo to the demo form, as a small primary button", () => {
    render(<SiteHeader />);
    const demo = screen.getByRole("link", { name: "Book a demo" });
    expect(demo.getAttribute("href")).toBe("/demo");
    expect(demo.className).toContain("btn btn-primary btn-sm");
    // Below 1081px the nav is hidden, so the button keeps itself and Menu on the right.
    expect(demo.className).toContain("max-[1080px]:ml-auto");
    expect(demo.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("floats a pill over the page and lets clicks through the strip around it", () => {
    render(<SiteHeader />);
    const header = screen.getByRole("banner");
    expect(header.className).toContain("pointer-events-none");
    expect(header.className).toContain(
      "mb-[calc(var(--spacing-header-room)*-1)]",
    );
    expect(header.className).not.toMatch(/\bborder/);
    const pill = header.firstElementChild as HTMLElement;
    expect(pill.className).toContain("pointer-events-auto");
    expect(pill.className).toContain("rounded-full");
    expect(pill.className).toContain("max-w-[1180px]");
  });

  it("renders the primary nav inside a header", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("banner")).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeTruthy();
  });

  it("puts the main nav after the logo, then Book a demo, and the Menu button last", () => {
    render(<SiteHeader />);
    const header = screen.getByRole("banner");
    const logo = screen.getByRole("link", { name: "XionTechs home" });
    const nav = screen.getAllByRole("navigation", { name: "Main" })[0];
    const menu = screen.getByRole("button", { name: "Menu" });
    const demo = screen.getByRole("link", { name: "Book a demo" });
    expect(header.contains(menu)).toBe(true);
    expect(menu.getAttribute("aria-expanded")).toBe("false");
    expect(
      logo.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      nav.compareDocumentPosition(demo) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      demo.compareDocumentPosition(menu) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(nav.className).toContain("mx-auto");
  });
});
