import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteNav } from "./site-nav";

let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

const productsTrigger = () => screen.getByRole("button", { name: "Products" });
const servicesTrigger = () => screen.getByRole("button", { name: "Services" });
const expanded = (el: HTMLElement) => el.getAttribute("aria-expanded");
const href = (name: string | RegExp) =>
  screen.getByRole("link", { name }).getAttribute("href");

beforeEach(() => {
  mockPathname = "/";
});

describe("SiteNav", () => {
  it("renders every nav item with the right link targets", () => {
    render(<SiteNav />);
    expect(href("News")).toBe("/news");
    expect(href("About")).toBe("/about");
    expect(href("Careers")).toBe("/careers");
  });

  it("keeps both panels closed and out of the tab order at first", () => {
    render(<SiteNav />);
    expect(expanded(productsTrigger())).toBe("false");
    expect(expanded(servicesTrigger())).toBe("false");
    expect(screen.queryByRole("link", { name: /PXP/ })).toBeNull();
    expect(screen.queryByRole("link", { name: /Cloud Computing/ })).toBeNull();
    const panelId = productsTrigger().getAttribute("aria-controls") ?? "";
    expect(document.getElementById(panelId)?.hasAttribute("hidden")).toBe(true);
  });

  it("opens the products panel on click", () => {
    render(<SiteNav />);
    fireEvent.click(productsTrigger());
    expect(expanded(productsTrigger())).toBe("true");
    expect(href(/PXP/)).toBe("/products#pxp");
    expect(href(/IoT Device Management/)).toBe("/products#iot");
    expect(screen.getByText("Staff, Teachers, Leaders")).toBeTruthy();
    expect(screen.getByText("More products are on the way.")).toBeTruthy();
    expect(href("All products")).toBe("/products");
  });

  it("toggles the panel closed on a second click", () => {
    render(<SiteNav />);
    fireEvent.click(productsTrigger());
    fireEvent.click(productsTrigger());
    expect(expanded(productsTrigger())).toBe("false");
    expect(screen.queryByRole("link", { name: /PXP/ })).toBeNull();
  });

  it("switches from products to services", () => {
    render(<SiteNav />);
    fireEvent.click(productsTrigger());
    fireEvent.click(servicesTrigger());
    expect(expanded(productsTrigger())).toBe("false");
    expect(expanded(servicesTrigger())).toBe("true");
    expect(href(/Cloud Computing/)).toBe("/services#cloud");
    expect(href("See the process")).toBe("/services#process");
  });

  it("closes on Escape and moves focus to the trigger", () => {
    render(<SiteNav />);
    fireEvent.click(servicesTrigger());
    screen.getByRole("link", { name: "See the process" }).focus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(expanded(servicesTrigger())).toBe("false");
    expect(document.activeElement).toBe(servicesTrigger());
  });

  it("does nothing on Escape when no menu is open", () => {
    render(<SiteNav />);
    const news = screen.getByRole("link", { name: "News" });
    news.focus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.activeElement).toBe(news);
    expect(expanded(productsTrigger())).toBe("false");
  });

  it("ignores other keys while a menu is open", () => {
    render(<SiteNav />);
    fireEvent.click(productsTrigger());
    fireEvent.keyDown(document, { key: "a" });
    expect(expanded(productsTrigger())).toBe("true");
  });

  it("closes on a pointer down outside without moving focus", () => {
    render(
      <>
        <SiteNav />
        <button>outside</button>
      </>,
    );
    fireEvent.click(productsTrigger());
    const outside = screen.getByRole("button", { name: "outside" });
    outside.focus();
    fireEvent.pointerDown(outside);
    expect(expanded(productsTrigger())).toBe("false");
    expect(document.activeElement).toBe(outside);
  });

  it("stays open on a pointer down inside the nav", () => {
    render(<SiteNav />);
    fireEvent.click(productsTrigger());
    fireEvent.pointerDown(screen.getByRole("link", { name: /PXP/ }));
    expect(expanded(productsTrigger())).toBe("true");
  });

  it("closes when a link inside the menu is activated", () => {
    render(<SiteNav />);
    fireEvent.click(productsTrigger());
    const link = screen.getByRole("link", { name: /PXP/ });
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link);
    expect(expanded(productsTrigger())).toBe("false");
  });

  it("closes when the pathname changes", () => {
    const { rerender } = render(<SiteNav />);
    fireEvent.click(productsTrigger());
    mockPathname = "/products";
    rerender(<SiteNav />);
    expect(expanded(productsTrigger())).toBe("false");
  });

  it.each([
    ["/news/x", "News"],
    ["/careers/x", "Careers"],
    ["/about", "About"],
  ])("marks %s as current on %s", (path, name) => {
    mockPathname = path;
    render(<SiteNav />);
    expect(
      screen.getByRole("link", { name }).getAttribute("aria-current"),
    ).toBe("page");
  });

  it.each([
    ["/products", "Products"],
    ["/services", "Services"],
  ])("marks the %s trigger as current", (path, name) => {
    mockPathname = path;
    render(<SiteNav />);
    expect(
      screen.getByRole("button", { name }).getAttribute("aria-current"),
    ).toBe("page");
  });

  it.each(["/", "/demo", "/unknown"])("marks nothing on %s", (path) => {
    mockPathname = path;
    render(<SiteNav />);
    expect(document.querySelector("[aria-current]")).toBeNull();
  });
});
