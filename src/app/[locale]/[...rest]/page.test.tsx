import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

const { default: CatchAll } = await import("./page");

describe("catch-all page", () => {
  it("answers 404 so an unknown path under a locale gets the locale Not found page", () => {
    expect(() => CatchAll()).toThrow("NEXT_NOT_FOUND");
  });
});
