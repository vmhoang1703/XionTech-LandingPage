import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

// jsdom has no WebGL; the silk falls back to the static glow.
vi.mock("@/components/home/silk-shader", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/components/home/silk-shader")>()),
  createSilk: () => null,
}));

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

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("Home page", () => {
  it("opens with the Home hero as the only H1", () => {
    render(<Home />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe("Every school community, connected.");
  });

  it("leaves the main landmark to the root layout", () => {
    render(<Home />);

    expect(screen.queryByRole("main")).toBeNull();
  });
  it("puts the two front doors directly after the hero", () => {
    const { container } = render(<Home />);

    const [hero, doors] = Array.from(container.children);
    expect(hero.getAttribute("aria-labelledby")).toBe("home-hero-title");
    expect(doors.getAttribute("aria-label")).toBe("What we do");
  });
  it("shows the 4-D process on the navy band after the services", () => {
    render(<Home />);

    const band = screen.getByRole("region", {
      name: "From your request to launch, in four steps.",
    });
    expect(band.textContent).toContain("How we work");
    expect(
      screen.getByRole("list", { name: "4-D process" }).closest("section"),
    ).toBe(band);
  });

  it("keeps the demo capture band last, after the hero", () => {
    const { container } = render(<Home />);

    const band = screen
      .getByRole("heading", { name: "See it working at your school." })
      .closest("section");
    expect(container.lastElementChild).toBe(band);
    expect(container.firstElementChild?.getAttribute("aria-labelledby")).toBe(
      "home-hero-title",
    );
    expect(screen.getByRole("button", { name: "Book a demo" })).toBeDefined();
  });
});
