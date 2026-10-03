import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";

// next/font/google only works inside the Next.js compiler; stub the loaders.
vi.mock("next/font/google", () => ({
  Unbounded: () => ({ variable: "font-unbounded" }),
  Lexend_Exa: () => ({ variable: "font-lexend-exa" }),
  Be_Vietnam_Pro: () => ({ variable: "font-be-vietnam-pro" }),
  JetBrains_Mono: () => ({ variable: "font-jetbrains-mono" }),
}));

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const { default: RootLayout, metadata } = await import("./layout");
const { siteFooter } = await import("@/content/site-footer");

describe("RootLayout", () => {
  it("renders an English html root with all four brand font variables", () => {
    const html = RootLayout({
      children: <p>child</p>,
    } as LayoutProps<"/">) as ReactElement<{
      lang: string;
      className: string;
    }>;

    expect(html.props.lang).toBe("en");
    expect(html.props.className).toContain("font-unbounded");
    expect(html.props.className).toContain("font-lexend-exa");
    expect(html.props.className).toContain("font-be-vietnam-pro");
    expect(html.props.className).toContain("font-jetbrains-mono");
  });

  it("renders the header before a focusable main#main that wraps the page", () => {
    const html = RootLayout({
      children: <p>child</p>,
    } as LayoutProps<"/">) as ReactElement<{
      children: ReactElement<{ children: ReactElement[] }>;
    }>;
    const { container } = render(html.props.children.props.children);

    const header = container.querySelector("header");
    const main = container.querySelector("main#main");
    expect(header).not.toBeNull();
    expect(main).not.toBeNull();
    expect(main?.getAttribute("tabindex")).toBe("-1");
    expect(main?.textContent).toBe("child");
    expect(
      header!.compareDocumentPosition(main!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(container.querySelectorAll("main")).toHaveLength(1);
  });

  it("renders the site footer after main#main, outside it", () => {
    const html = RootLayout({
      children: <p>child</p>,
    } as LayoutProps<"/">) as ReactElement<{
      children: ReactElement<{ children: ReactElement[] }>;
    }>;
    const { container } = render(html.props.children.props.children);

    const main = container.querySelector("main#main");
    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();
    expect(footer?.textContent).toContain(siteFooter.copyright);
    expect(main?.contains(footer!)).toBe(false);
    expect(
      main!.compareDocumentPosition(footer!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(container.querySelectorAll("footer")).toHaveLength(1);
  });

  it("sets the site title and description", () => {
    expect(metadata.title).toBe("XionTech");
    expect(metadata.description).toMatch(/IT services/);
  });
});
