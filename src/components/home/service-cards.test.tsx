import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { undefinedClasses } from "@/test-utils/css-classes";
import { ServiceCards } from "./service-cards";

describe("ServiceCards", () => {
  it("shows eight service cards linking to their /services anchors", () => {
    render(<ServiceCards />);

    const section = screen.getByRole("region", {
      name: "Eight ways we get IT done for you.",
    });
    expect(
      within(section)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual([
      "/services#product-engineering",
      "/services#ai-analytics",
      "/services#co-creation",
      "/services#staffing",
      "/services#custom-apps",
      "/services#low-code",
      "/services#ai-solutions",
      "/services#cloud",
    ]);
  });

  it("uses the paper section and the prototype section head", () => {
    render(<ServiceCards />);

    const section = screen.getByRole("region", {
      name: "Eight ways we get IT done for you.",
    });
    for (const name of ["sec", "surface-paper"]) {
      expect(section.classList.contains(name)).toBe(true);
    }
    expect(section.querySelector(".sec-head .lede")?.textContent).toBe(
      "The same team that builds PXP, LXP and SXP, working on your product.",
    );
  });

  it("renders glass cards with an icon tile, feature and navy variants", () => {
    render(<ServiceCards />);

    const cards = screen.getAllByRole("link");
    expect(cards[0].parentElement?.classList.contains("svc-grid")).toBe(true);
    for (const card of cards) {
      expect(card.classList.contains("spot")).toBe(true);
      expect(card.classList.contains("svc")).toBe(true);
      expect(card.querySelector(".ic svg")?.getAttribute("aria-hidden")).toBe(
        "true",
      );
    }
    const has = (name: string, cls: string) =>
      screen
        .getByRole("link", { name: new RegExp(name) })
        .classList.contains(cls);
    expect(has("Product Engineering", "feature")).toBe(true);
    expect(has("Cloud Computing", "feature")).toBe(true);
    expect(has("AI-Powered Solutions", "navy")).toBe(true);
    expect(
      cards.filter(
        (card) =>
          card.classList.contains("feature") || card.classList.contains("navy"),
      ),
    ).toHaveLength(3);
  });

  it("uses only classes that globals.css defines", () => {
    const { container } = render(<ServiceCards />);

    expect(undefinedClasses(container)).toEqual([]);
  });
});
