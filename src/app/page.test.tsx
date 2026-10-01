import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

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
