import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatsBand, type Stat } from "./stats-band";

const STATS: Stat[] = [
  { value: "25", suffix: "+", caption: "Years of leadership" },
  { value: "8", caption: "Service offerings" },
];

describe("StatsBand", () => {
  it("labels the group and shows each final figure with its caption", () => {
    render(<StatsBand label="Experience" stats={STATS} tone="navy" />);

    const group = screen.getByRole("group", { name: "Experience" });
    const items = within(group).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "25+Years of leadership",
      "8Service offerings",
    ]);
  });

  it("uses amber suffixes on navy and amber-text suffixes on light", () => {
    const { rerender } = render(
      <StatsBand label="Experience" stats={STATS} tone="navy" />,
    );
    expect(screen.getByText("+").className).toContain("text-amber");
    expect(screen.getByText("+").className).not.toContain("text-amber-text");

    rerender(<StatsBand label="Experience" stats={STATS} tone="light" />);
    expect(screen.getByText("+").className).toContain("text-amber-text");
  });

  it("marks a figure as placeholder through its data", () => {
    render(
      <StatsBand
        label="Experience"
        tone="light"
        stats={[{ value: "4", caption: "School products", placeholder: true }]}
      />,
    );

    expect(screen.getByText("[Placeholder] School products")).toBeDefined();
  });

  it("styles the label, figures and captions like the prototype", () => {
    render(<StatsBand label="Experience" stats={STATS} tone="navy" />);

    const label = screen.getByRole("heading", { level: 2, name: "Experience" });
    expect(label.classList.contains("label")).toBe(true);
    const items = screen.getAllByRole("listitem");
    const figure = items[0].firstElementChild;
    expect(figure?.classList.contains("text-stat-fluid")).toBe(true);
    expect(figure?.classList.contains("text-heading")).toBe(true);
    expect(items[0].lastElementChild?.classList.contains("max-w-[22ch]")).toBe(
      true,
    );
  });

  it("draws no divider before the first figure", () => {
    render(<StatsBand label="Experience" stats={STATS} tone="navy" />);

    const first = screen.getAllByRole("listitem")[0];
    expect(first.classList.contains("sm:first:border-l-0")).toBe(true);
    expect(first.classList.contains("sm:first:pl-0")).toBe(true);
  });
});
