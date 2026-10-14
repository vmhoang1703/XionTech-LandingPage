import { describe, expect, it, vi } from "vitest";

// `cache` only memoizes inside a server render; a plain memo stands in for one render.
vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  cache: <T>(fn: () => T) => {
    let value: T | undefined;
    return () => (value ??= fn());
  },
}));

const { getRequestLocale, setRequestLocale } = await import("./request-locale");

describe("request locale", () => {
  it("falls back to English until a layout sets it, then returns the set locale", () => {
    expect(getRequestLocale()).toBe("en");
    setRequestLocale("vi");
    expect(getRequestLocale()).toBe("vi");
  });
});
