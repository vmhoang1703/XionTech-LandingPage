import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { productsMeta } from "@/content/products";
import { undefinedClasses } from "@/test-utils/css-classes";
import ProductsPage, { generateMetadata } from "./page";

const metadata = await generateMetadata({
  params: Promise.resolve({ locale: "en" }),
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// jsdom has no observers: the roadmap never leaves its armed phase.
class NoObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
  vi.stubGlobal("IntersectionObserver", NoObserver);
  vi.stubGlobal("ResizeObserver", NoObserver);
  // jsdom has no CSS.supports or animation frames.
  vi.stubGlobal("CSS", { supports: () => true });
  vi.stubGlobal("requestAnimationFrame", () => 1);
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Products page", () => {
  it("renders the roadmap, then the capture band, with no app showcase", () => {
    const { container } = render(<ProductsPage />);
    const sections = [...container.querySelectorAll("section")];
    expect(sections).toHaveLength(2);
    expect(sections[0].id).toBe("map");
    expect(sections[1].classList.contains("capture")).toBe(true);
    // E-A5 CAP-5: the navy band from E-A4.
    expect(sections[1].classList.contains("surface-navy")).toBe(true);
    expect(container.querySelector("#apps")).toBeNull();
    expect(container.querySelector("dialog.pdetail")).toBeNull();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "See it working at your school.",
      }),
    ).toBeDefined();
  });

  it("opens with the H1 and a roadmap of six cards", () => {
    const { container } = render(<ProductsPage />);
    const map = container.querySelector("section#map");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Built apart. Better together.",
      }),
    ).toBeDefined();
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(map?.querySelector("h1")).not.toBeNull();
    const roadmap = map?.querySelector(".rm");
    expect(roadmap?.querySelectorAll(".rm-card")).toHaveLength(6);
  });

  it("puts the four app anchors in the roadmap", () => {
    const { container } = render(<ProductsPage />);
    for (const id of ["pxp", "sxp", "iot", "ai-tutor"]) {
      expect(container.querySelectorAll(`[id="${id}"]`)).toHaveLength(1);
      expect(
        container.querySelector(`section#map .rm [id="${id}"]`),
      ).not.toBeNull();
    }
  });

  it("has no sub-nav, tab list, Updates link or LXP section", () => {
    const { container } = render(<ProductsPage />);
    expect(container.querySelector(".subnav")).toBeNull();
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(container.querySelector('a[href="#updates"]')).toBeNull();
    expect(container.querySelector("#lxp")).toBeNull();
    expect(container.textContent).not.toContain("Four apps. One");
  });

  it("styles every class it uses", () => {
    const { container } = render(<ProductsPage />);
    expect(
      undefinedClasses(container, /^(sr-only|size-|mt-|-?z-|absolute)/),
    ).toEqual([]);
  });

  it("sets the page metadata", () => {
    expect(metadata.title).toBe(
      "School Apps: Parent Hub, Staff Hub, IoT & AI Tutor | XionTech",
    );
    expect(metadata.description).toBe(productsMeta.description);
    expect(productsMeta.description).not.toMatch(/PXP|LXP|SXP|XionTechs/);
  });
});
