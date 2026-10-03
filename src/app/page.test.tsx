import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

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
