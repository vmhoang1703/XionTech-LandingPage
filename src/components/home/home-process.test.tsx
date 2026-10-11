import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { undefinedClasses } from "@/test-utils/css-classes";
import { HomeProcess } from "./home-process";

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false })),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("HomeProcess", () => {
  it("is a light region named How we work. with the 4-D lede", () => {
    render(<HomeProcess />);

    const region = screen.getByRole("region", { name: "How we work." });
    expect(region.classList.contains("sec")).toBe(true);
    expect(region.classList.contains("surface-navy")).toBe(false);
    expect(region.classList.contains("gridbg")).toBe(false);
    expect(region.querySelector(".label")).toBeNull();
    expect(region.querySelector("h2")?.textContent).toBe("How we work.");
    expect(region.querySelector(".lede")?.textContent).toContain(
      "Our 4-D process (Discovery, Design, Development, Deployment)",
    );
  });

  it("puts the See the full process link to /services#process on the heading row", () => {
    render(<HomeProcess />);

    const region = screen.getByRole("region", { name: "How we work." });
    const link = screen.getByRole("link", { name: "See the full process" });
    expect(link.getAttribute("href")).toBe("/services#process");
    expect(link.parentElement?.classList.contains("sec-head-row")).toBe(true);
    expect(link.parentElement).toBe(region.querySelector(".sec-head-row"));
    expect(region.querySelector(".sec-head-row .sec-head h2")).not.toBeNull();
  });

  it("uses only classes that globals.css defines", () => {
    const { container } = render(<HomeProcess />);

    expect(undefinedClasses(container)).toEqual([]);
  });
});
