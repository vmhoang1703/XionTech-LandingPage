import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { careersMeta } from "@/content/careers";
import { getOpenRoles } from "@/lib/careers/open-roles";

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: vi.fn() }));
vi.mock("@/lib/careers/open-roles", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/careers/open-roles")>()),
  getOpenRoles: vi.fn(),
}));

import CareersPage, { generateMetadata } from "./page";

const metadata = await generateMetadata({
  params: Promise.resolve({ locale: "en" }),
});

// The growth ring reads reduced motion and watches the viewport.
beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: true })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function renderPage() {
  return render(
    await CareersPage({ params: Promise.resolve({ locale: "en" }) }),
  );
}

describe("Careers page", () => {
  it("renders the H1, #life and #roles", async () => {
    vi.mocked(getOpenRoles).mockResolvedValue([]);
    const { container } = await renderPage();

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Stay curious. Build what’s next.",
    );
    expect(container.querySelector("section#life")).not.toBeNull();
    expect(container.querySelector("section#roles")).not.toBeNull();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Find your next challenge.",
      }),
    ).not.toBeNull();
  });

  it("orders the sections as the prototype does, roles last", async () => {
    vi.mocked(getOpenRoles).mockResolvedValue([]);
    const { container } = await renderPage();

    const labels = [...container.querySelectorAll("section")].map((s) =>
      s.getAttribute("aria-labelledby"),
    );
    expect(labels).toEqual(["careers-h1", "life-h", "cul-h", "roles-h"]);
    expect(container.querySelector(".page-scene section:last-child")?.id).toBe(
      "roles",
    );
  });

  it("drops the old culture, benefits and life photo sections", async () => {
    vi.mocked(getOpenRoles).mockResolvedValue([]);
    const { container } = await renderPage();

    for (const gone of [
      "Why you’ll grow here.",
      "Why you'll grow here.",
      "A culture that goes beyond employment.",
      "Life at XionTech.",
    ]) {
      expect(screen.queryByRole("heading", { name: gone })).toBeNull();
    }
    expect(container.querySelector(".illo")).toBeNull();
    expect(container.querySelector(".crumbs")).toBeNull();
  });

  it("passes the fetched roles to the open roles list", async () => {
    vi.mocked(getOpenRoles).mockResolvedValue([
      { slug: "qa-engineer", title: "QA Engineer" },
    ]);
    await renderPage();

    expect(
      screen.getByRole("link", { name: /QA Engineer/ }).getAttribute("href"),
    ).toBe("/en/careers/qa-engineer");
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

describe("Careers page in Vietnamese", () => {
  it("shows Vietnamese copy, role meta and marks an English role", async () => {
    vi.mocked(getOpenRoles).mockResolvedValue([
      {
        slug: "qa",
        title: "QA Engineer",
        team: "QA",
        type: "full-time",
        titleLang: "en",
        teamLang: "en",
      },
    ]);
    const { container } = render(
      await CareersPage({ params: Promise.resolve({ locale: "vi" }) }),
    );

    expect(vi.mocked(getOpenRoles)).toHaveBeenCalledWith("vi");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Luôn tò mò. Xây dựng điều tiếp theo.",
    );
    expect(
      screen.getByText("Năm điều định hình cách chúng tôi làm việc."),
    ).toBeTruthy();
    expect(screen.getByText("Bên trong XionTech.")).toBeTruthy();
    expect(screen.getByText("Xem và ứng tuyển")).toBeTruthy();
    expect(container.querySelector(".role-main small")?.textContent).toBe(
      "QA · Toàn thời gian",
    );
    expect(container.querySelector(".role-main")?.hasAttribute("lang")).toBe(
      false,
    );
    expect(screen.getByText("QA Engineer").getAttribute("lang")).toBe("en");
    expect(screen.getByText("QA").getAttribute("lang")).toBe("en");
    expect(
      container.querySelector('.role-main small [lang="en"]')?.textContent,
    ).toBe("QA");
  });
});

it("falls back to English for an unknown locale", async () => {
  vi.mocked(getOpenRoles).mockResolvedValue([]);
  await CareersPage({ params: Promise.resolve({ locale: "xx" }) });
  expect(vi.mocked(getOpenRoles)).toHaveBeenCalledWith("en");
});

describe("Careers page metadata in Vietnamese", () => {
  it("uses the Vietnamese title and description", async () => {
    const viMeta = await generateMetadata({
      params: Promise.resolve({ locale: "vi" }),
    });
    expect(viMeta.title).toBe(
      "Tuyển dụng tại XionTech | Việc làm phần mềm tại TP. Hồ Chí Minh",
    );
    expect(String(viMeta.title)).not.toContain("[Placeholder]");
  });
});
