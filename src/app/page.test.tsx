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

  it("renders inside the main landmark", () => {
    render(<Home />);

    expect(screen.getByRole("main").id).toBe("main");
  });
});
