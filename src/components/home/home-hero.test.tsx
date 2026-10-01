import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeHero } from "./home-hero";

// jsdom has no WebGL; the silk falls back to the static glow.
vi.mock("@/components/home/silk-shader", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/components/home/silk-shader")>()),
  createSilk: () => null,
}));

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
      within(hero).getByText("EdTech products · Software services"),
    ).toBeDefined();
    const h1 = within(hero).getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("Every school community, connected.");
    expect(within(h1).getByText("connected").tagName).toBe("MARK");
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
    expect(links[0].className).toContain("button-primary");
    expect(within(hero).queryAllByRole("button")).toHaveLength(0);
  });

  it("renders empty tablet and phone frames and never an image", () => {
    const hero = renderHero();

    expect(within(hero).queryAllByRole("img")).toHaveLength(0);
    expect(hero.querySelector("img")).toBeNull();
    expect(
      within(hero).getByText("[Placeholder] Web app screenshot"),
    ).toBeDefined();
    expect(
      within(hero).getByText("[Placeholder] Phone screenshot"),
    ).toBeDefined();
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
      "2Offices: Ho Chi Minh City and Plano",
    ]);
  });
});
