import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { productsMeta } from "@/content/products";
import {
  definesClass,
  globalsCss,
  undefinedClasses,
} from "@/test-utils/css-classes";
import ProductsPage, { metadata } from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// jsdom has no observers: the campus stays on its still SVG fallback.
class NoObserver {
  observe() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false })),
  );
  vi.stubGlobal("IntersectionObserver", NoObserver);
  vi.stubGlobal("ResizeObserver", NoObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Products page", () => {
  it("renders the audience flow, the showcase and the capture band in order", () => {
    const { container } = render(<ProductsPage />);
    const sections = [...container.querySelectorAll("section")];
    expect(sections).toHaveLength(3);
    expect(sections[0].id).toBe("flow");
    expect(sections[1].id).toBe("apps");
    expect(sections[2].classList.contains("capture")).toBe(true);
    // E-A5 CAP-5: the navy band from E-A4.
    expect(sections[2].classList.contains("surface-navy")).toBe(true);
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

  // jsdom has no WebGL, so the toggle never renders above; it shows once the
  // campus is ready.
  it("styles the campus Pause/Play toggle", () => {
    expect(definesClass(globalsCss(), "flow-toggle")).toBe(true);
  });

  it("sets the page metadata", () => {
    expect(metadata.title).toBe(
      "School Apps: Parent Hub, Staff Hub, IoT & AI Tutor | XionTech",
    );
    expect(metadata.description).toBe(productsMeta.description);
    expect(productsMeta.description).not.toMatch(/PXP|LXP|SXP|XionTechs/);
  });
});
