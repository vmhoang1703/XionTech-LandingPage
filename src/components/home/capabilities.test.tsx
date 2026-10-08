import { fireEvent, render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import { Capabilities } from "./capabilities";

const INDUSTRIES = ["Healthcare", "Logistics", "Private Equity"];

function reveal() {
  render(<Capabilities />);
  return screen.getByRole("button", { name: /3 more industries/ });
}

describe("Capabilities", () => {
  it("names the section, with a lede and four cards", () => {
    render(<Capabilities />);

    const region = screen.getByRole("region", { name: "Capabilities." });
    expect(
      within(region).getByText(
        "Why XionTech: the core capabilities behind every school app and every product we deliver.",
      ),
    ).toBeDefined();
    expect(
      within(region)
        .getAllByRole("heading", { level: 3 })
        .map((h) => h.textContent),
    ).toEqual([
      "Products for schools",
      "Two offices, one working day.",
      "Deep in education. Built to adapt.",
      "Your software delivery team",
    ]);
  });

  it("links the Products and Services cards", () => {
    render(<Capabilities />);

    expect(
      screen
        .getByRole("link", { name: /Products for schools/ })
        .getAttribute("href"),
    ).toBe("/products");
    expect(
      screen
        .getByRole("link", { name: /Your software delivery team/ })
        .getAttribute("href"),
    ).toBe("/services");
  });

  it("shows both offices: zone label in the server HTML, then the time", () => {
    const html = renderToString(<Capabilities />);
    expect(html).toContain("US Central");
    expect(html).toContain("GMT+7");

    render(<Capabilities />);
    const chips = screen.getAllByText(/^\d{2}:\d{2}$/);
    expect(chips).toHaveLength(2);
    expect(screen.getByText("HCMC").getAttribute("title")).toBe(
      "Ho Chi Minh City",
    );
  });

  it("has the three industries in the markup before any click", () => {
    const button = reveal();

    expect(button.getAttribute("aria-expanded")).toBe("false");
    for (const name of INDUSTRIES) {
      expect(screen.getByText(name)).toBeDefined();
    }
    expect(button.getAttribute("aria-label")).toBe(
      "3 more industries: Healthcare, Logistics and Private Equity",
    );
  });

  it('toggles aria-expanded and the open state when "+3" is clicked', () => {
    const button = reveal();
    const more = button.closest(".w-more");

    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(more?.classList.contains("open")).toBe(true);

    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(more?.classList.contains("open")).toBe(false);
  });

  it("closes the list when focus leaves the reveal area", () => {
    const button = reveal();
    fireEvent.click(button);

    fireEvent.blur(button, { relatedTarget: document.body });

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.closest(".w-more")?.classList.contains("open")).toBe(false);
  });

  it("keeps the list open when focus moves inside the reveal area", () => {
    const button = reveal();
    fireEvent.click(button);

    fireEvent.blur(button, {
      relatedTarget: screen.getByText("Healthcare"),
    });

    expect(button.getAttribute("aria-expanded")).toBe("true");
  });

  it("ends with the motto", () => {
    render(<Capabilities />);

    expect(screen.getByText("Get IT Done")).toBeDefined();
    expect(screen.getByText("Built with ownership.")).toBeDefined();
    expect(
      screen.getByText("Ownership of our commitments and pride in quality."),
    ).toBeDefined();
  });

  it("only uses classes that globals.css defines", () => {
    const { container } = render(<Capabilities />);

    expect(undefinedClasses(container, /^(sr-only|wrap)$/)).toEqual([]);
    expect(globalsCss()).toMatch(/\.w-more\.open/);
  });
});
