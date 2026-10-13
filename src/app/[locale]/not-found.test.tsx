import { render, screen } from "@testing-library/react";
import type { ResolvingMetadata } from "next";
import { describe, expect, it, vi } from "vitest";

// `cache` only memoizes inside a server render; a plain memo stands in for one render.
vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  cache: <T,>(fn: () => T) => {
    let value: T | undefined;
    return () => (value ??= fn());
  },
}));

const { setRequestLocale } = await import("@/i18n/request-locale");
const { default: NotFound, generateMetadata } = await import("./not-found");

const parent = Promise.resolve({}) as ResolvingMetadata;

describe("locale NotFound", () => {
  it("shows the Not found page in the locale the layout set", () => {
    setRequestLocale("vi");
    render(<NotFound />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "[Placeholder] You’ve wandered off the trail.",
    );
  });

  it("sets the title from the same locale, after the layout metadata", async () => {
    setRequestLocale("vi");
    expect(await generateMetadata({}, parent)).toEqual({
      title: "[Placeholder] Page not found | XionTech",
    });
    setRequestLocale("en");
    expect(await generateMetadata({}, parent)).toEqual({
      title: "Page not found | XionTech",
    });
  });
});
