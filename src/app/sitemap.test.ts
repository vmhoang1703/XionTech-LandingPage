import { afterEach, describe, expect, it, vi } from "vitest";
import { getOpenRoles } from "@/lib/careers/open-roles";
import { getAllPosts } from "@/lib/news/all-posts";
import sitemap from "./sitemap";

vi.mock("@/lib/careers/open-roles", () => ({ getOpenRoles: vi.fn() }));
vi.mock("@/lib/news/all-posts", () => ({ getAllPosts: vi.fn() }));

afterEach(() => {
  vi.clearAllMocks();
});

const post = (titleLang: string) => ({
  slug: "pxp-day",
  title: "Story",
  publishedAt: "2026-10-04T03:00:00.000Z",
  titleLang,
});

describe("sitemap.xml", () => {
  it("lists static pages and roles in every locale, and only translated stories outside English", async () => {
    vi.mocked(getOpenRoles).mockResolvedValue([
      { slug: "qa-engineer", title: "QA Engineer" },
    ]);
    vi.mocked(getAllPosts).mockImplementation(async (locale = "en") => [
      post(locale === "vi" ? "vi" : "en"),
    ]);
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain("https://xiontech-hoangvu-dev.vercel.app/en");
    expect(urls).toContain(
      "https://xiontech-hoangvu-dev.vercel.app/vi/services",
    );
    expect(urls).toContain(
      "https://xiontech-hoangvu-dev.vercel.app/vi/careers/qa-engineer",
    );
    expect(urls).toContain(
      "https://xiontech-hoangvu-dev.vercel.app/en/news/pxp-day",
    );
    expect(urls).toContain(
      "https://xiontech-hoangvu-dev.vercel.app/vi/news/pxp-day",
    );
    expect(urls.filter((url) => url.endsWith("/about"))).toHaveLength(2);
  });

  it("gives each static page its hreflang alternates", async () => {
    vi.mocked(getOpenRoles).mockResolvedValue([]);
    vi.mocked(getAllPosts).mockResolvedValue([]);
    const home = (await sitemap()).find(
      (entry) => entry.url === "https://xiontech-hoangvu-dev.vercel.app/vi",
    );
    expect(home?.alternates?.languages).toMatchObject({
      en: "https://xiontech-hoangvu-dev.vercel.app/en",
      "x-default": "https://xiontech-hoangvu-dev.vercel.app/en",
    });
  });

  it("still lists the static pages when Sanity cannot be read", async () => {
    vi.mocked(getOpenRoles).mockRejectedValue(new Error("down"));
    vi.mocked(getAllPosts).mockRejectedValue(new Error("down"));
    expect(await sitemap()).toHaveLength(7 * 2);
  });
});
