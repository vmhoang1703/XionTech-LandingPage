import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { undefinedClasses } from "@/test-utils/css-classes";
import ServicesPage, { metadata } from "./page";

vi.mock("@/components/sections/hero-art", () => ({ HeroArt: () => null }));

describe("ServicesPage", () => {
  it("has its own title and description", () => {
    expect(metadata.title).toBe("Services | XionTech");
    expect(String(metadata.description)).toContain("Ho Chi Minh City");
  });

  it("renders the navy hero with crumbs, one H1 with the highlight, and the lede", () => {
    const { container } = render(<ServicesPage />);

    const hero = container.querySelector("section.hero-navy.page-hero");
    expect(hero?.getAttribute("aria-labelledby")).toBe("services-h1");
    const crumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(crumbs.querySelector('a[href="/"]')?.textContent).toBe("Home");
    expect(crumbs.textContent).toContain("Services");
    expect(crumbs.querySelectorAll("a")).toHaveLength(1);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].id).toBe("services-h1");
    expect(h1s[0].textContent).toBe("Software teams that get IT done.");
    expect(h1s[0].querySelector(".hl")?.textContent).toBe("get IT done");
    expect(container.querySelector("p.lede")?.textContent).toContain(
      "Product engineering, AI, low-code and cloud delivery",
    );
  });

  it("links the two calls to action", () => {
    const { container } = render(<ServicesPage />);

    const row = container.querySelector(".cta-row");
    const primary = screen.getByRole("link", { name: "Start a project" });
    expect(primary.getAttribute("href")).toBe("/demo#project");
    expect(primary.classList.contains("btn-primary")).toBe(true);
    expect(row?.contains(primary)).toBe(true);
    const glass = screen.getByRole("link", { name: "See our 4-D process" });
    expect(glass.getAttribute("href")).toBe("#process");
    expect(glass.classList.contains("btn-glass")).toBe(true);
    expect(row?.contains(glass)).toBe(true);
  });

  it("puts both zone labels in the server HTML, Ho Chi Minh City first", () => {
    const html = renderToString(<ServicesPage />).replaceAll("<!-- -->", "");

    expect(html).toContain("Ho Chi Minh City <b><span>GMT+7</span></b>");
    expect(html).toContain("Plano <b><span>US Central</span></b>");
    expect(html.indexOf("GMT+7")).toBeLessThan(html.indexOf("US Central"));
  });

  it("names the strip and gives each pill an icon and a clock", () => {
    const { container } = render(<ServicesPage />);

    const strip = screen.getByRole("group", { name: "Office local times" });
    expect(strip.classList.contains("clock-strip")).toBe(true);
    const pills = Array.from(strip.querySelectorAll(":scope > span"));
    expect(pills).toHaveLength(2);
    expect(pills[0].textContent).toContain("Ho Chi Minh City");
    expect(pills[1].textContent).toContain("Plano");
    for (const pill of pills) {
      expect(pill.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
        "true",
      );
      expect(pill.querySelector("b")?.textContent).toMatch(/^\d{2}:\d{2}$/);
    }
    expect(container.querySelectorAll(".clock-strip b")).toHaveLength(2);
  });

  it("defines every class it uses in globals.css", () => {
    const { container } = render(<ServicesPage />);
    expect(undefinedClasses(container, /^mt-4\.5$/)).toEqual([]);
  });
});
