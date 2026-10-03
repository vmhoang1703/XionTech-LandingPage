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
  it("is a navy section with the grid texture, the label and the heading", () => {
    render(<HomeProcess />);

    const band = screen.getByRole("region", {
      name: "From your request to launch, in four steps.",
    });
    for (const name of ["sec", "surface-navy", "gridbg"]) {
      expect(band.classList.contains(name)).toBe(true);
    }
    const head = band.querySelector(".sec-head");
    expect(head?.querySelector(".label")?.textContent).toBe("How we work");
    expect(head?.querySelector("h2")?.id).toBe("process-title");
  });

  it("uses only classes that globals.css defines", () => {
    const { container } = render(<HomeProcess />);

    expect(undefinedClasses(container)).toEqual([]);
  });
});
