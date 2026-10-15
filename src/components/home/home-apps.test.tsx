import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { appById } from "@/content/apps";
import { homeApps } from "@/content/home";
import { productDetails } from "@/content/products";
import { undefinedClasses } from "@/test-utils/css-classes";
import { HomeApps } from "./home-apps";

const appCards = () =>
  screen
    .getAllByRole("link")
    .filter((link) => link.classList.contains("app-card"));

describe("HomeApps", () => {
  it("is One connected school with the Products lede and a link to Products", () => {
    render(<HomeApps />);

    const region = screen.getByRole("region", {
      name: "One connected school",
    });
    expect(region.querySelector(".lede")?.textContent).toBe(homeApps.lede);
    expect(
      within(region).getByRole("link", { name: "Explore products" }),
    ).toHaveProperty("pathname", "/en/products");
  });

  it("links each app to its own section on Products", () => {
    render(<HomeApps />);

    expect(appCards().map((card) => card.getAttribute("href"))).toEqual([
      "/en/products#pxp",
      "/en/products#sxp",
      "/en/products#ai-tutor",
    ]);
    expect(
      appCards().map((card) => card.querySelector("h3")?.textContent),
    ).toEqual(["Parent Hub", "Staff Hub", "AI Tutor"]);
  });

  it("shows each app’s tagline and its first two real features", () => {
    render(<HomeApps />);

    const [parentHub, , aiTutor] = appCards();
    expect(parentHub.querySelector(".app-for")?.textContent).toBe(
      appById("parent-hub").tagline,
    );
    expect(
      Array.from(parentHub.querySelectorAll(".app-feats li")).map(
        (li) => li.textContent,
      ),
    ).toEqual(
      productDetails["parent-hub"].features
        .slice(0, 2)
        .map((feature) => feature.title),
    );
    expect(aiTutor.textContent).not.toContain("[Placeholder]");
    expect(aiTutor.querySelector(".badge")?.className).toBe("badge b-ait");
  });

  it("gives every card the pointer glow, in a reveal group", () => {
    const { container } = render(<HomeApps />);

    for (const card of appCards()) {
      expect(card.dataset.glow).toBe("");
    }
    expect(
      container.querySelector(".app-cards")?.hasAttribute("data-reveal"),
    ).toBe(true);
    expect(undefinedClasses(container, /^sr-only$/)).toEqual([]);
  });
});
