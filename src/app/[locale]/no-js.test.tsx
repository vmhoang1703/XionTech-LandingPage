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
  HomeNews: () => <section>Latest from XionTech</section>,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

const { default: RootLayout } = await import("./layout");
const { default: Home } = await import("./page");
const { siteFooter } = await import("@/content/site-footer");

describe("no JavaScript", () => {
  it("server-renders all page content with no client script", async () => {
    const html = renderToStaticMarkup(
      await RootLayout({
        children: await Home({ params: Promise.resolve({ locale: "en" }) }),
        params: Promise.resolve({ locale: "en" }),
      } as LayoutProps<"/[locale]">),
    );

    expect(html).toMatch(/^<html lang="en"/);
    expect(html).toMatch(
      // Round 11: each beat is a block with its load-in order (style).
      /<h1[^>]*><span class="block"[^>]*>Build smarter\.<\/span> <span class="block"[^>]*>Ship faster\.<\/span> <span class="block"[^>]*><span class="hl">Get IT done<\/span><\/span><\/h1>/,
    );
    expect(html).toContain("Get in touch");
    expect(html).toContain("How we work");
    // Every value's short line and every Home answer render without a script.
    expect(html).toContain(
      "Stay flexible, respond to change, and keep moving toward what matters.",
    );
    expect(html).toContain("How do you work across time zones?");
    expect(html).toContain("Have something you want to build?");
    expect(html.indexOf("Latest from XionTech")).toBeGreaterThan(-1);
    expect(html.indexOf("Latest from XionTech")).toBeLessThan(
      html.indexOf("Have something you want to build?"),
    );
    expect(html).toContain("<header");
    expect(html).toContain('<main id="main" tabindex="-1"');
    expect(html).toMatch(/<\/main><footer/);
    expect(html).toContain(siteFooter.copyright);
    expect(html).not.toContain("<script");
  });
});
