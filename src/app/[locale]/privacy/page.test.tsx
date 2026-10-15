import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PRIVACY } from "@/content/privacy";
import PrivacyPage, { generateMetadata } from "./page";

const metadata = await generateMetadata({
  params: Promise.resolve({ locale: "en" }),
});

// Website copy v3: the outline-only sections (who we are, transfers, cookies,
// rights) are off the page until the legal text exists.
const SECTION_HEADINGS = [
  "What we collect",
  "How we use it",
  "Who we share it with",
  "How long we keep it",
];

const renderPage = async (locale = "en") =>
  render(await PrivacyPage({ params: Promise.resolve({ locale }) }));

describe("Privacy page", () => {
  it("renders exactly one H1", async () => {
    await renderPage();
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe("Privacy policy");
  });

  it("renders the breadcrumbs with a Home link", async () => {
    await renderPage();
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav.textContent).toBe("Home/Privacy policy");
    expect(
      screen.getByRole("link", { name: "Home" }).getAttribute("href"),
    ).toBe("/en");
  });

  it("renders the four sections in order", async () => {
    await renderPage();
    const h2 = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);
    expect(h2).toEqual(SECTION_HEADINGS);
  });

  it("shows no lede, outline note or [Placeholder] text", async () => {
    const { container } = await renderPage();
    expect(container.querySelector(".lede")).toBeNull();
    expect(container.querySelector(".sample")).toBeNull();
    expect(container.textContent).not.toContain("[Placeholder");
  });

  it("says in the retention section that data is kept with no time limit", async () => {
    const { container } = await renderPage();
    const section = container.querySelector("#privacy-retention");
    expect(section?.textContent).toContain(
      "Contact and demo requests, email capture submissions, job applications and CVs are kept with no time limit.",
    );
  });

  it("has no capture band and no main element", async () => {
    const { container } = await renderPage();
    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelector("main")).toBeNull();
  });

  it("sets the metadata title and description", () => {
    expect(metadata.title).toBe("Privacy Policy | XionTech");
    expect(metadata.description).toBe(
      "How XionTech uses the personal data you share through our forms.",
    );
  });
});

describe("Privacy page in Vietnamese", () => {
  it("shows the Vietnamese title and breadcrumbs, with no lede", async () => {
    await renderPage("vi");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Chính sách bảo mật",
    );
    expect(
      screen.getByRole("navigation", { name: "Đường dẫn" }).textContent,
    ).toBe("Trang chủ/Chính sách bảo mật");
    expect(document.querySelector(".lede")).toBeNull();
  });
});

it("falls back to English for an unknown locale", async () => {
  await renderPage("xx");
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
    "Privacy policy",
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
  it("uses the Japanese title on ja", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ locale: "ja" }),
    });
    expect(meta.title).toBe("プライバシーポリシー | XionTech");
  });

  it("uses the English title on an unknown locale", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ locale: "de" }),
    });
    expect(meta.title).toBe(PRIVACY.metaTitle);
  });
});
