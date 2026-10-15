import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  articleLd,
  breadcrumbLd,
  jobPostingLd,
  JsonLd,
  organizationLd,
  websiteLd,
} from "./json-ld";
import { SITE_URL } from "./site";

describe("JSON-LD", () => {
  it("describes the organization without an address or founding year", () => {
    const org = organizationLd();
    expect(org).toMatchObject({
      "@type": "Organization",
      name: "XionTech",
      legalName: "XionTech Joint Stock Company",
      url: SITE_URL,
      email: "contact@xiontechs.com",
      sameAs: [
        "https://www.linkedin.com/company/xiontechs/about/",
        "https://www.facebook.com/xiontechs/",
      ],
    });
    expect(org).not.toHaveProperty("address");
    expect(org).not.toHaveProperty("foundingDate");
  });

  it("names the website in the page language", () => {
    expect(websiteLd("zh")).toMatchObject({
      "@type": "WebSite",
      url: `${SITE_URL}/zh`,
      inLanguage: "zh-Hans",
    });
  });

  it("starts breadcrumbs at the locale Home", () => {
    const list = breadcrumbLd("vi", [{ name: "Tin tức", path: "/news" }]);
    expect(list.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: `${SITE_URL}/vi`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tin tức",
        item: `${SITE_URL}/vi/news`,
      },
    ]);
  });

  it("builds an article from the story", () => {
    expect(
      articleLd("en", {
        slug: "s",
        title: "T",
        excerpt: null,
        publishedAt: "2026-10-04T03:00:00.000Z",
        image: "https://cdn.sanity.io/x.jpg",
      }),
    ).toMatchObject({
      "@type": "Article",
      headline: "T",
      datePublished: "2026-10-04T03:00:00.000Z",
      image: ["https://cdn.sanity.io/x.jpg"],
      mainEntityOfPage: `${SITE_URL}/en/news/s`,
    });
  });

  it("builds a job posting from the fields the role has, and only those", () => {
    const job = jobPostingLd("en", {
      slug: "qa",
      title: "QA Engineer",
      about: "Test things.",
      location: "Ho Chi Minh City",
      type: "full-time",
      createdAt: "2026-10-01T00:00:00Z",
    });
    expect(job).toMatchObject({
      "@type": "JobPosting",
      title: "QA Engineer",
      description: "Test things.",
      datePosted: "2026-10-01T00:00:00Z",
      employmentType: "FULL_TIME",
      url: `${SITE_URL}/en/careers/qa`,
    });
    const bare = jobPostingLd("en", { slug: "qa", title: "QA" });
    expect(Object.keys(bare).sort()).toEqual(
      ["@type", "hiringOrganization", "title", "url"].sort(),
    );
    expect(bare).not.toHaveProperty("baseSalary");
  });

  it("renders a script whose text cannot close the tag", () => {
    const { container } = render(
      <JsonLd data={{ "@type": "Thing", name: "</script><b>" }} />,
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script?.innerHTML).not.toContain("</script>");
    expect(JSON.parse(script?.textContent ?? "")).toMatchObject({
      "@context": "https://schema.org",
      "@graph": [{ name: "</script><b>" }],
    });
  });
});
