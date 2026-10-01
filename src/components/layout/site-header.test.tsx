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

  it("links Book a demo to the demo form", () => {
    render(<SiteHeader />);
    const demo = screen.getByRole("link", { name: "Book a demo" });
    expect(demo.getAttribute("href")).toBe("/demo#form");
    expect(demo.className).toContain("btn-primary");
    expect(demo.className).toContain("btn-sm");
  });

  it("renders the primary nav inside a header", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("banner")).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeTruthy();
  });
});
