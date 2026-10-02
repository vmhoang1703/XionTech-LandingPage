import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

// jsdom has no WebGL; the silk falls back to the static glow.
vi.mock("@/components/home/silk-shader", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/components/home/silk-shader")>()),
  createSilk: () => null,
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
});
