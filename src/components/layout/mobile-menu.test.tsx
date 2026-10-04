import { act, fireEvent, render, screen } from "@testing-library/react";
import Link from "next/link";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MobileMenu } from "./mobile-menu";
import { SiteHeader } from "./site-header";

let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

// jsdom has no layout. Elements get boxes the way the header's breakpoint classes would
// give them at `width`, so the focus trap sees only what a browser would show.
let width = 375;
function shown(el: Element) {
  if (el.closest("[hidden]")) return false;
  const css = el.classList;
  // Tailwind v4 compiles max-[641px] to (width < 641px), that is 640px and below.
  if (css.contains("max-[641px]:hidden")) return width >= 641;
  if (css.contains("max-[641px]:inline-flex")) return width < 641;
  if (css.contains("min-[1081px]:hidden")) return width <= 1080;
  if (css.contains("min-[1081px]:flex")) return width > 1080;
  return !css.contains("hidden");
}

// matchMedia stub: `widen()` fires the "(min-width: 1081px)" change a browser sends.
let mediaListeners: ((event: { matches: boolean }) => void)[] = [];
const widen = () => {
  for (const listener of mediaListeners) listener({ matches: true });
};

beforeEach(() => {
  mockPathname = "/";
  width = 375;
  mediaListeners = [];
  vi.spyOn(Element.prototype, "getClientRects").mockImplementation(function (
    this: Element,
  ) {
    return (shown(this) ? [{}] : []) as unknown as DOMRectList;
  });
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: (_type: string, listener: () => void) => {
        mediaListeners.push(listener);
      },
      removeEventListener: (_type: string, listener: () => void) => {
        mediaListeners = mediaListeners.filter((l) => l !== listener);
      },
    })),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.documentElement.style.overflow = "";
});

// Stand-in header with the real breakpoint classes: logo, Book a demo (hidden at
// 640px and below), then the menu. The real SiteHeader is tested further down.
function Header() {
  return (
    <header>
      <Link href="/">logo</Link>
      <Link href="/demo#form" className="max-[641px]:hidden">
        Book a demo
      </Link>
      <MobileMenu />
    </header>
  );
}

const menuButton = () => screen.getByRole("button", { name: "Menu" });
const panel = () =>
  document.getElementById(menuButton().getAttribute("aria-controls") ?? "");
const expanded = () => menuButton().getAttribute("aria-expanded");
const menuLinks = () =>
  [...(panel()?.querySelectorAll("a") ?? [])].filter(
    (a) => a.getClientRects().length > 0,
  );
const tab = (shiftKey = false) =>
  fireEvent.keyDown(document, { key: "Tab", shiftKey });

