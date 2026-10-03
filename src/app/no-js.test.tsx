import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// next/font/google only works inside the Next.js compiler; stub the loaders.
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

const { default: RootLayout } = await import("./layout");
const { default: Home } = await import("./page");

describe("no JavaScript", () => {
  it("server-renders all page content with no client script", () => {
    const html = renderToStaticMarkup(
      RootLayout({ children: <Home /> } as LayoutProps<"/">),
    );

    expect(html).toMatch(/^<html lang="en"/);
    expect(html).toMatch(/<h1[^>]*>XionTech<\/h1>/);
    expect(html).toContain("[Placeholder] New website under construction.");
    expect(html).toContain("See it working at your school.");
    expect(html).toContain("<header");
    expect(html).toContain('<main id="main" tabindex="-1"');
    expect(html).not.toContain("<script");
  });
});
