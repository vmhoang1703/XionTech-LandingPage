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
    // Every title word is its own span (the hero entrance), in the HTML.
    const h1 = /<h1[^>]*>(.*?)<\/h1>/.exec(html)?.[1] ?? "";
    expect(h1.replaceAll(/<[^>]*>/g, "")).toBe(
      "Build smarter. Ship faster. Get IT done.",
    );
    expect(h1.match(/data-hw=""/g)).toHaveLength(5);
    expect(h1).toContain('<span class="hl" data-hw=""');
    expect(html).toContain("Get in touch");
    expect(html).toContain("How we work.");
    // Every value's short line and every Home answer render without a script.
    expect(html).toContain("Agile, resilient and always improving.");
    expect(html).toContain("How do you work across time zones?");
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
