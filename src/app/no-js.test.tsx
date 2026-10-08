import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// next/font/google only works inside the Next.js compiler; stub the loaders.
vi.mock("next/font/google", () => ({
  Unbounded: () => ({ variable: "font-unbounded" }),
  Lexend_Exa: () => ({ variable: "font-lexend-exa" }),
  Be_Vietnam_Pro: () => ({ variable: "font-be-vietnam-pro" }),
  JetBrains_Mono: () => ({ variable: "font-jetbrains-mono" }),
}));

// An async Server Component cannot render to static markup here (Story 3.7).
vi.mock("@/components/news/home-news", () => ({
  HomeNews: () => <section>Latest from XionTech.</section>,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

const { default: RootLayout } = await import("./layout");
const { default: Home } = await import("./page");
const { siteFooter } = await import("@/content/site-footer");

describe("no JavaScript", () => {
  it("server-renders all page content with no client script", () => {
    const html = renderToStaticMarkup(
      RootLayout({ children: <Home /> } as LayoutProps<"/">),
    );

    expect(html).toMatch(/^<html lang="en"/);
    expect(html).toMatch(
      /<h1[^>]*>School apps and software teams that <span class="hl">get IT done<\/span>\.<\/h1>/,
    );
    expect(html).toContain("Get in touch");
    expect(html).toContain("How we approach.");
    expect(html).toContain("Have something you want to build?");
    expect(html.indexOf("Latest from XionTech.")).toBeGreaterThan(-1);
    expect(html.indexOf("Latest from XionTech.")).toBeLessThan(
      html.indexOf("Have something you want to build?"),
    );
    expect(html).toContain("<header");
    expect(html).toContain('<main id="main" tabindex="-1"');
    expect(html).toMatch(/<\/main><footer/);
    expect(html).toContain(siteFooter.copyright);
    expect(html).not.toContain("<script");
  });
});
