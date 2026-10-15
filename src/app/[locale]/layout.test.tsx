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

// The registered dictionaries, minus zh, so the fallback test below holds
// whichever locales are filled.
vi.mock("@/i18n/dictionaries", async (importOriginal) => {
  const { DICTIONARIES } =
    await importOriginal<typeof import("@/i18n/dictionaries")>();
  return { DICTIONARIES: { ...DICTIONARIES, zh: undefined } };
});

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
const { LocaleLink, useLocalized } =
  await import("@/components/layout/locale-link");
const { homeHero, homeHeroVi } = await import("@/content/home");
const { DICTIONARIES } = await import("@/i18n/dictionaries");

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

  it("renders a Simplified Chinese html root on zh", async () => {
    const html = (await RootLayout({
      children: <p>child</p>,
      ...params("zh"),
    } as LayoutProps<"/[locale]">)) as ReactElement<{ lang: string }>;

    expect(html.props.lang).toBe("zh-Hans");
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

  it("gives client links below it the vi locale", async () => {
    const html = (await RootLayout({
      children: <LocaleLink href="/products">products</LocaleLink>,
      ...params("vi"),
    } as LayoutProps<"/[locale]">)) as ReactElement<{
      children: ReactElement<{ children: ReactElement[] }>;
    }>;
    const { getByRole } = render(html.props.children.props.children);
    expect(getByRole("link", { name: "products" }).getAttribute("href")).toBe(
      "/vi/products",
    );
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
    expect(footer?.textContent).toContain(
      "Copyright © 2026 XionTech Joint Stock Company. All Rights Reserved.",
    );
    expect(main?.contains(footer!)).toBe(false);
    expect(
      main!.compareDocumentPosition(footer!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(container.querySelectorAll("footer")).toHaveLength(1);
  });

  async function renderMain(locale: string) {
    const html = (await RootLayout({
      children: <p>child</p>,
      ...params(locale),
    } as LayoutProps<"/[locale]">)) as ReactElement<{
      children: ReactElement<{ children: ReactElement[] }>;
    }>;
    const { container } = render(html.props.children.props.children);
    return container.querySelector("main#main");
  }

  it.each(["en", "vi"])(
    "leaves main without a lang attribute on %s",
    async (locale) => {
      expect((await renderMain(locale))?.hasAttribute("lang")).toBe(false);
    },
  );

  async function fontLinks(locale: string) {
    document.head.innerHTML = "";
    await renderMain(locale);
    return [...document.head.querySelectorAll("link")].map((link) => [
      link.rel,
      link.getAttribute("href"),
    ]);
  }

  it.each([
    ["ja", "Noto+Sans+JP"],
    ["ko", "Noto+Sans+KR"],
    ["zh", "Noto+Sans+SC"],
  ])("loads only its Noto Sans stylesheet on %s", async (locale, family) => {
    const links = await fontLinks(locale);
    const sheets = links.filter(([rel]) => rel === "stylesheet");
    expect(sheets).toEqual([
      [
        "stylesheet",
        `https://fonts.googleapis.com/css2?family=${family}:wght@300;400;500;600&display=swap`,
      ],
    ]);
    expect(
      links.filter(([rel]) => rel === "preconnect").map(([, href]) => href),
    ).toEqual(["https://fonts.googleapis.com", "https://fonts.gstatic.com"]);
  });

  it.each(["en", "vi", "fr"])("loads no CJK font on %s", async (locale) => {
    expect(await fontLinks(locale)).toEqual([]);
  });

  it("sets the site title and description per locale", async () => {
    const en = await generateMetadata(params("en") as LayoutProps<"/[locale]">);
    const vi = await generateMetadata(params("vi") as LayoutProps<"/[locale]">);
    expect(en.title).toBe("XionTech");
    expect(en.description).toMatch(/^IT services/);
    expect(vi.title).toBe("XionTech");
    expect(vi.description).toBe(
      "Dịch vụ CNTT và phát triển sản phẩm: AI, cloud, ứng dụng tùy chỉnh và giải pháp low-code.",
    );
  });

  it("uses the Japanese site meta on ja", async () => {
    const ja = await generateMetadata(params("ja") as LayoutProps<"/[locale]">);
    expect(ja.description).toMatch(/^IT サービス/);
  });

  it("falls back to the English site meta for a locale with no dictionary", async () => {
    const zh = await generateMetadata(params("zh") as LayoutProps<"/[locale]">);
    expect(zh.description).toMatch(/^IT services/);
  });

  it("prerenders the six locales only and 404s any other locale", async () => {
    expect(generateStaticParams()).toEqual(
      ["en", "vi", "ja", "fr", "ko", "zh"].map((locale) => ({ locale })),
    );
    await expect(
      RootLayout({
        children: <p>child</p>,
        ...params("de"),
      } as LayoutProps<"/[locale]">),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("RootLayout client strings", () => {
  function HeroProbe() {
    const hero = useLocalized("homeHero", { en: homeHero, vi: homeHeroVi });
    return <output>{JSON.stringify(hero)}</output>;
  }

  it.each(["ja", "ko"] as const)(
    "sends the %s client dictionaries to client islands below it",
    async (locale) => {
      const html = (await RootLayout({
        children: <HeroProbe />,
        ...params(locale),
      } as LayoutProps<"/[locale]">)) as ReactElement<{
        children: ReactElement<{ children: ReactElement[] }>;
      }>;
      const { container } = render(html.props.children.props.children);
      const expected = DICTIONARIES[locale]?.homeHero;
      expect(expected).toBeDefined();
      expect(container.querySelector("output")?.textContent).toBe(
        JSON.stringify(expected),
      );
    },
  );
});
