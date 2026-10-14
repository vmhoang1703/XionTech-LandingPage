import { ListIcon, XIcon } from "@phosphor-icons/react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import Link from "next/link";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MobileMenu } from "./mobile-menu";
import { SiteHeader } from "./site-header";

let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: vi.fn() }),
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

// Stand-in header: the logo, then the menu. The real SiteHeader is tested further down.
function Header() {
  return (
    <header>
      <Link href="/">logo</Link>
      <MobileMenu locale="en" />
    </header>
  );
}

const menuButton = () => screen.getByRole("button", { name: "Menu" });
const panel = () =>
  document.getElementById(menuButton().getAttribute("aria-controls") ?? "");
const expanded = () => menuButton().getAttribute("aria-expanded");
// Which Phosphor icon the button shows, told apart by its drawing.
const ICONS = {
  list: renderToStaticMarkup(<ListIcon aria-hidden="true" />),
  x: renderToStaticMarkup(<XIcon aria-hidden="true" />),
};
const icon = () => {
  const svg = menuButton().querySelector("svg")?.outerHTML;
  return (
    (Object.keys(ICONS) as (keyof typeof ICONS)[]).find(
      (name) => ICONS[name] === svg,
    ) ?? null
  );
};
const menuLinks = () =>
  [...(panel()?.querySelectorAll("a") ?? [])].filter(
    (a) => a.getClientRects().length > 0,
  );
// The last focusable item: the second phone under Get in touch (lead, 2026-10-13).
const LAST = "Ho Chi Minh City +84 908 107 552";
const tab = (shiftKey = false) =>
  fireEvent.keyDown(document, { key: "Tab", shiftKey });

describe("MobileMenu", () => {
  it("shows Vietnamese labels and /vi links on vi", () => {
    render(
      <header>
        <MobileMenu locale="vi" />
      </header>,
    );
    fireEvent.click(menuButton());
    expect(expanded()).toBe("true");
    const links = menuLinks();
    expect(links.map((a) => a.textContent)).toEqual([
      "Trang chủ",
      "Sản phẩm",
      "Dịch vụ",
      "Tin tức",
      "Về chúng tôi",
      "Tuyển dụng",
      "Liên hệ với chúng tôi",
      "Plano +1 469 322 9899",
      "TP. Hồ Chí Minh +84 908 107 552",
    ]);
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "/vi",
      "/vi/products",
      "/vi/services",
      "/vi/news",
      "/vi/about",
      "/vi/careers",
      "/vi#contact",
      "tel:+14693229899",
      "tel:+84908107552",
    ]);
    expect(panel()?.getAttribute("aria-label")).toBe("Điều hướng chính");
  });

  it("renders a closed 44px list icon named Menu that controls the panel", () => {
    render(<Header />);
    expect(menuButton().textContent).toBe("Menu");
    expect(menuButton().querySelector(".sr-only")?.textContent).toBe("Menu");
    expect(icon()).toBe("list");
    expect(menuButton().className).toContain("min-[1081px]:hidden");
    expect(menuButton().className).toContain("size-11");
    // A 320px pill must not squeeze it below 44px (lead, 2026-10-13).
    expect(menuButton().className).toContain("shrink-0");
    // Round like the nav links; Get in touch keeps it at the right edge.
    expect(menuButton().className).toContain("rounded-full");
    expect(menuButton().className).not.toContain("ml-auto");
    expect(menuButton().className).not.toContain("border");
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

  it("opens on click and lists the six pages, then Get in touch and both phones", () => {
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
      ["Home", "/en"],
      ["Products", "/en/products"],
      ["Services", "/en/services"],
      ["News", "/en/news"],
      ["About", "/en/about"],
      ["Careers", "/en/careers"],
      ["Get in touch", "/en#contact"],
      ["Plano +1 469 322 9899", "tel:+14693229899"],
      [LAST, "tel:+84908107552"],
    ]);
  });

  it("toggles closed on a second click", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    fireEvent.click(menuButton());
    expect(expanded()).toBe("false");
    expect(panel()?.hasAttribute("hidden")).toBe(true);
  });

  it("shows a cross while open and the list icon again when closed", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    expect(icon()).toBe("x");
    expect(menuButton().textContent).toBe("Menu");
    fireEvent.click(menuButton());
    expect(icon()).toBe("list");
  });

  it("ends with Get in touch and both phones at any width, no Book a demo", () => {
    for (const w of [390, 640, 800]) {
      width = w;
      const { unmount } = render(<Header />);
      fireEvent.click(menuButton());
      expect(menuLinks().map((a) => a.textContent)).toEqual([
        "Home",
        "Products",
        "Services",
        "News",
        "About",
        "Careers",
        "Get in touch",
        "Plano +1 469 322 9899",
        LAST,
      ]);
      unmount();
    }
  });

  it("marks Home current on / only", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    const current = menuLinks().filter((a) => a.hasAttribute("aria-current"));
    expect(current.map((a) => a.textContent)).toEqual(["Home"]);
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
    expect(
      screen.getByRole("link", { name: "Home" }).hasAttribute("aria-current"),
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
      screen.getByRole("link", { name: LAST }).focus();
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
        screen.getByRole("link", { name: LAST }),
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
      expect(document.activeElement?.textContent).toBe(LAST);
    });

    it("does not trap Tab while closed", () => {
      render(<Header />);
      menuButton().focus();
      expect(tab()).toBe(true);
      expect(document.activeElement).toBe(menuButton());
    });
  });

  it("traps Tab between the logo and the last item at 800px", () => {
    width = 800;
    render(<Header />);
    fireEvent.click(menuButton());
    screen.getByRole("link", { name: LAST }).focus();
    tab();
    expect(document.activeElement?.textContent).toBe("logo");
    tab(true);
    expect(document.activeElement?.textContent).toBe(LAST);
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

  it("closes when Get in touch is activated", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    const contact = screen.getByRole("link", { name: "Get in touch" });
    contact.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(contact);
    expect(expanded()).toBe("false");
  });

  it("ignores a click whose target is not an element", () => {
    render(<Header />);
    fireEvent.click(menuButton());
    expect(() => fireEvent.click(document)).not.toThrow();
    expect(expanded()).toBe("true");
  });

  it("puts focus back on Menu when a menu link to the current page is activated", () => {
    mockPathname = "/en/careers";
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

  it("closes on any link click, also a modifier click or a new-tab link (CAP-8 as written)", () => {
    render(
      <header>
        <a href="https://example.com/" target="_blank" rel="noreferrer">
          external
        </a>
        <MobileMenu locale="en" />
      </header>,
    );
    const external = screen.getByRole("link", { name: "external" });
    external.addEventListener("click", (event) => event.preventDefault());
    for (const init of [
      {},
      { ctrlKey: true },
      { metaKey: true },
      { shiftKey: true },
      { altKey: true },
    ]) {
      fireEvent.click(menuButton());
      expect(expanded()).toBe("true");
      fireEvent.click(external, init);
      expect(expanded()).toBe("false");
    }
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
    const language = () => screen.getByRole("button", { name: /Language/ });

    it("wraps between the logo and the language button at 375px", () => {
      render(<SiteHeader locale="en" />);
      fireEvent.click(menuButton());
      language().focus();
      expect(tab()).toBe(false);
      expect(document.activeElement).toBe(home());
      expect(tab(true)).toBe(false);
      expect(document.activeElement).toBe(language());
    });
  });
});
