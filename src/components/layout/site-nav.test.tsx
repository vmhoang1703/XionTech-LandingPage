import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
    expect(screen.getByText("Staff, Teachers, Leaders").textContent).toBe(
      "Staff, Teachers, Leaders",
    );
    expect(screen.getByText("Parents").textContent).toBe("Parents");
    expect(screen.getByText("More products are on the way.")).toBeTruthy();
    expect(href("All products")).toBe("/products");
  });

  it("makes the footer row span both panel columns", () => {
    render(<SiteNav />);
    fireEvent.click(productsTrigger());
    const row = screen.getByText("More products are on the way.").parentElement;
    expect(row?.classList.contains("col-span-full")).toBe(true);
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

  it("closes when focus tabs out of the menu", () => {
    render(
      <>
        <SiteNav />
        <button>outside</button>
      </>,
    );
    fireEvent.click(productsTrigger());
    fireEvent.blur(productsTrigger(), {
      relatedTarget: screen.getByRole("button", { name: "outside" }),
    });
    expect(expanded(productsTrigger())).toBe("false");
  });

  it("stays open when focus moves inside the same menu", () => {
    render(<SiteNav />);
    fireEvent.click(productsTrigger());
    fireEvent.blur(productsTrigger(), {
      relatedTarget: screen.getByRole("link", { name: /PXP/ }),
    });
    expect(expanded(productsTrigger())).toBe("true");
  });

  it("does not move focus on Escape when focus is outside the nav", () => {
    render(<SiteNav />);
    fireEvent.click(productsTrigger());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(expanded(productsTrigger())).toBe("false");
    expect(document.activeElement).toBe(document.body);
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

  it("does not reopen when the user returns to the path it was opened on", () => {
    mockPathname = "/";
    const { rerender } = render(<SiteNav />);
    fireEvent.click(productsTrigger());
    mockPathname = "/news";
    rerender(<SiteNav />);
    mockPathname = "/";
    rerender(<SiteNav />);
    expect(expanded(productsTrigger())).toBe("false");
    expect(screen.queryByRole("link", { name: /PXP/ })).toBeNull();
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

// EXPERIENCE.md "Mega menu" and AC-NAV-3: on desktop with a mouse, hover opens; moving away
// closes after 150ms; a click never closes a menu that hover just opened; touch does not hover.
describe("SiteNav hover (mouse only)", () => {
  const wrapper = (trigger: HTMLElement) => trigger.parentElement as HTMLElement;
  const mouse = { pointerType: "mouse" };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("opens on mouse hover", () => {
    render(<SiteNav />);
    fireEvent.pointerEnter(wrapper(productsTrigger()), mouse);
    expect(expanded(productsTrigger())).toBe("true");
  });

  it("ignores touch and pen hover", () => {
    render(<SiteNav />);
    fireEvent.pointerEnter(wrapper(productsTrigger()), { pointerType: "touch" });
    expect(expanded(productsTrigger())).toBe("false");
  });

  it("closes 150ms after the pointer leaves, not before", () => {
    render(<SiteNav />);
    fireEvent.pointerEnter(wrapper(productsTrigger()), mouse);
    fireEvent.pointerLeave(wrapper(productsTrigger()), mouse);
    act(() => vi.advanceTimersByTime(140));
    expect(expanded(productsTrigger())).toBe("true");
    act(() => vi.advanceTimersByTime(20));
    expect(expanded(productsTrigger())).toBe("false");
  });

  it("stays open when the pointer comes back within 150ms", () => {
    render(<SiteNav />);
    fireEvent.pointerEnter(wrapper(productsTrigger()), mouse);
    fireEvent.pointerLeave(wrapper(productsTrigger()), mouse);
    act(() => vi.advanceTimersByTime(100));
    fireEvent.pointerEnter(wrapper(productsTrigger()), mouse);
    act(() => vi.advanceTimersByTime(200));
    expect(expanded(productsTrigger())).toBe("true");
  });

  it("keeps a hover-opened menu open on click, then a second click closes it", () => {
    render(<SiteNav />);
    fireEvent.pointerEnter(wrapper(productsTrigger()), mouse);
    fireEvent.click(productsTrigger());
    expect(expanded(productsTrigger())).toBe("true");
    fireEvent.click(productsTrigger());
    expect(expanded(productsTrigger())).toBe("false");
  });

  it("switches menus when the pointer moves to the other trigger", () => {
    render(<SiteNav />);
    fireEvent.pointerEnter(wrapper(productsTrigger()), mouse);
    fireEvent.pointerLeave(wrapper(productsTrigger()), mouse);
    fireEvent.pointerEnter(wrapper(servicesTrigger()), mouse);
    expect(expanded(productsTrigger())).toBe("false");
    expect(expanded(servicesTrigger())).toBe("true");
    act(() => vi.advanceTimersByTime(200));
    expect(expanded(servicesTrigger())).toBe("true");
  });
});

// A menu the visitor chose (click, keyboard, or focus moved into it) is pinned: the mouse
// leaving no longer closes it, so keyboard focus is never dropped into a hidden panel.
describe("SiteNav pinned menus", () => {
  const wrapper = (trigger: HTMLElement) => trigger.parentElement as HTMLElement;
  const mouse = { pointerType: "mouse" };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps a click-opened menu open when the mouse leaves", () => {
    render(<SiteNav />);
    fireEvent.click(productsTrigger());
    fireEvent.pointerLeave(wrapper(productsTrigger()), mouse);
    act(() => vi.advanceTimersByTime(200));
    expect(expanded(productsTrigger())).toBe("true");
  });

  it("pins a hover-opened menu once focus moves into it", () => {
    render(<SiteNav />);
    fireEvent.pointerEnter(wrapper(productsTrigger()), mouse);
    fireEvent.focus(screen.getByRole("link", { name: /PXP/ }));
    fireEvent.pointerLeave(wrapper(productsTrigger()), mouse);
    act(() => vi.advanceTimersByTime(200));
    expect(expanded(productsTrigger())).toBe("true");
  });

  it("keeps a hover-opened menu open on a real mouse click (hover, focus, then click)", () => {
    render(<SiteNav />);
    fireEvent.pointerEnter(wrapper(productsTrigger()), mouse);
    fireEvent.focus(productsTrigger()); // a mouse press focuses the button before the click
    fireEvent.click(productsTrigger());
    expect(expanded(productsTrigger())).toBe("true");
  });

  it("ignores a touch pointer leaving", () => {
    render(<SiteNav />);
    fireEvent.pointerEnter(wrapper(productsTrigger()), mouse);
    fireEvent.pointerLeave(wrapper(productsTrigger()), { pointerType: "touch" });
    act(() => vi.advanceTimersByTime(200));
    expect(expanded(productsTrigger())).toBe("true");
  });

  it("clears a pending close when it unmounts", () => {
    const { unmount } = render(<SiteNav />);
    fireEvent.pointerEnter(wrapper(productsTrigger()), mouse);
    fireEvent.pointerLeave(wrapper(productsTrigger()), mouse);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
