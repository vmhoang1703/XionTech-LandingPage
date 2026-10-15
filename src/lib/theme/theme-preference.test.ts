import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  THEME_KEY,
  THEME_SCRIPT,
  readTheme,
  saveTheme,
} from "./theme-preference";

let osDark = false;

beforeEach(() => {
  osDark = false;
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query === "(prefers-color-scheme: dark)" && osDark,
    })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function blockStorage() {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
}

function runScript() {
  new Function(THEME_SCRIPT)();
  return document.documentElement.getAttribute("data-theme");
}

describe("readTheme", () => {
  it("reads a stored light as light, even when the OS is dark", () => {
    osDark = true;
    localStorage.setItem(THEME_KEY, "light");

    expect(readTheme()).toBe("light");
  });

  it("reads a stored dark as dark, even when the OS is light", () => {
    localStorage.setItem(THEME_KEY, "dark");

    expect(readTheme()).toBe("dark");
  });

  it("follows the OS when nothing is stored", () => {
    expect(readTheme()).toBe("light");

    osDark = true;
    expect(readTheme()).toBe("dark");
  });

  it("follows the OS when the stored value is not dark or light", () => {
    osDark = true;
    localStorage.setItem(THEME_KEY, "sepia");

    expect(readTheme()).toBe("dark");
  });

  it("falls back to the OS when storage throws", () => {
    blockStorage();
    osDark = true;

    expect(readTheme()).toBe("dark");
  });
});

describe("saveTheme", () => {
  it("stores the chosen theme", () => {
    saveTheme("dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");

    saveTheme("light");
    expect(localStorage.getItem(THEME_KEY)).toBe("light");
  });

  it("does not throw when storage is blocked", () => {
    blockStorage();

    expect(() => saveTheme("dark")).not.toThrow();
  });
});

describe("THEME_SCRIPT", () => {
  it("sets data-theme from the saved choice, which beats the OS", () => {
    osDark = true;
    localStorage.setItem(THEME_KEY, "light");

    expect(runScript()).toBe("light");
  });

  it("sets data-theme from the OS when nothing is saved", () => {
    osDark = true;

    expect(runScript()).toBe("dark");
  });

  it("sets data-theme from the OS when storage is blocked", () => {
    blockStorage();
    osDark = true;

    expect(runScript()).toBe("dark");
  });

  it("gives the same answer as readTheme", () => {
    localStorage.setItem(THEME_KEY, "dark");
    expect(runScript()).toBe(readTheme());

    localStorage.setItem(THEME_KEY, "sepia");
    expect(runScript()).toBe(readTheme());
  });
});
