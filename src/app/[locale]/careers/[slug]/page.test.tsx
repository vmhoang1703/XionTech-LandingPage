import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { jobMeta } from "@/content/job";
import { getOpenRole } from "@/lib/careers/open-roles";

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: vi.fn() }));
vi.mock("@vercel/blob/client", () => ({ uploadPresigned: vi.fn() }));
vi.mock("@/lib/careers/open-roles", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/careers/open-roles")>()),
  getOpenRole: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

import { notFound } from "next/navigation";
import JobPage, { generateMetadata } from "./page";

const metadata = await generateMetadata({
  params: Promise.resolve({ locale: "en" }),
});

// jsdom has no canvas: HeroArt skips the ribbon.
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

const role = {
  slug: "qa-engineer",
  title: "QA Engineer",
  team: "Engineering",
  location: "Ho Chi Minh City",
  type: "full-time",
  about: "Test things.",
  responsibilities: [],
  requirements: [],
};

async function renderPage(slug = "qa-engineer") {
  return render(
    await JobPage({
      params: Promise.resolve({ locale: "en", slug }),
      searchParams: Promise.resolve({}),
    }),
  );
}

describe("Job page", () => {
  it("calls notFound when the role is not open", async () => {
    vi.mocked(getOpenRole).mockResolvedValue(null);

    await expect(renderPage("no-such-role")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledTimes(1);
    expect(getOpenRole).toHaveBeenCalledWith("no-such-role", "en");
  });

  it("renders the H1, crumbs and the application form", async () => {
    vi.mocked(getOpenRole).mockResolvedValue(role);
    await renderPage();

    expect(getOpenRole).toHaveBeenCalledWith("qa-engineer", "en");
    expect(
      screen.getByRole("heading", { level: 1, name: "QA Engineer" }),
    ).not.toBeNull();
    const crumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(crumbs.textContent).toContain("Home");
    expect(crumbs.textContent).toContain("Careers");
    expect(crumbs.querySelector("[aria-current='page']")?.textContent).toBe(
      "QA Engineer",
    );
    expect(
      screen.getByRole("heading", { name: "Apply for this role" }),
    ).not.toBeNull();
    expect(notFound).not.toHaveBeenCalled();
  });

  it("has no email capture band", async () => {
    vi.mocked(getOpenRole).mockResolvedValue(role);
    const { container } = await renderPage();

    expect(container.querySelector(".capture")).toBeNull();
    expect(container.querySelectorAll("form")).toHaveLength(1);
  });

  it("sets the static page metadata", () => {
    expect(metadata.title).toBe(jobMeta.title);
    expect(metadata.description).toBe(jobMeta.description);
  });
});

describe("Job page in Vietnamese", () => {
  it("shows Vietnamese crumbs, headings and chips, and marks English role text", async () => {
    vi.mocked(getOpenRole).mockResolvedValue({
      ...role,
      responsibilities: ["Write tests."],
      lang: "en",
      detailLang: "en",
    });
    const { container } = render(
      await JobPage({
        params: Promise.resolve({ locale: "vi", slug: "qa-engineer" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(getOpenRole).toHaveBeenCalledWith("qa-engineer", "vi");
    const h1 = screen.getByRole("heading", { level: 1, name: "QA Engineer" });
    expect(h1.getAttribute("lang")).toBe("en");
    expect(
      screen.getByRole("navigation", { name: "Đường dẫn" }).textContent,
    ).toContain("Tuyển dụng");
    expect(screen.getByText("Toàn thời gian")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Về vị trí này" })).toBeTruthy();
    expect(screen.getByText("Test things.").getAttribute("lang")).toBe("en");
    expect(container.querySelector(".list-check")?.getAttribute("lang")).toBe(
      "en",
    );
  });
});

it("falls back to English for an unknown locale", async () => {
  vi.mocked(getOpenRole).mockResolvedValue(role);
  await JobPage({
    params: Promise.resolve({ locale: "xx", slug: "qa-engineer" }),
    searchParams: Promise.resolve({}),
  });
  expect(getOpenRole).toHaveBeenCalledWith("qa-engineer", "en");
});
