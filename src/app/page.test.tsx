import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

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

  it("sets the placeholder text in the brand muted colour", () => {
    render(<Home />);

    const placeholder = screen.getByText(/^\[Placeholder\]/);
    expect(placeholder.classList.contains("text-muted")).toBe(true);
  });

  it("renders the demo capture band after the placeholder", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "See it working at your school." }),
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "Book a demo" })).toBeDefined();
  });
});
