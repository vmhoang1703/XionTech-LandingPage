import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NewsFilters, type FilterItem } from "./news-filters";

const item = (slug: string, category: string | null): FilterItem => ({
  key: slug,
  category,
  node: <article>{slug}</article>,
});

const items = [
  item("p1", "product"),
  item("t1", "team"),
  item("t2", "team"),
  item("c1", "company"),
  item("x1", null),
];

const chip = (name: string) => screen.getByRole("button", { name });
const shown = () => screen.queryAllByRole("article").map((a) => a.textContent);
const live = () => document.querySelector("[aria-live]");

describe("NewsFilters", () => {
  it("starts on All: every card, All pressed, the others not, the count in a polite live region", () => {
    render(<NewsFilters items={items} />);

    expect(screen.getByRole("group", { name: "Filter stories" })).toBeTruthy();
    expect(shown()).toEqual(["p1", "t1", "t2", "c1", "x1"]);
    expect(chip("All").getAttribute("aria-pressed")).toBe("true");
    for (const name of ["Product", "Company", "Schools", "Team"]) {
      expect(chip(name).getAttribute("aria-pressed")).toBe("false");
      expect(chip(name).getAttribute("type")).toBe("button");
    }
    expect(live()?.getAttribute("aria-live")).toBe("polite");
    expect(live()?.className).toBe("sr-only");
    expect(live()?.textContent).toBe("Showing 5 stories");
    expect(screen.queryByText("No stories in this category yet.")).toBeNull();
  });

  it("shows only Team cards when Team is pressed, and announces the plural count", () => {
    render(<NewsFilters items={items} />);
    fireEvent.click(chip("Team"));

    expect(shown()).toEqual(["t1", "t2"]);
    expect(chip("Team").getAttribute("aria-pressed")).toBe("true");
    expect(chip("All").getAttribute("aria-pressed")).toBe("false");
    expect(live()?.textContent).toBe("Showing 2 stories");
  });

  it("uses the singular for one story", () => {
    render(<NewsFilters items={items} />);
    fireEvent.click(chip("Product"));

    expect(shown()).toEqual(["p1"]);
    expect(live()?.textContent).toBe("Showing 1 story");
  });

  it("does nothing when the active chip is pressed again", () => {
    render(<NewsFilters items={items} />);
    fireEvent.click(chip("Team"));
    fireEvent.click(chip("Team"));

    expect(shown()).toEqual(["t1", "t2"]);
    expect(chip("Team").getAttribute("aria-pressed")).toBe("true");
  });

  it("shows the empty panel for a category with no stories; Show all resets to All and focuses it", () => {
    render(<NewsFilters items={items} />);
    fireEvent.click(chip("Schools"));

    expect(shown()).toEqual([]);
    expect(document.querySelector(".news-grid")).toBeNull();
    expect(screen.getByText("No stories in this category yet.")).toBeTruthy();
    expect(live()?.textContent).toBe("Showing 0 stories");

    fireEvent.click(chip("Show all"));

    expect(shown()).toEqual(["p1", "t1", "t2", "c1", "x1"]);
    expect(chip("All").getAttribute("aria-pressed")).toBe("true");
    expect(document.activeElement).toBe(chip("All"));
    expect(screen.queryByText("No stories in this category yet.")).toBeNull();
  });

  it("with no stories at all shows the empty text without Show all", () => {
    render(<NewsFilters items={[]} />);

    expect(screen.getByText("No stories in this category yet.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Show all" })).toBeNull();
    expect(live()?.textContent).toBe("Showing 0 stories");
  });
});
