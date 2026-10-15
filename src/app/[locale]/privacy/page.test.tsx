import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PRIVACY } from "@/content/privacy";
import PrivacyPage, { generateMetadata } from "./page";

const metadata = await generateMetadata({
  params: Promise.resolve({ locale: "en" }),
});

// The XionTech Privacy Policy, Document Version 1.1: its top sections in order.
const SECTION_HEADINGS = [
  "Introduction",
  "Company Information",
  "Service Scope and Ownership",
  "Covered Services",
  "Information We Collect",
  "How We Use Your Information",
  "Information Sharing and Disclosure",
  "Data Retention",
  "Your Rights and Choices",
  "Children’s Privacy",
  "International Data Transfers",
  "Security Measures",
  "Cookies and Tracking Technologies",
  "Artificial Intelligence and Automated Processing",
  "Service-Specific Privacy Information",
  "Compliance Information",
  "Contact Information",
  "Changes to This Policy",
];

const renderPage = async (locale = "en") =>
  render(await PrivacyPage({ params: Promise.resolve({ locale }) }));

describe("Privacy page", () => {
  it("renders exactly one H1", async () => {
    await renderPage();
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe("Privacy Policy");
  });

  it("renders the breadcrumbs with a Home link", async () => {
    await renderPage();
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav.textContent).toBe("Home/Privacy policy");
    expect(
      screen.getByRole("link", { name: "Home" }).getAttribute("href"),
    ).toBe("/en");
  });

  it("shows the update, effective date and version under the title", async () => {
    const { container } = await renderPage();
    expect(container.querySelector(".policy-dates")?.textContent).toBe(
      "Last update: July 10, 2025 · Effective Date: July 10, 2025 · Document Version: 1.1",
    );
  });

  it("renders the policy sections in order as H2s", async () => {
    await renderPage();
    const h2 = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);
    expect(h2).toEqual(SECTION_HEADINGS);
  });

  it("renders subsections as H3s", async () => {
    await renderPage();
    const h3 = screen
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    expect(h3).toContain("Current Ownership");
    expect(h3).toContain("1. Information You Provide Directly");
    expect(h3).toContain("Technical Safeguards");
  });

  it("links every section from the contents list", async () => {
    await renderPage();
    const toc = screen.getByRole("navigation", { name: "On this page" });
    const links = within(toc).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(SECTION_HEADINGS);
    for (const link of links) {
      const id = link.getAttribute("href")?.slice(1) ?? "";
      expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it("makes the emails and phone number mailto: and tel: links", async () => {
    await renderPage();
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("mailto:contact@xiontechs.com");
    expect(hrefs).toContain("mailto:itsupport@xiontechs.com");
    expect(hrefs).toContain("tel:+84908107552");
  });

  it("shows the company facts and leaves out the stray QRCode word", async () => {
    const { container } = await renderPage();
    const facts = container.querySelector("#company-information dl");
    expect(facts?.textContent).toContain("Business License Number0318883639");
    expect(container.textContent).not.toContain("QRCode");
  });

  it("does not show the English-language note on English", async () => {
    const { container } = await renderPage();
    expect(container.querySelector(".policy-lang-note")).toBeNull();
  });

  it("has no capture band and no main element", async () => {
    const { container } = await renderPage();
    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelector("main")).toBeNull();
  });

  it("sets the metadata title and description", () => {
    expect(metadata.title).toBe("Privacy Policy | XionTech");
    expect(metadata.description).toBe(PRIVACY.metaDescription);
  });
});

describe("Privacy page in Vietnamese", () => {
  it("shows the Vietnamese title and the English-language note, with the policy in English", async () => {
    const { container } = await renderPage("vi");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Chính sách bảo mật",
    );
    expect(
      screen.getByRole("navigation", { name: "Đường dẫn" }).textContent,
    ).toBe("Trang chủ/Chính sách bảo mật");
    expect(container.querySelector(".policy-lang-note")?.textContent).toBe(
      "Chính sách này được cung cấp bằng tiếng Anh.",
    );
    expect(container.querySelector("article")?.getAttribute("lang")).toBe("en");
    expect(screen.getAllByRole("heading", { level: 2 })[0].textContent).toBe(
      "Introduction",
    );
  });
});

it("falls back to English for an unknown locale", async () => {
  await renderPage("xx");
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
    "Privacy Policy",
  );
});

describe("Privacy page metadata in Vietnamese", () => {
  it("uses the Vietnamese title and description", async () => {
    const viMeta = await generateMetadata({
      params: Promise.resolve({ locale: "vi" }),
    });
    expect(String(viMeta.title)).toBe("Chính sách bảo mật | XionTech");
    expect(String(viMeta.description)).toMatch(/^Cách XionTech/);
  });
});

describe("Privacy page metadata in other locales", () => {
  it("uses the English title on an unknown locale", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ locale: "de" }),
    });
    expect(meta.title).toBe(PRIVACY.metaTitle);
  });
});
