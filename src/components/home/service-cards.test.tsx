import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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

  it("lays the cards out in 1, 2 and 4 columns", () => {
    render(<ServiceCards />);

    const grid = screen.getAllByRole("link")[0].parentElement;
    expect(grid?.className).toContain("grid-cols-1");
    expect(grid?.className).toContain("sm:grid-cols-2");
    expect(grid?.className).toContain("lg:grid-cols-4");
  });
});
