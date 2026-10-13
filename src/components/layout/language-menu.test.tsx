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
    render(<LanguageMenu />);
    openMenu();
    fireEvent.click(screen.getByRole("button", { name: /Tiếng Việt/ }));
    expect(push).toHaveBeenCalledWith("/vi/demo", { scroll: false });
    expect(document.cookie).toContain("locale=vi");
  });

  it("keeps the query and hash when switching", () => {
    window.history.replaceState(null, "", "/en/demo?a=1#form");
    render(<LanguageMenu />);
    openMenu();
    fireEvent.click(screen.getByRole("button", { name: /Tiếng Việt/ }));
    expect(push).toHaveBeenCalledWith("/vi/demo?a=1#form", { scroll: false });
    window.history.replaceState(null, "", "/");
  });

  it("marks the current locale and shows its code on the button", () => {
    render(<LanguageMenu />);
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

  it("uses the Vietnamese label on a vi page", () => {
    pathname = "/vi";
    render(<LanguageMenu />);
    expect(
      screen.getByRole("button", { name: /Ngôn ngữ/ }).textContent,
    ).toContain("VI");
  });

  it("choosing the current locale only closes the menu", () => {
    render(<LanguageMenu />);
    openMenu();
    fireEvent.click(screen.getByRole("button", { name: /English/ }));
    expect(push).not.toHaveBeenCalled();
    const button = screen.getByRole("button", { name: /Language/ });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
  });

  it("closes on Escape and returns focus to the button", () => {
    render(<LanguageMenu />);
    openMenu();
    fireEvent.keyDown(document, { key: "Escape" });
    const button = screen.getByRole("button", { name: /Language/ });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
  });

  it("ignores other keys and Escape while closed", () => {
    render(<LanguageMenu />);
    fireEvent.keyDown(document, { key: "Escape" });
    openMenu();
    fireEvent.keyDown(document, { key: "a" });
    const button = screen.getByRole("button", { name: /Language/ });
    expect(button.getAttribute("aria-expanded")).toBe("true");
  });

  it("closes on an outside click and returns focus to the button", () => {
    render(<LanguageMenu />);
    openMenu();
    fireEvent.click(document.body);
    const button = screen.getByRole("button", { name: /Language/ });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
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
        <LanguageMenu />
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
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const onInput = vi.fn();
    render(
      <form onInput={onInput}>
        <input name="name" defaultValue="" />
        <textarea id="msg" defaultValue="" />
        <input type="checkbox" name="agree" />
        <input type="radio" name="size" value="s" />
        <input type="radio" name="size" value="m" />
        <LanguageMenu />
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
    expect(scrollTo).toHaveBeenCalledWith(0, 640);
    expect(sessionStorage.getItem("locale-switch")).toBeNull();
    scrollTo.mockRestore();
    window.scrollY = 0;
  });

  it("does not restore a saved state meant for another page", () => {
    sessionStorage.setItem(
      "locale-switch",
      JSON.stringify({ path: "/vi/about", scrollY: 10, fields: {} }),
    );
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<LanguageMenu />);
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
    render(<LanguageMenu />);
    openMenu();
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /Tiếng Việt/ }));
    });
    expect(push).toHaveBeenCalledWith("/vi/demo", { scroll: false });
    setItem.mockRestore();
    getItem.mockRestore();
  });
});
