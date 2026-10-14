import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Audience } from "@/lib/news/audience";
import { LocaleProvider } from "@/components/layout/locale-link";
import { NewsFilters, type FilterItem } from "./news-filters";

const item = (slug: string, audience: Audience | null): FilterItem => ({
  key: slug,
  category: audience,
  node: <a href={`/news/${slug}`}>{slug}</a>,
});

// Newest first, as the page passes them.
const items = [
  item("p1", "parents"),
  item("t1", "students"),
  item("t2", "students"),
  item("c1", "company"),
  item("x1", null),
];

// The viewport width the stubbed matchMedia answers for; listeners let a
// test "resize" the window.
let width = 1280;
const listeners = new Set<() => void>();

function resize(to: number) {
  width = to;
  act(() => {
    for (const listener of listeners) listener();
  });
}

beforeEach(() => {
  // jsdom has no IntersectionObserver: the cards never unfold here.
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  width = 1280;
  listeners.clear();
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: width <= Number(/(\d+)px/.exec(query)?.[1]),
    addEventListener: (_: string, listener: () => void) =>
      listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) =>
      listeners.delete(listener),
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const chip = (name: string) => screen.getByRole("button", { name });
const shown = () =>
  screen.queryAllByRole("link").map((card) => card.textContent);
// The grid cells that hold the lead card.
const leads = () =>
  Array.from(document.querySelectorAll(".s-lead"), (cell) => cell.textContent);
const cells = () => Array.from(document.querySelectorAll("#newsGrid > div"));
const live = () => document.querySelector("[aria-live]");
const EMPTY = "No stories are available in this category yet.";

describe("NewsFilters", () => {
  it("pressing Parents shows only parent stories, and the newest is the lead when it is the only one", () => {
    render(
      <NewsFilters
        items={[
          item("s1", "schools"),
          item("p1", "parents"),
          item("s2", "schools"),
        ]}
      />,
    );
    fireEvent.click(chip("Parents"));

    expect(shown()).toEqual(["p1"]);
    expect(leads()).toEqual(["p1"]);
  });

  it("starts on All: every card in the grid, All pressed, the others not, the count in a polite live region", () => {
    render(<NewsFilters items={items} />);

    const group = screen.getByRole("group", {
      name: "Filter stories by audience",
    });
    expect(group.className).toBe("filters");
    expect(group.parentElement?.className).toBe("news-bar");
    expect(
      screen.getByText(
        "Stories from the newXion newsroom; those marked [Placeholder] are samples.",
      ).className,
    ).toBe("sample");
    expect(document.querySelector("#newsGrid")?.className).toBe("sgrid");
    expect(shown()).toEqual(["p1", "t1", "t2", "c1", "x1"]);
    expect(chip("All").getAttribute("aria-pressed")).toBe("true");
    for (const name of ["Schools", "Students", "Parents", "Company"]) {
      expect(chip(name).getAttribute("aria-pressed")).toBe("false");
      expect(chip(name).getAttribute("type")).toBe("button");
    }
    expect(live()?.getAttribute("aria-live")).toBe("polite");
    expect(live()?.className).toBe("sr-only");
    expect(live()?.textContent).toBe("Showing 5 stories");
    expect(screen.queryByText(EMPTY)).toBeNull();
  });

  it("at 3 columns makes the first card the lead when a full row of 3 follows", () => {
    render(<NewsFilters items={items} />);

    expect(leads()).toEqual(["p1"]);
    expect(cells()).toHaveLength(5);
    expect(cells()[0].className).toBe("s-lead");
    expect(cells()[1].className).toBe("");
  });

  it("makes no lead when the cards after it would not fill a row", () => {
    render(<NewsFilters items={items.slice(0, 3)} />);

    expect(leads()).toEqual([]);
  });

  it("recalculates the lead on resize: 2 columns at 900px, 1 column at 390px", () => {
    render(<NewsFilters items={items.slice(0, 3)} />);
    expect(leads()).toEqual([]);

    resize(900);
    expect(leads()).toEqual(["p1"]);

    resize(390);
    expect(leads()).toEqual(["p1"]);

    resize(1280);
    expect(leads()).toEqual([]);
  });

  it("stops listening for resizes once it is gone", () => {
    const { unmount } = render(<NewsFilters items={items} />);
    expect(listeners.size).toBeGreaterThan(0);

    unmount();
    expect(listeners.size).toBe(0);
  });

  it("shows only Students cards when Students is pressed, with no lead for two at 3 columns, and announces the plural count", () => {
    render(<NewsFilters items={items} />);
    fireEvent.click(chip("Students"));

    expect(shown()).toEqual(["t1", "t2"]);
    expect(leads()).toEqual([]);
    expect(chip("Students").getAttribute("aria-pressed")).toBe("true");
    expect(chip("All").getAttribute("aria-pressed")).toBe("false");
    expect(live()?.textContent).toBe("Showing 2 stories");
  });

  it("uses the singular for one story", () => {
    render(<NewsFilters items={items} />);
    fireEvent.click(chip("Company"));

    expect(shown()).toEqual(["c1"]);
    expect(live()?.textContent).toBe("Showing 1 story");
  });

  it("does nothing when the active chip is pressed again", () => {
    render(<NewsFilters items={items} />);
    fireEvent.click(chip("Students"));
    fireEvent.click(chip("Students"));

    expect(shown()).toEqual(["t1", "t2"]);
    expect(chip("Students").getAttribute("aria-pressed")).toBe("true");
  });

  it("shows the empty panel for an audience with no stories; Show all resets to All and focuses it", () => {
    render(<NewsFilters items={items} />);
    fireEvent.click(chip("Schools"));

    expect(document.querySelector("#newsGrid")).toBeNull();
    expect(screen.getByText(EMPTY)).toBeTruthy();
    expect(live()?.textContent).toBe("Showing 0 stories");

    fireEvent.click(chip("Show all"));

    expect(shown()).toEqual(["p1", "t1", "t2", "c1", "x1"]);
    expect(chip("All").getAttribute("aria-pressed")).toBe("true");
    expect(document.activeElement).toBe(chip("All"));
    expect(screen.queryByText(EMPTY)).toBeNull();
  });

  it("with no stories at all shows the empty text without Show all", () => {
    render(<NewsFilters items={[]} />);

    expect(screen.getByText(EMPTY)).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Show all" })).toBeNull();
    expect(live()?.textContent).toBe("Showing 0 stories");
  });
});

describe("NewsFilters in Vietnamese", () => {
  it("labels the chips, empty state and count in Vietnamese", () => {
    render(
      <LocaleProvider locale="vi">
        <NewsFilters items={[item("p1", "parents")]} />
      </LocaleProvider>,
    );

    expect(
      screen.getAllByRole("button").map((button) => button.textContent),
    ).toEqual(["Tất cả", "Trường học", "Học sinh", "Phụ huynh", "Công ty"]);
    fireEvent.click(chip("Học sinh"));
    expect(screen.getByText("Chưa có tin nào trong mục này.")).toBeTruthy();
    expect(chip("Xem tất cả")).toBeTruthy();
    expect(live()?.textContent).toBe("Đang hiển thị 0 tin");
  });
});

// Amber's unfold (lead, 2026-10-13): the script marks the grid, then each card
// as it comes into view, with a delay by its column.
describe("NewsFilters card unfold", () => {
  let arrive: (cards: Element[]) => void = () => undefined;
  const disconnect = vi.fn();

  beforeEach(() => {
    disconnect.mockClear();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          arrive = (cards) =>
            act(() =>
              callback(
                [
                  ...cards.map(
                    (target) =>
                      ({
                        target,
                        isIntersecting: true,
                      }) as IntersectionObserverEntry,
                  ),
                  {
                    target: cards[0],
                    isIntersecting: false,
                  } as IntersectionObserverEntry,
                ],
                this as unknown as IntersectionObserver,
              ),
            );
        }
        observe() {}
        unobserve() {}
        disconnect = disconnect;
      },
    );
  });

  const four = [
    item("a", "schools"),
    item("b", "parents"),
    item("c", "schools"),
    item("d", "company"),
  ];

  it("marks each arriving card, a row left to right after the lead", () => {
    render(<NewsFilters items={four} />);
    const grid = document.getElementById("newsGrid");
    expect(grid?.hasAttribute("data-unfold")).toBe(true);
    expect(cells().some((cell) => cell.hasAttribute("data-in"))).toBe(false);
    arrive(cells());
    expect(cells().every((cell) => cell.hasAttribute("data-in"))).toBe(true);
    expect(
      cells().map((cell) =>
        (cell as HTMLElement).style.getPropertyValue("--unfold-delay"),
      ),
    ).toEqual(["0ms", "0ms", "260ms", "520ms"]);
  });

  it("replays after a filter change and stops watching the old cards", () => {
    render(<NewsFilters items={four} />);
    arrive(cells());
    fireEvent.click(chip("Schools"));
    expect(disconnect).toHaveBeenCalled();
    expect(cells().some((cell) => cell.hasAttribute("data-in"))).toBe(false);
  });

  it("does not unfold with reduced motion", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("reduce"),
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }));
    render(<NewsFilters items={four} />);
    expect(
      document.getElementById("newsGrid")?.hasAttribute("data-unfold"),
    ).toBe(false);
  });
});
