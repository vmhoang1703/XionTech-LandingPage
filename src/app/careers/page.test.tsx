import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { careersMeta } from "@/content/careers";
import { getLifePhotos } from "@/lib/careers/life-photos";
import { getOpenRoles } from "@/lib/careers/open-roles";

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: vi.fn() }));
vi.mock("@/lib/careers/open-roles", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/careers/open-roles")>()),
  getOpenRoles: vi.fn(),
}));

vi.mock("@/lib/careers/life-photos", () => ({ getLifePhotos: vi.fn() }));

import CareersPage, { metadata } from "./page";

// jsdom has no canvas: HeroArt skips the ribbon.
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function renderPage() {
  return render(await CareersPage());
}

describe("Careers page", () => {
  it("renders the H1, #roles and #life", async () => {
    vi.mocked(getOpenRoles).mockResolvedValue([]);
    const { container } = await renderPage();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Build what schools use every day.",
      }),
    ).not.toBeNull();
    expect(container.querySelector("section#roles")).not.toBeNull();
    expect(container.querySelector("section#life")).not.toBeNull();
  });

  it("orders the sections as the mockup does", async () => {
    vi.mocked(getOpenRoles).mockResolvedValue([]);
    const { container } = await renderPage();

    const labels = [...container.querySelectorAll("section")].map((s) =>
      s.getAttribute("aria-labelledby"),
    );
    expect(labels).toEqual([
      "careers-h1",
      "cul-h",
      "ben-h",
      "roles-h",
      "life-h",
    ]);
  });

  it("passes the fetched roles to the open roles list", async () => {
    vi.mocked(getOpenRoles).mockResolvedValue([
      { slug: "qa-engineer", title: "QA Engineer" },
    ]);
    await renderPage();

    expect(
      screen.getByRole("link", { name: /QA Engineer/ }).getAttribute("href"),
    ).toBe("/careers/qa-engineer");
  });

  it("passes the fetched life photos to the life frames", async () => {
    vi.mocked(getOpenRoles).mockResolvedValue([]);
    vi.mocked(getLifePhotos).mockResolvedValue({
      team: {
        url: "https://cdn.sanity.io/images/1khn3hf4/production/team.jpg",
        alt: "The team",
      },
    });
    await renderPage();

    expect(screen.getByAltText("The team")).not.toBeNull();
  });

  it("keeps the placeholder frames when there are no photos", async () => {
    vi.mocked(getOpenRoles).mockResolvedValue([]);
    vi.mocked(getLifePhotos).mockResolvedValue(null);
    await renderPage();

    expect(screen.getByText("[Placeholder] Team photo")).not.toBeNull();
  });

  it("has no email capture band", async () => {
    vi.mocked(getOpenRoles).mockResolvedValue([]);
    const { container } = await renderPage();

    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelector("input")).toBeNull();
    expect(container.querySelector(".capture")).toBeNull();
  });

  it("sets the page metadata", () => {
    expect(metadata.title).toBe(careersMeta.title);
    expect(metadata.description).toBe(careersMeta.description);
  });
});
