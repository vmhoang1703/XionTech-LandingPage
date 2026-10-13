import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PRIVACY } from "@/content/privacy";
import PrivacyPage, { generateMetadata } from "./page";

const metadata = await generateMetadata({
  params: Promise.resolve({ locale: "en" }),
});

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

const renderPage = async (locale = "en") =>
  render(await PrivacyPage({ params: Promise.resolve({ locale }) }));

describe("Privacy page", () => {
  it("renders exactly one H1", async () => {
    await renderPage();
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe("Privacy policy.");
  });

  it("renders the breadcrumbs with a Home link", async () => {
    await renderPage();
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav.textContent).toBe("Home/Privacy policy");
    expect(
      screen.getByRole("link", { name: "Home" }).getAttribute("href"),
    ).toBe("/en");
  });

  it("renders the eight sections in order", async () => {
    await renderPage();
    const h2 = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);
    expect(h2).toEqual(SECTION_HEADINGS);
  });

  it("starts the lede and the outline note with [Placeholder]", async () => {
    const { container } = await renderPage();
    expect(container.querySelector(".lede")?.textContent).toMatch(
      /^\[Placeholder\]/,
    );
    expect(container.querySelector(".sample")?.textContent).toMatch(
      /^\[Placeholder\]/,
    );
  });

  it("says in the retention section that data is kept with no time limit", async () => {
    const { container } = await renderPage();
    const section = container.querySelector("#privacy-retention");
    expect(section?.textContent).toContain(
      "Contact and demo requests, email capture submissions, job applications and CVs are kept with no time limit.",
    );
  });

  it("marks the cookie text as a placeholder", async () => {
    const { container } = await renderPage();
    const paragraphs = container.querySelectorAll("#privacy-cookies p");
    expect(paragraphs.length).toBeGreaterThan(0);
    for (const p of paragraphs) {
      expect(p.textContent).toMatch(/^\[Placeholder\]/);
    }
  });

  it("starts every paragraph with [Placeholder] except the decided retention sentence", async () => {
    const { container } = await renderPage();
    const unmarked = [...container.querySelectorAll("p")].filter(
      (p) => !p.textContent?.startsWith("[Placeholder]"),
    );
    expect(unmarked.map((p) => p.textContent)).toEqual([
      PRIVACY.retentionDecided,
    ]);
  });

  it("has no capture band and no main element", async () => {
    const { container } = await renderPage();
    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelector("main")).toBeNull();
  });

  it("sets the metadata title and a placeholder description", () => {
    expect(metadata.title).toBe("Privacy Policy | XionTech");
    expect(metadata.description).toMatch(/^\[Placeholder\]/);
  });
});

describe("Privacy page in Vietnamese", () => {
  it("shows the Vietnamese title, breadcrumbs and placeholder lede", async () => {
    await renderPage("vi");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Chính sách bảo mật.",
    );
    expect(
      screen.getByRole("navigation", { name: "Đường dẫn" }).textContent,
    ).toBe("Trang chủ/Chính sách bảo mật");
    expect(document.querySelector(".lede")?.textContent).toMatch(
      /^\[Placeholder\] Nội dung/,
    );
  });
});
