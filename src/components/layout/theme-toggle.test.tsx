import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_KEY } from "@/lib/theme/theme-preference";
import { ThemeToggle } from "./theme-toggle";

let osDark = false;
let listeners: (() => void)[] = [];
const osChanges = (dark: boolean) => {
  osDark = dark;
  for (const listener of listeners) listener();
};

beforeEach(() => {
  osDark = false;
  listeners = [];
  localStorage.clear();
  document.documentElement.dataset.theme = "light";
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      get matches() {
        return osDark;
      },
      addEventListener: (_type: string, listener: () => void) => {
        listeners.push(listener);
      },
      removeEventListener: (_type: string, listener: () => void) => {
        listeners = listeners.filter((l) => l !== listener);
      },
    })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.themeChosen;
});

const button = () => screen.getByRole("button", { name: "Dark mode" });
// The toggle hears data-theme changes through a MutationObserver, which reports
// after the current task: wait for it.
const settle = () => act(async () => {});

describe("ThemeToggle", () => {
  it("reads the theme the head script set and flips it on click", async () => {
    document.documentElement.dataset.theme = "dark";
    render(<ThemeToggle label="Dark mode" variant="header" />);
    expect(button().getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(button());
    await settle();
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_KEY)).toBe("light");
    expect(button().getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(button());
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  });

  it("names the round header button by aria-label and shows the label in the menu", () => {
    const { unmount } = render(
      <ThemeToggle label="Dark mode" variant="header" />,
    );
    expect(button().className).toBe("theme-toggle");
    expect(button().textContent).toBe("");
    unmount();
    render(<ThemeToggle label="Dark mode" variant="menu" />);
    expect(button().className).toBe("theme-toggle-row");
    expect(button().textContent).toBe("Dark mode");
  });

  it("follows a colour-scheme change while nothing is saved", async () => {
    render(<ThemeToggle label="Dark mode" variant="header" />);
    act(() => osChanges(true));
    await settle();
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(button().getAttribute("aria-pressed")).toBe("true");
  });

  it("treats an invalid saved value as no choice and follows the setting", async () => {
    localStorage.setItem(THEME_KEY, "sepia");
    render(<ThemeToggle label="Dark mode" variant="header" />);
    act(() => osChanges(true));
    await settle();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("keeps a click made this visit when storage is blocked and the setting changes", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<ThemeToggle label="Dark mode" variant="header" />);
    fireEvent.click(button());
    expect(document.documentElement.dataset.theme).toBe("dark");
    act(() => osChanges(false));
    expect(document.documentElement.dataset.theme).toBe("dark");
    vi.restoreAllMocks();
  });

  it("renders both icons, so CSS can show the right one before hydration", () => {
    render(<ThemeToggle label="Dark mode" variant="header" />);
    expect(button().querySelector(".tt-moon")).not.toBeNull();
    expect(button().querySelector(".tt-sun")).not.toBeNull();
  });

  it("keeps a saved choice when the colour scheme changes", () => {
    localStorage.setItem(THEME_KEY, "light");
    render(<ThemeToggle label="Dark mode" variant="header" />);
    act(() => osChanges(true));
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("follows the colour scheme when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<ThemeToggle label="Dark mode" variant="header" />);
    act(() => osChanges(true));
    expect(document.documentElement.dataset.theme).toBe("dark");
    vi.restoreAllMocks();
  });

  it("sets the theme itself when the head script did not run (a 404)", () => {
    delete document.documentElement.dataset.theme;
    localStorage.setItem(THEME_KEY, "dark");
    render(<ThemeToggle label="Dark mode" variant="header" />);
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("stops listening on unmount, and works with no matchMedia", () => {
    const { unmount } = render(
      <ThemeToggle label="Dark mode" variant="header" />,
    );
    expect(listeners).toHaveLength(1);
    unmount();
    expect(listeners).toHaveLength(0);
    vi.stubGlobal("matchMedia", undefined);
    render(<ThemeToggle label="Dark mode" variant="header" />);
    fireEvent.click(button());
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
