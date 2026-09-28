import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home page", () => {
  it("renders the site name as the main heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: "XionTech" }),
    ).toBeDefined();
  });

  it("marks unfinished content as placeholder", () => {
    render(<Home />);

    expect(screen.getByText(/^\[Placeholder\]/)).toBeDefined();
  });
});
