import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { homeOutcomes } from "@/content/home";
import { servicesOutcomes } from "@/content/services";
import { undefinedClasses } from "@/test-utils/css-classes";
import { HomeOutcomes } from "./home-outcomes";

describe("HomeOutcomes", () => {
  it("shows the four Services outcomes under the Services lede", () => {
    render(<HomeOutcomes />);

    const region = screen.getByRole("region", {
      name: "What can we help you achieve?",
    });
    expect(
      within(region).getByText(
        "Pick one service or combine several. We shape the team around your product.",
      ),
    ).toBeDefined();
    expect(
      within(region)
        .getAllByRole("heading", { level: 3 })
        .map((h) => h.textContent),
    ).toEqual(servicesOutcomes.items.map((item) => item.title));
    for (const item of servicesOutcomes.items) {
      expect(within(region).getByText(item.description)).toBeDefined();
    }
  });

  it("offers two next steps: start a project here, or explore services", () => {
    render(<HomeOutcomes />);

    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      homeOutcomes.cta.label,
      "Explore services",
    ]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "#contact",
      "/en/services",
    ]);
    expect(links[0].className).toBe("btn btn-primary");
  });

  it("reveals the outcome rows and uses only defined classes", () => {
    const { container } = render(<HomeOutcomes />);

    expect(
      container.querySelector(".goal-list")?.hasAttribute("data-reveal"),
    ).toBe(true);
    expect(undefinedClasses(container)).toEqual([]);
  });
});
