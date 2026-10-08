import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { productsMeta } from "@/content/products";
import { undefinedClasses } from "@/test-utils/css-classes";
import ProductsPage, { metadata } from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Products page", () => {
  it("renders the hero, the showcase and the capture band in order", () => {
    const { container } = render(<ProductsPage />);
    const sections = [...container.querySelectorAll("section")];
    expect(sections[0].classList.contains("eco-hero")).toBe(true);
    expect(sections[1].id).toBe("apps");
    expect(sections[2].classList.contains("capture")).toBe(true);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "See it working at your school.",
      }),
    ).toBeDefined();
  });

  it("has the four card ids and no sub-nav, tab list, Updates link or LXP section", () => {
    const { container } = render(<ProductsPage />);
    for (const id of ["pxp", "sxp", "iot", "ai-tutor"]) {
      expect(container.querySelector(`article#${id}`)).not.toBeNull();
    }
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
