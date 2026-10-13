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

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

// The scroll reveal and the pointer glow read matchMedia, which jsdom lacks;
// they have their own tests.
vi.mock("@/components/sections/scroll-reveal", () => ({
  ScrollReveal: () => null,
}));
vi.mock("@/components/sections/pointer-glow", () => ({
  PointerGlow: () => null,
}));

const {
  default: RootLayout,
  generateMetadata,
  generateStaticParams,
} = await import("./layout");
const { siteFooter } = await import("@/content/site-footer");

function params(locale: string) {
  return { params: Promise.resolve({ locale }) };
}

describe("RootLayout", () => {
  it("renders a Vietnamese html root on vi", async () => {
    const html = (await RootLayout({
      children: <p>child</p>,
      ...params("vi"),
    } as LayoutProps<"/[locale]">)) as ReactElement<{ lang: string }>;

    expect(html.props.lang).toBe("vi");
  });

  it("renders an English html root with all four brand font variables", async () => {
    const html = (await RootLayout({
      children: <p>child</p>,
      ...params("en"),
    } as LayoutProps<"/[locale]">)) as ReactElement<{
      lang: string;
      className: string;
    }>;

    expect(html.props.lang).toBe("en");
    expect(html.props.className).toContain("font-unbounded");
    expect(html.props.className).toContain("font-lexend-exa");
    expect(html.props.className).toContain("font-be-vietnam-pro");
    expect(html.props.className).toContain("font-jetbrains-mono");
  });

  it("asks Next.js to keep route changes instant despite smooth scroll", async () => {
    const html = (await RootLayout({
      children: <p>child</p>,
      ...params("en"),
    } as LayoutProps<"/[locale]">)) as ReactElement<{
      "data-scroll-behavior": string;
    }>;

    expect(html.props["data-scroll-behavior"]).toBe("smooth");
  });

  it("renders the header before a focusable main#main that wraps the page", async () => {
    const html = (await RootLayout({
      children: <p>child</p>,
      ...params("en"),
    } as LayoutProps<"/[locale]">)) as ReactElement<{
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

  it("renders the site footer after main#main, outside it", async () => {
    const html = (await RootLayout({
      children: <p>child</p>,
      ...params("en"),
    } as LayoutProps<"/[locale]">)) as ReactElement<{
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

  it("sets the site title and description per locale", async () => {
    const en = await generateMetadata(params("en") as LayoutProps<"/[locale]">);
    const vi = await generateMetadata(params("vi") as LayoutProps<"/[locale]">);
    expect(en.title).toBe("XionTech");
    expect(en.description).toMatch(/^IT services/);
    expect(vi.title).toBe("XionTech");
    expect(vi.description).toMatch(/^\[Placeholder\] IT services/);
  });

  it("prerenders en and vi only and 404s any other locale", async () => {
    expect(generateStaticParams()).toEqual([
      { locale: "en" },
      { locale: "vi" },
    ]);
    await expect(
      RootLayout({
        children: <p>child</p>,
        ...params("fr"),
      } as LayoutProps<"/[locale]">),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