describe("MobileMenu", () => {
  it("renders a closed Menu pill that controls the panel", () => {
    render(<Header />);
    expect(menuButton().textContent).toBe("Menu");
    expect(menuButton().className).toContain("min-[1081px]:hidden");
    expect(menuButton().className).toContain("h-10");
    expect(menuButton().className).toContain("rounded-full");
    expect(expanded()).toBe("false");
    expect(panel()?.tagName).toBe("NAV");
    expect(panel()?.hasAttribute("hidden")).toBe(true);
  });

  it("keeps closed menu items out of reach", () => {
    render(<Header />);
    expect(screen.queryByRole("link", { name: "News" })).toBeNull();
    expect(menuLinks()).toEqual([]);
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("opens on click and lists the five pages", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    expect(expanded()).toBe("true");
    expect(panel()?.hasAttribute("hidden")).toBe(false);
    const nav = screen.getByRole("navigation", { name: "Main" });
    const hrefs = [...nav.querySelectorAll("a")].map((a) => [
      a.textContent,
      a.getAttribute("href"),
    ]);
    expect(hrefs).toEqual([
      ["Book a demo", "/demo#form"],
      ["Products", "/products"],
      ["Services", "/services"],
      ["News", "/news"],
      ["About", "/about"],
      ["Careers", "/careers"],
    ]);
  });

  it("toggles closed on a second click", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    fireEvent.click(menuButton());
    expect(expanded()).toBe("false");
    expect(panel()?.hasAttribute("hidden")).toBe(true);
  });

  it("shows Book a demo first, in button style, at 640px and below", () => {
    width = 640;
    render(<Header />);
    fireEvent.click(menuButton());
    const first = menuLinks()[0];
    expect(first.textContent).toBe("Book a demo");
    expect(first.getAttribute("href")).toBe("/demo#form");
    expect(first.className).toContain("btn-primary");
  });

  it("leaves Book a demo out of the menu between 641px and 1080px", () => {
    width = 641;
    render(<Header />);
    fireEvent.click(menuButton());
    expect(menuLinks().map((a) => a.textContent)).toEqual([
      "Products",
      "Services",
      "News",
      "About",
      "Careers",
    ]);
  });

  it("marks the current section", () => {
    mockPathname = "/news/x";
    render(<Header />);
    fireEvent.click(menuButton());
    expect(
      screen.getByRole("link", { name: "News" }).getAttribute("aria-current"),
    ).toBe("page");
    expect(
      screen.getByRole("link", { name: "About" }).hasAttribute("aria-current"),
    ).toBe(false);
  });

  it("closes on Escape and returns focus to the Menu button", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    screen.getByRole("link", { name: "About" }).focus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(expanded()).toBe("false");
    expect(document.activeElement).toBe(menuButton());
  });

  it("ignores other keys while open", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    fireEvent.keyDown(document, { key: "a" });
    expect(expanded()).toBe("true");
  });

  it("locks page scroll while open and releases it on close", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    expect(document.documentElement.style.overflow).toBe("hidden");
    fireEvent.click(menuButton());
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("releases the scroll lock when unmounted while open", () => {
    const { unmount } = render(<Header />);
    fireEvent.click(menuButton());
    unmount();
    expect(document.documentElement.style.overflow).toBe("");
  });

  describe("focus trap at 375px", () => {
    it("wraps Tab from the last item to the logo link", () => {
      render(<Header />);
      fireEvent.click(menuButton());
      screen.getByRole("link", { name: "Careers" }).focus();
      expect(tab()).toBe(false);
      expect(document.activeElement).toBe(
        screen.getByRole("link", { name: "logo" }),
      );
    });

    it("wraps Shift+Tab from the logo link to the last item", () => {
      render(<Header />);
      fireEvent.click(menuButton());
      screen.getByRole("link", { name: "logo" }).focus();
      expect(tab(true)).toBe(false);
      expect(document.activeElement).toBe(
        screen.getByRole("link", { name: "Careers" }),
      );
    });

    it("lets Tab move normally inside the header", () => {
      render(<Header />);
      fireEvent.click(menuButton());
      menuButton().focus();
      expect(tab()).toBe(true);
      expect(tab(true)).toBe(true);
      expect(document.activeElement).toBe(menuButton());
    });

    it("brings focus from outside the header back to its edges", () => {
      render(
        <>
          <Header />
          <button>page</button>
        </>,
      );
      fireEvent.click(menuButton());
      const page = screen.getByRole("button", { name: "page" });
      page.focus();
      expect(tab()).toBe(false);
      expect(document.activeElement?.textContent).toBe("logo");
      page.focus();
      expect(tab(true)).toBe(false);
      expect(document.activeElement?.textContent).toBe("Careers");
    });

    it("does not trap Tab while closed", () => {
      render(<Header />);
      menuButton().focus();
      expect(tab()).toBe(true);
      expect(document.activeElement).toBe(menuButton());
    });
  });

  it("includes the header Book a demo in the trap at 800px", () => {
    width = 800;
    render(<Header />);
    fireEvent.click(menuButton());
    screen.getByRole("link", { name: "Careers" }).focus();
    tab();
    expect(document.activeElement?.textContent).toBe("logo");
    tab(true);
    expect(document.activeElement?.textContent).toBe("Careers");
    // The header Book a demo is the only "Book a demo" a browser shows at 800px.
    const shownDemo = screen
      .getAllByRole("link", { name: "Book a demo" })
      .filter((a) => a.getClientRects().length > 0);
    expect(shownDemo.map((a) => a.closest("nav"))).toEqual([null]);
  });

  it("closes when a menu link is activated", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    const link = screen.getByRole("link", { name: "Services" });
    link.addEventListener("click", (event) => event.preventDefault());
    link.focus();
    fireEvent.click(link);
    expect(expanded()).toBe("false");
    expect(document.documentElement.style.overflow).toBe("");
    // Another page: the code does not move focus (jsdom keeps it on the link).
    expect(document.activeElement).toBe(link);
  });

  it("closes when the pathname changes", () => {
    const { rerender } = render(<Header />);
    fireEvent.click(menuButton());
    mockPathname = "/about";
    rerender(<Header />);
    expect(expanded()).toBe("false");
    mockPathname = "/";
    rerender(<Header />);
    expect(expanded()).toBe("false");
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("closes when the viewport grows above 1080px", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    expect(matchMedia).toHaveBeenCalledWith("(min-width: 1081px)");
    act(widen);
    expect(expanded()).toBe("false");
    expect(document.documentElement.style.overflow).toBe("");
    expect(mediaListeners).toEqual([]);
  });

  it("stays open on a media change that is not above 1080px", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    act(() => {
      for (const listener of mediaListeners) listener({ matches: false });
    });
    expect(expanded()).toBe("true");
  });

  it("ignores a click whose target is not an element", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    expect(() => fireEvent.click(document)).not.toThrow();
    expect(expanded()).toBe("true");
  });

  it("puts focus back on Menu when a menu link to the current page is activated", () => {
    mockPathname = "/careers";
    render(<Header />);
    fireEvent.click(menuButton());
    const careers = menuLinks().find((a) => a.textContent === "Careers");
    if (!careers) throw new Error("no Careers link in the panel");
    careers.addEventListener("click", (event) => event.preventDefault());
    careers.focus();
    fireEvent.click(careers);
    expect(expanded()).toBe("false");
    expect(document.activeElement).toBe(menuButton());
  });

  it("closes when a header link to the current page is activated", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    const logo = screen.getByRole("link", { name: "logo" });
    logo.addEventListener("click", (event) => event.preventDefault());
    logo.focus();
    fireEvent.click(logo);
    expect(expanded()).toBe("false");
    expect(document.documentElement.style.overflow).toBe("");
    // The logo stays visible, so focus stays on it.
    expect(document.activeElement).toBe(logo);
  });

  it("moves focus to the target of a menu link to a part of this page (#form on /demo)", () => {
    mockPathname = "/demo";
    render(
      <>
        <Header />
        <section id="form">form</section>
      </>,
    );
    fireEvent.click(menuButton());
    const demo = panel()?.querySelector('a[href="/demo#form"]');
    if (!(demo instanceof HTMLElement)) throw new Error("no /demo#form link");
    demo.addEventListener("click", (event) => event.preventDefault());
    demo.focus();
    fireEvent.click(demo);
    expect(expanded()).toBe("false");
    const form = document.getElementById("form");
    expect(document.activeElement).toBe(form);
    expect(form?.getAttribute("tabindex")).toBe("-1");
  });

  it("restores an earlier overflow value on close", () => {
    document.documentElement.style.overflow = "clip";
    render(<Header />);
    fireEvent.click(menuButton());
    expect(document.documentElement.style.overflow).toBe("hidden");
    fireEvent.click(menuButton());
    expect(document.documentElement.style.overflow).toBe("clip");
  });

  describe("in the real site header", () => {
    const home = () => screen.getByRole("link", { name: "XionTech home" });
    const menuCareers = () =>
      panel()?.querySelector('a[href="/careers"]') as HTMLElement;

    it("wraps between the logo and the last menu item at 375px", () => {
      render(<SiteHeader />);
      fireEvent.click(menuButton());
      menuCareers().focus();
      expect(tab()).toBe(false);
      expect(document.activeElement).toBe(home());
      expect(tab(true)).toBe(false);
      expect(document.activeElement).toBe(menuCareers());
    });

    it("keeps the header Book a demo in the trap at 800px", () => {
      width = 800;
      render(<SiteHeader />);
      fireEvent.click(menuButton());
      const demo = screen
        .getAllByRole("link", { name: "Book a demo" })
        .find((a) => a.getClientRects().length > 0);
      expect(demo?.closest("nav")).toBeNull();
      // Inside the trap and not at its start, so Shift+Tab moves on normally.
      demo?.focus();
      expect(tab(true)).toBe(true);
      menuCareers().focus();
      expect(tab()).toBe(false);
      expect(document.activeElement).toBe(home());
    });
  });
});
