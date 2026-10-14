import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageMenu } from "./language-menu";

const push = vi.fn();
let pathname = "/en/demo";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push }),
}));

function openMenu() {
  fireEvent.click(screen.getByRole("button", { name: /Language/ }));
}

describe("LanguageMenu", () => {
  beforeEach(() => {
    pathname = "/en/demo";
    push.mockClear();
    sessionStorage.clear();
    document.cookie = "locale=; max-age=0; path=/";
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("navigates to the same path in the chosen locale and sets the cookie", () => {
    render(<LanguageMenu label="Language" />);
    openMenu();
    fireEvent.click(screen.getByRole("button", { name: /Tiếng Việt/ }));
    expect(push).toHaveBeenCalledWith("/vi/demo", { scroll: false });
    expect(document.cookie).toContain("locale=vi");
  });

  it("keeps the query and hash when switching", () => {
    window.history.replaceState(null, "", "/en/demo?a=1#form");
    render(<LanguageMenu label="Language" />);
    openMenu();
    fireEvent.click(screen.getByRole("button", { name: /Tiếng Việt/ }));
    expect(push).toHaveBeenCalledWith("/vi/demo?a=1#form", { scroll: false });
    window.history.replaceState(null, "", "/");
  });

  it("marks the current locale and shows its code on the button", () => {
    render(<LanguageMenu label="Language" />);
    const button = screen.getByRole("button", { name: /Language/ });
    expect(button.textContent).toContain("EN");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    openMenu();
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(
      screen
        .getByRole("button", { name: /English/ })
        .getAttribute("aria-current"),
    ).toBe("true");
    expect(
      screen
        .getByRole("button", { name: /Tiếng Việt/ })
        .hasAttribute("aria-current"),
    ).toBe(false);
  });

  it("lists every language by its native name, visibly, with its lang", () => {
    render(<LanguageMenu label="Language" />);
    openMenu();
    const items = screen.getAllByRole("listitem").map((item) => {
      const button = item.querySelector("button");
      return [button?.textContent, button?.getAttribute("lang")];
    });
    expect(items).toEqual([
      ["English", "en"],
      ["Tiếng Việt", "vi"],
      ["日本語", "ja"],
      ["Français", "fr"],
      ["한국어", "ko"],
      ["简体中文", "zh-Hans"],
    ]);
  });

  it("shows the label SiteHeader gives it", () => {
    pathname = "/vi";
    render(<LanguageMenu label="Ngôn ngữ" />);
    expect(
      screen.getByRole("button", { name: /Ngôn ngữ/ }).textContent,
    ).toContain("VI");
  });

  it("choosing the current locale only closes the menu", () => {
    render(<LanguageMenu label="Language" />);
    openMenu();
    fireEvent.click(screen.getByRole("button", { name: /English/ }));
    expect(push).not.toHaveBeenCalled();
    const button = screen.getByRole("button", { name: /Language/ });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
  });

  it("closes on Escape and returns focus to the button", () => {
    render(<LanguageMenu label="Language" />);
    openMenu();
    fireEvent.keyDown(document, { key: "Escape" });
    const button = screen.getByRole("button", { name: /Language/ });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
  });

  it("ignores other keys and Escape while closed", () => {
    render(<LanguageMenu label="Language" />);
    fireEvent.keyDown(document, { key: "Escape" });
    openMenu();
    fireEvent.keyDown(document, { key: "a" });
    const button = screen.getByRole("button", { name: /Language/ });
    expect(button.getAttribute("aria-expanded")).toBe("true");
  });

  it("closes on an outside click and leaves focus where the visitor clicked", () => {
    render(
      <>
        <input aria-label="outside" />
        <LanguageMenu label="Language" />
      </>,
    );
    openMenu();
    const outside = screen.getByRole("textbox", { name: "outside" });
    outside.focus();
    fireEvent.click(outside);
    const button = screen.getByRole("button", { name: /Language/ });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(outside);
  });

  it("closes when focus tabs out of the menu, without moving focus", () => {
    render(
      <>
        <LanguageMenu label="Language" />
        <a href="#after">after</a>
      </>,
    );
    openMenu();
    const english = screen.getByRole("button", { name: /English/ });
    const after = screen.getByRole("link", { name: "after" });
    english.focus();
    fireEvent.blur(english, {
      relatedTarget: screen.getByRole("button", { name: /Tiếng Việt/ }),
    });
    const button = screen.getByRole("button", { name: /Language/ });
    expect(button.getAttribute("aria-expanded")).toBe("true");
    after.focus();
    fireEvent.blur(english, { relatedTarget: after });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(after);
  });

  it("stays open on a blur with no new focus target", () => {
    render(<LanguageMenu label="Language" />);
    openMenu();
    fireEvent.blur(screen.getByRole("button", { name: /English/ }), {
      relatedTarget: null,
    });
    expect(
      screen
        .getByRole("button", { name: /Language/ })
        .getAttribute("aria-expanded"),
    ).toBe("true");
  });

  it("keeps each box of a checkbox group across a switch", () => {
    const group = () => (
      <form>
        <input type="checkbox" name="products" value="pxp" />
        <input type="checkbox" name="products" value="sxp" />
        <input type="checkbox" name="products" value="iot" />
        <LanguageMenu label="Language" />
      </form>
    );
    const box = (value: string) =>
      document.querySelector(`[value="${value}"]`) as HTMLInputElement;
    const { unmount } = render(group());
    box("pxp").checked = true;
    box("iot").checked = true;
    openMenu();
    fireEvent.click(screen.getByRole("button", { name: /Tiếng Việt/ }));
    unmount();
    pathname = "/vi/demo";
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(group());
    expect([
      box("pxp").checked,
      box("sxp").checked,
      box("iot").checked,
    ]).toEqual([true, false, true]);
    scrollTo.mockRestore();
  });

  it("off a locale path, replaces an unsupported two-letter segment", () => {
    pathname = "/de/products";
    render(<LanguageMenu label="Language" />);
    openMenu();
    const english = screen.getByRole("button", { name: /English/ });
    expect(english.hasAttribute("aria-current")).toBe(false);
    fireEvent.click(english);
    expect(push).toHaveBeenCalledWith("/en/products", { scroll: false });
  });

  it("off a locale path, prefixes the locale without dropping a segment", () => {
    pathname = "/products/x";
    render(<LanguageMenu label="Language" />);
    openMenu();
    fireEvent.click(screen.getByRole("button", { name: /Tiếng Việt/ }));
    expect(push).toHaveBeenCalledWith("/vi/products/x", { scroll: false });
  });

  it("saves scroll and field values, and restores them on the new page", () => {
    const { unmount } = render(
      <form>
        <input name="name" defaultValue="" />
        <textarea id="msg" defaultValue="" />
        <input type="checkbox" name="agree" />
        <input name="skip" type="password" />
        <textarea aria-label="unnamed" defaultValue="" />
        <input type="radio" name="size" value="s" />
        <input type="radio" name="size" value="m" defaultChecked />
        <LanguageMenu label="Language" />
      </form>,
    );
    (document.querySelector('[name="name"]') as HTMLInputElement).value = "Lan";
    (document.querySelector("#msg") as HTMLTextAreaElement).value = "Xin chào";
    (document.querySelector('[name="agree"]') as HTMLInputElement).checked =
      true;
    (document.querySelector('[name="skip"]') as HTMLInputElement).value =
      "secret";
    window.scrollY = 640;
    openMenu();
    fireEvent.click(screen.getByRole("button", { name: /Tiếng Việt/ }));
    expect(sessionStorage.getItem("locale-switch")).not.toContain("secret");
    unmount();

    pathname = "/vi/demo";
    window.scrollY = 0;
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const onInput = vi.fn();
    render(
      <form onInput={onInput}>
        <input name="name" defaultValue="" />
        <textarea id="msg" defaultValue="" />
        <input type="checkbox" name="agree" />
        <input type="radio" name="size" value="s" />
        <input type="radio" name="size" value="m" />
        <LanguageMenu label="Language" />
      </form>,
    );
    expect(
      (document.querySelector('[value="m"]') as HTMLInputElement).checked,
    ).toBe(true);
    expect(
      (document.querySelector('[name="name"]') as HTMLInputElement).value,
    ).toBe("Lan");
    expect((document.querySelector("#msg") as HTMLTextAreaElement).value).toBe(
      "Xin chào",
    );
    expect(
      (document.querySelector('[name="agree"]') as HTMLInputElement).checked,
    ).toBe(true);
    expect(onInput).toHaveBeenCalled();
    expect(scrollTo).toHaveBeenCalledWith({ top: 640, behavior: "instant" });
    expect(sessionStorage.getItem("locale-switch")).toBeNull();
    scrollTo.mockRestore();
    window.scrollY = 0;
  });

  describe("after a switch, on the new page", () => {
    let height = 800;
    beforeEach(() => {
      vi.useFakeTimers();
      height = 800;
      vi.spyOn(
        document.documentElement,
        "scrollHeight",
        "get",
      ).mockImplementation(() => height);
      // Like a browser: the page cannot scroll past its own height.
      vi.spyOn(window, "scrollTo").mockImplementation(((
        options: ScrollToOptions,
      ) => {
        window.scrollY = Math.min(
          options.top ?? 0,
          height - window.innerHeight,
        );
      }) as typeof window.scrollTo);
      sessionStorage.setItem(
        "locale-switch",
        JSON.stringify({ path: "/vi/demo", scrollY: 1141, fields: {} }),
      );
      pathname = "/vi/demo";
    });
    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
      window.scrollY = 0;
    });

    it("waits for the page to grow tall enough, then restores the scroll", () => {
      render(<LanguageMenu label="Language" />);
      act(() => vi.advanceTimersByTime(100));
      height = 4000;
      act(() => vi.advanceTimersByTime(100));
      expect(window.scrollY).toBe(1141);
    });

    it("puts the scroll back when something moves it while the page settles", () => {
      height = 4000;
      render(<LanguageMenu label="Language" />);
      window.scrollY = 719;
      act(() => vi.advanceTimersByTime(100));
      expect(window.scrollY).toBe(1141);
    });

    it("stops restoring once the visitor scrolls", () => {
      height = 4000;
      render(<LanguageMenu label="Language" />);
      fireEvent.wheel(window);
      window.scrollY = 300;
      act(() => vi.advanceTimersByTime(500));
      expect(window.scrollY).toBe(300);
    });

    it("gives up after a while on a page that never grows", () => {
      render(<LanguageMenu label="Language" />);
      act(() => vi.advanceTimersByTime(5000));
      const calls = vi.mocked(window.scrollTo).mock.calls.length;
      act(() => vi.advanceTimersByTime(500));
      expect(vi.mocked(window.scrollTo).mock.calls.length).toBe(calls);
    });

    it("returns focus to the language button", () => {
      render(<LanguageMenu label="Ngôn ngữ" />);
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: /Ngôn ngữ/ }),
      );
    });
  });

  it("does not restore a saved state meant for another page", () => {
    sessionStorage.setItem(
      "locale-switch",
      JSON.stringify({ path: "/vi/about", scrollY: 10, fields: {} }),
    );
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<LanguageMenu label="Language" />);
    expect(scrollTo).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("locale-switch")).toBeNull();
    scrollTo.mockRestore();
  });

  it("switches even when storage is unavailable", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("blocked");
      });
    const getItem = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("blocked");
      });
    render(<LanguageMenu label="Language" />);
    openMenu();
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /Tiếng Việt/ }));
    });
    expect(push).toHaveBeenCalledWith("/vi/demo", { scroll: false });
    setItem.mockRestore();
    getItem.mockRestore();
  });
});
