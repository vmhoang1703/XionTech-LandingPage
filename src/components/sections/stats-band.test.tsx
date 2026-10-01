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
});
