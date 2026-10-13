import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Unbounded: () => ({ variable: "font-unbounded" }),
  Lexend_Exa: () => ({ variable: "font-lexend-exa" }),
  Be_Vietnam_Pro: () => ({ variable: "font-be-vietnam-pro" }),
  JetBrains_Mono: () => ({ variable: "font-jetbrains-mono" }),
}));

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const { default: GlobalNotFound, metadata } =
  await import("./global-not-found");

describe("GlobalNotFound", () => {
  it("renders its own html root with the brand fonts and the 404 page", () => {
    const html = GlobalNotFound() as ReactElement<{
      lang: string;
      className: string;
      children: ReactElement<{ children: ReactElement[] }>;
    }>;

    expect(html.props.lang).toBe("en");
    expect(html.props.className).toContain("font-be-vietnam-pro");
    render(html.props.children.props.children);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "You’ve wandered off the trail.",
    );
    expect(metadata.robots).toEqual({ index: false });
  });
});
