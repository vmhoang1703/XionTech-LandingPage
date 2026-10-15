import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { appById, APP_TAGLINES, appTaglinesVi } from "@/content/apps";
import { pickLocale } from "@/i18n/content";
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
      "/en/products#iot",
      "/en/products#ai-tutor",
    ]);
    expect(
      appCards().map((card) => card.querySelector("h3")?.textContent),
    ).toEqual(["Parent Hub", "Staff Hub", "IoT Device Management", "AI Tutor"]);
  });

  it("shows each app’s tagline and its first two real features", () => {
    render(<HomeApps />);

    const [parentHub, , , aiTutor] = appCards();
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

  it.each(["vi", "ja", "fr", "ko", "zh"] as const)(
    "shows the %s taglines, not the English ones",
    (locale) => {
      render(<HomeApps locale={locale} />);
      const taglines = pickLocale(locale, {
        en: APP_TAGLINES,
        vi: appTaglinesVi,
      });
      const shown = appCards().map(
        (card) => card.querySelector(".app-for")?.textContent,
      );
      expect(shown).toEqual(homeApps.apps.map(({ app }) => taglines[app.id]));
      expect(shown[0]).not.toBe(APP_TAGLINES["parent-hub"]);
    },
  );

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
