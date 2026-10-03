import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeHero } from "./home-hero";

function renderHero() {
  render(<HomeHero />);
  return screen.getByRole("region", {
    name: "Every school community, connected.",
  });
}

describe("HomeHero", () => {
  it("shows the label, the H1 with a highlighted 'connected' and the sub line", () => {
    const hero = renderHero();

    expect(hero.className).toContain("hero-silk");
    expect(
      within(hero)
        .getByText("EdTech products · Software services")
        .classList.contains("label"),
    ).toBe(true);
    expect(
      within(hero).getByText("EdTech products · Software services"),
    ).toBeDefined();
    const h1 = within(hero).getByRole("heading", { level: 1 });
    expect(h1.classList.contains("text-display-hero-fluid")).toBe(true);
    expect(h1.textContent).toBe("Every school community, connected.");
    expect(within(h1).getByText("connected").classList.contains("hl")).toBe(
      true,
    );
    expect(
      within(hero).getByText(
        "PXP for parents, LXP for learners, SXP for staff. And the engineering team behind them, ready to build yours.",
      ),
    ).toBeDefined();
  });

  it("has exactly one CTA, Explore our products, linking to /products", () => {
    const hero = renderHero();

    const links = within(hero).getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0].textContent).toBe("Explore our products");
    expect(links[0].getAttribute("href")).toBe("/products");
    expect(links[0].className).toContain("btn btn-primary");
    expect(links[0].querySelector("svg")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(within(hero).queryAllByRole("button")).toHaveLength(0);
  });

  it("renders empty tablet and phone frames and never an image", () => {
    const hero = renderHero();

    expect(
      hero.querySelector(".home-device-tablet .home-media"),
    ).not.toBeNull();
    expect(hero.querySelector(".home-device-phone .home-media")).not.toBeNull();
    expect(hero.querySelector(".home-device-phone .home-notch")).not.toBeNull();

    expect(within(hero).queryAllByRole("img")).toHaveLength(0);
    expect(hero.querySelector("img")).toBeNull();
    expect(
      within(hero).getByText("[Placeholder] Web app screenshot"),
    ).toBeDefined();
    expect(
      within(hero).getByText("[Placeholder] Phone screenshot"),
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
});
