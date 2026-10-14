import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { globalsCss } from "@/test-utils/css-classes";
import { HomeHero } from "./home-hero";

// jsdom has no WebGL; the silk falls back to the static glow.
vi.mock("@/components/home/silk-shader", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/components/home/silk-shader")>()),
  createSilk: () => null,
}));

// jsdom has no matchMedia; the count is tested in count-up.test.tsx.
vi.mock("@/components/sections/count-up", () => ({
  CountUp: ({ value }: { value: string }) => <>{value}</>,
}));

function renderHero() {
  render(<HomeHero />);
  return screen.getByRole("region", {
    name: "Build smarter. Ship faster. Get IT done.",
  });
}

describe("HomeHero", () => {
  it("shows the H1, one beat a line, with a highlighted 'Get IT done', the sub line and no label", () => {
    const hero = renderHero();

    expect(hero.className).toContain("hero-silk");
    const h1 = within(hero).getByRole("heading", { level: 1 });
    expect(h1.parentElement?.querySelector(".label")).toBeNull();
    expect(h1.classList.contains("text-display-hero-fluid")).toBe(true);
    expect(h1.textContent).toBe("Build smarter. Ship faster. Get IT done.");
    expect(within(h1).getByText("Get IT done").classList.contains("hl")).toBe(
      true,
    );
    const beats = [...h1.querySelectorAll(".block")].map(
      (el) => el.textContent,
    );
    expect(beats).toEqual(["Build smarter.", "Ship faster."]);
    expect(
      within(hero).getByText(
        "Connected school and campus solutions, software products and dedicated teams, from people who lead the way in AI-assisted development.",
      ),
    ).toBeDefined();
  });

  it("has one Get in touch button linking to the contact section", () => {
    const hero = renderHero();

    const cta = within(hero).getByRole("link", { name: "Get in touch" });
    expect(cta.getAttribute("href")).toBe("#contact");
    expect(cta.className).toContain("btn btn-primary");
    expect(cta.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(within(hero).queryAllByRole("button")).toHaveLength(0);
  });

  it("has no device frames, no placeholder screens and no image", () => {
    const hero = renderHero();

    expect(hero.querySelector(".home-devices")).toBeNull();
    expect(hero.querySelector(".home-device-tablet")).toBeNull();
    expect(hero.querySelector(".home-device-phone")).toBeNull();
    expect(hero.querySelector(".home-media")).toBeNull();
    expect(hero.querySelector("img")).toBeNull();
    expect(within(hero).queryByText(/\[Placeholder\]/)).toBeNull();
  });

  it("holds the two front doors inside the hero, after the figures", () => {
    const hero = renderHero();

    const doors = within(hero).getByRole("region", { name: "What we do" });
    expect(doors.parentElement?.closest("section")).toBe(hero);
    const band = within(hero).getByRole("group", {
      name: "Experience you can count on",
    });
    expect(
      band.compareDocumentPosition(doors) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("ends with the five confirmed figures", () => {
    const hero = renderHero();

    const band = within(hero).getByRole("group", {
      name: "Experience you can count on",
    });
    expect(
      within(band)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual([
      "25+Years of leadership experience in software",
      "24/7Global coverage across time zones",
      "20+Technology stacks we work in",
      "8Service offerings, from idea to operation",
      "4Locations: HQs in Plano and Ho Chi Minh City",
    ]);
  });

  it("shows the Vietnamese heading, sub line and button on vi", () => {
    render(<HomeHero locale="vi" />);

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe(
      "Xây dựng thông minh hơn. Phát hành nhanh hơn. Get IT done.",
    );
    expect(
      screen.getByRole("link", { name: "Liên hệ với chúng tôi" }),
    ).toBeDefined();
    expect(
      screen.getByRole("group", { name: "Kinh nghiệm bạn có thể tin cậy" }),
    ).toBeDefined();
    expect(
      screen.getByRole("region", { name: "Chúng tôi làm gì" }),
    ).toBeDefined();
  });

  it("paints the static glow layer behind the content", () => {
    const hero = renderHero();

    // The glow sits at z-index -2; it stays inside the hero only while the
    // section is its own stacking context.
    expect(hero.classList.contains("relative")).toBe(true);
    expect(hero.classList.contains("isolate")).toBe(true);
    const glow = hero.querySelector(".silk-fallback");
    expect(glow?.getAttribute("aria-hidden")).toBe("true");
    expect(hero.firstElementChild).toBe(glow);
  });

  it("gives the light Products door the light-surface colours inside the navy hero", () => {
    const rule = /\.home-hero \.door-products\s*\{([^}]*)\}/.exec(
      globalsCss(),
    )?.[1];

    expect(rule).toMatch(/--color-heading:\s*var\(--color-navy\)/);
    expect(rule).toMatch(/--color-text:\s*var\(--paper-text\)/);
    expect(rule).toMatch(/--color-muted:\s*var\(--paper-muted\)/);
    expect(rule).toMatch(/--color-border:\s*var\(--paper-border\)/);
  });
});
