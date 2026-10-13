import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PRIVACY } from "@/content/privacy";
import PrivacyPage, { metadata } from "./page";

const SECTION_HEADINGS = [
  "Who we are and how to reach us",
  "What we collect",
  "How we use it",
  "Who we share it with",
  "Transfers outside Vietnam",
  "How long we keep it",
  "Cookies and analytics",
  "Your rights",
];

describe("Privacy page", () => {
  it("renders exactly one H1", () => {
    render(<PrivacyPage />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe("Privacy policy.");
  });

  it("renders the breadcrumbs with a Home link", () => {
    render(<PrivacyPage />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav.textContent).toBe("Home/Privacy policy");
    expect(
      screen.getByRole("link", { name: "Home" }).getAttribute("href"),
    ).toBe("/");
  });

  it("renders the eight sections in order", () => {
    render(<PrivacyPage />);
    const h2 = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);
    expect(h2).toEqual(SECTION_HEADINGS);
  });

  it("starts the lede and the outline note with [Placeholder]", () => {
    const { container } = render(<PrivacyPage />);
    expect(container.querySelector(".lede")?.textContent).toMatch(
      /^\[Placeholder\]/,
    );
    expect(container.querySelector(".sample")?.textContent).toMatch(
      /^\[Placeholder\]/,
    );
  });

  it("says in the retention section that data is kept with no time limit", () => {
    const { container } = render(<PrivacyPage />);
    const section = container.querySelector("#privacy-retention");
    expect(section?.textContent).toContain(
      "Contact and demo requests, email capture submissions, job applications and CVs are kept with no time limit.",
    );
  });

  it("marks the cookie text as a placeholder", () => {
    const { container } = render(<PrivacyPage />);
    const paragraphs = container.querySelectorAll("#privacy-cookies p");
    expect(paragraphs.length).toBeGreaterThan(0);
    for (const p of paragraphs) {
      expect(p.textContent).toMatch(/^\[Placeholder\]/);
    }
  });

  it("starts every paragraph with [Placeholder] except the decided retention sentence", () => {
    const { container } = render(<PrivacyPage />);
    const unmarked = [...container.querySelectorAll("p")].filter(
      (p) => !p.textContent?.startsWith("[Placeholder]"),
    );
    expect(unmarked.map((p) => p.textContent)).toEqual([
      PRIVACY.retentionDecided,
    ]);
  });

  it("has no capture band and no main element", () => {
    const { container } = render(<PrivacyPage />);
    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelector("main")).toBeNull();
  });

  it("sets the metadata title and a placeholder description", () => {
    expect(metadata.title).toBe("Privacy Policy | XionTech");
    expect(metadata.description).toMatch(/^\[Placeholder\]/);
  });
});
