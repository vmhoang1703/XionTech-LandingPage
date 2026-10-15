import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Unbounded: () => ({ variable: "font-unbounded" }),
  Lexend_Exa: () => ({ variable: "font-lexend-exa" }),
  Be_Vietnam_Pro: () => ({ variable: "font-be-vietnam-pro" }),
  JetBrains_Mono: () => ({ variable: "font-jetbrains-mono" }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

const { default: GlobalNotFound, metadata } =
  await import("./global-not-found");
const { THEME_SCRIPT } = await import("@/lib/theme/theme-preference");

describe("GlobalNotFound", () => {
  it("renders its own html root with the brand fonts and the 404 page", () => {
    const html = GlobalNotFound() as ReactElement<{
      lang: string;
      className: string;
      suppressHydrationWarning: boolean;
      children: [
        ReactElement<{
          children: ReactElement<{ dangerouslySetInnerHTML: object }>;
        }>,
        ReactElement<{ children: ReactElement[] }>,
      ];
    }>;

    expect(html.props.lang).toBe("en");
    expect(html.props.className).toContain("font-be-vietnam-pro");
    const [head, body] = html.props.children;
    expect(head.type).toBe("head");
    expect(head.props.children.type).toBe("script");
    expect(head.props.children.props.dangerouslySetInnerHTML).toEqual({
      __html: THEME_SCRIPT,
    });
    expect(html.props.suppressHydrationWarning).toBe(true);
    render(body.props.children);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Page not found",
    );
    expect(metadata.title).toBe("Page not found | XionTech");
    expect(metadata.robots).toEqual({ index: false });
  });
});
