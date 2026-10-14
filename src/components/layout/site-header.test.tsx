import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./site-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("SiteHeader", () => {
  it("puts the skip link first and points it at #main", () => {
    render(<SiteHeader locale="en" />);
    const first = screen.getAllByRole("link")[0];
    expect(first.textContent).toBe("Skip to content");
    expect(first.getAttribute("href")).toBe("#main");
  });

  it("links the logo to the home page with its labels", () => {
    render(<SiteHeader locale="en" />);
    const home = screen.getByRole("link", { name: "XionTech home" });
    // 44px tall to tap (PRODUCT.md), the logo centred in it.
    expect(home.className).toContain("min-h-11");
    expect(home.className).toContain("items-center");
    expect(home.getAttribute("href")).toBe("/en");
    const logo = screen.getByAltText("XionTech, Get IT Done");
    expect(home.contains(logo)).toBe(true);
  });

  it("links Get in touch to the Home form, as a small primary button", () => {
    render(<SiteHeader locale="en" />);
    // The Demo page is kept but not linked (lead, 2026-10-13).
    const demo = screen.getByRole("link", { name: "Get in touch" });
    expect(demo.getAttribute("href")).toBe("/en#contact");
    expect(demo.className).toContain("btn btn-primary btn-sm");
    // Below 1081px the nav is hidden, so the button keeps itself and Menu on the right.
    expect(demo.className).toContain("max-[1080px]:ml-auto");
    // Below 412px (the narrowest width where the en and vi bars fit, measured
    // 2026-10-14) it leaves the bar; the mobile menu offers it instead.
    // Up to 479px it drops its arrow and side padding (the Vietnamese bar needs this too).
    expect(demo.className).toContain("max-[411px]:hidden");
    expect(demo.className).toContain("max-[479px]:px-3.5");
    expect(demo.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("floats a pill over the page and lets clicks through the strip around it", () => {
    render(<SiteHeader locale="en" />);
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
    render(<SiteHeader locale="en" />);
    expect(screen.getByRole("banner")).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeTruthy();
  });

  it("puts the main nav after the logo, then Get in touch, and the Menu button last", () => {
    render(<SiteHeader locale="en" />);
    const header = screen.getByRole("banner");
    const logo = screen.getByRole("link", { name: "XionTech home" });
    const nav = screen.getAllByRole("navigation", { name: "Main" })[0];
    const menu = screen.getByRole("button", { name: "Menu" });
    const demo = screen.getByRole("link", { name: "Get in touch" });
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

  it("gives the language button its label in the page's language", () => {
    render(<SiteHeader locale="vi" />);
    expect(screen.getByRole("button", { name: /^Ngôn ngữ/ })).toBeTruthy();
  });

  it("puts the language button last in the bar, outside the mobile menu", () => {
    render(<SiteHeader locale="en" />);
    const pill = screen.getByRole("banner").firstElementChild as HTMLElement;
    const language = screen.getByRole("button", { name: /Language/ });
    expect(pill.lastElementChild?.contains(language)).toBe(true);
    expect(document.getElementById("mobile-menu")?.contains(language)).toBe(
      false,
    );
  });

  it("prefixes the links with the locale and reads labels from the shell dictionary", () => {
    render(<SiteHeader locale="vi" />);
    const hrefs = [
      "Trang chủ",
      "Sản phẩm",
      "Dịch vụ",
      "Tin tức",
      "Về chúng tôi",
      "Tuyển dụng",
    ].map((name) =>
      screen.getAllByRole("link", { name })[0].getAttribute("href"),
    );
    expect(hrefs).toEqual([
      "/vi",
      "/vi/products",
      "/vi/services",
      "/vi/news",
      "/vi/about",
      "/vi/careers",
    ]);
    expect(
      screen
        // The header button is the short word; the phone menu keeps the long one.
        .getByRole("link", { name: "Liên hệ" })
        .getAttribute("href"),
    ).toBe("/vi#contact");
    expect(
      screen
        .getByRole("link", { name: "Trang chủ XionTech" })
        .getAttribute("href"),
    ).toBe("/vi");
  });
});
