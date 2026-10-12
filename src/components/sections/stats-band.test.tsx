import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatsBand, type Stat } from "./stats-band";

// The count itself is tested in count-up.test.tsx.
vi.mock("./count-up", () => ({
  CountUp: ({ value }: { value: string }) => (
    <span data-testid="count-up">{value}</span>
  ),
}));

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

  it("counts up only the figures marked count, in a reveal group", () => {
    render(
      <StatsBand
        label="Experience"
        tone="navy"
        stats={[{ ...STATS[0], count: true }, STATS[1]]}
      />,
    );

    expect(screen.getByTestId("count-up").textContent).toBe("25");
    expect(screen.getAllByTestId("count-up")).toHaveLength(1);
    expect(screen.getByRole("list").dataset.reveal).toBe("");
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

  it("applies sr-only class to h2 when hideLabel is true", () => {
    render(
      <StatsBand label="Experience" stats={STATS} tone="navy" hideLabel />,
    );

    const label = screen.getByRole("heading", { level: 2, name: "Experience" });
    expect(label.classList.contains("sr-only")).toBe(true);
  });

  it("removes border-t and top spacing from list when hideLabel is true", () => {
    render(
      <StatsBand label="Experience" stats={STATS} tone="navy" hideLabel />,
    );

    const list = screen.getByRole("list");
    expect(list.classList.contains("border-t")).toBe(false);
    expect(list.classList.contains("mt-4.5")).toBe(false);
    expect(list.classList.contains("pt-6.5")).toBe(false);
  });

  it("keeps h2 without sr-only and list with border-t when hideLabel is not set", () => {
    render(<StatsBand label="Experience" stats={STATS} tone="navy" />);

    const label = screen.getByRole("heading", { level: 2, name: "Experience" });
    expect(label.classList.contains("sr-only")).toBe(false);

    const list = screen.getByRole("list");
    expect(list.classList.contains("border-t")).toBe(true);
    expect(list.classList.contains("mt-4.5")).toBe(true);
    expect(list.classList.contains("pt-6.5")).toBe(true);
  });

  it("preserves exact default className strings for h2 and ul", () => {
    render(<StatsBand label="Experience" stats={STATS} tone="navy" />);

    const label = screen.getByRole("heading", { level: 2, name: "Experience" });
    expect(label.className).toBe("label");

    const list = screen.getByRole("list");
    expect(list.className).toBe(
      "border-border mt-4.5 grid grid-cols-2 gap-y-7 border-t pt-6.5 sm:grid-cols-3 lg:grid-cols-5",
    );
  });

  it("preserves hideLabel className string for ul", () => {
    render(
      <StatsBand label="Experience" stats={STATS} tone="navy" hideLabel />,
    );

    const list = screen.getByRole("list");
    expect(list.className).toBe(
      "border-border grid grid-cols-2 gap-y-7 sm:grid-cols-3 lg:grid-cols-5",
    );
  });
});
