import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dayRoad } from "@/content/products";
import { globalsCss } from "@/test-utils/css-classes";
import { RoadMap } from "./road-map";

let intersect: (
  visible: boolean,
  target?: Element,
  ratio?: number,
) => void = () => undefined;
let observedThreshold: number | number[] | undefined;
let observed: Element[] = [];
const disconnect = vi.fn();
let reducedMotion = false;
let narrow = false;
let layoutChange: (() => void) | undefined;
const removeListener = vi.fn();

beforeEach(() => {
  reducedMotion = false;
  narrow = false;
  observedThreshold = undefined;
  observed = [];
  disconnect.mockClear();
  layoutChange = undefined;
  removeListener.mockClear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("reduce") ? reducedMotion : narrow,
      addEventListener: (_: string, listener: () => void) => {
        layoutChange = listener;
      },
      removeEventListener: removeListener,
    })),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        observedThreshold = options?.threshold;
        intersect = (visible, target = observed[0], ratio = visible ? 1 : 0) =>
          callback(
            [
              {
                isIntersecting: visible,
                intersectionRatio: ratio,
                target,
              } as IntersectionObserverEntry,
            ],
            this as unknown as IntersectionObserver,
          );
      }
      observe(target: Element) {
        observed.push(target);
      }
      unobserve(target: Element) {
        observed = observed.filter((el) => el !== target);
      }
      disconnect = disconnect;
    },
  );
  // jsdom has no showModal or close.
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.setAttribute("open", "");
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// jsdom has no layout; place the roadmap relative to a 900px-tall window.
function mapAt(top: number, bottom: number) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top,
    bottom,
    height: bottom - top,
  } as DOMRect);
  vi.stubGlobal("innerHeight", 900);
}

// Narrow layout in an 844px window: the first stop is in view, the second
// peeks 14px above the fold, the others are below it.
function stopsAt() {
  const tops = [100, 830, 1200, 1600, 2000, 2400];
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      const i = Array.from(this.parentElement?.children ?? []).indexOf(this);
      const top = this.matches(".rm-stop") ? tops[i] : 100;
      return { top, bottom: top + 300, height: 300 } as DOMRect;
    },
  );
  vi.stubGlobal("innerHeight", 844);
}

function stops(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(".rm-stop"));
}

function roadmap(container: HTMLElement) {
  return container.querySelector(".rm") as HTMLElement;
}

// The rules (selector and body) of the roadmap block in globals.css.
function roadmapRules() {
  const css = globalsCss();
  const start = css.indexOf("/* Products roadmap (2D) */");
  const end = css.indexOf("/* The stop modal. */", start);
  const block = css.slice(start, end).replaceAll(/\/\*[\s\S]*?\*\//g, "");
  return Array.from(block.matchAll(/([^{}]+)\{([^{}]*)\}/g), (m) => ({
    selector: m[1].trim(),
    body: m[2],
  }));
}

describe("RoadMap draw-in", () => {
  it("is static and fully drawn in the server HTML (no JavaScript)", () => {
    const html = renderToString(<RoadMap />);
    expect(html).toContain('data-reveal="static"');
  });

  it("stays static under reduced motion", () => {
    reducedMotion = true;
    mapAt(2000, 2800);
    const { container } = render(<RoadMap />);
    expect(roadmap(container).dataset.reveal).toBe("static");
    expect(observedThreshold).toBeUndefined();
  });

  it("arms below the fold and plays once when 30% visible", () => {
    mapAt(2000, 2800);
    const { container } = render(<RoadMap />);
    expect(roadmap(container).dataset.reveal).toBe("armed");
    expect(observedThreshold).toBe(0.3);

    act(() => intersect(false));
    expect(roadmap(container).dataset.reveal).toBe("armed");

    // The first callback fires at any overlap; 10% is not enough.
    act(() => intersect(true, undefined, 0.1));
    expect(roadmap(container).dataset.reveal).toBe("armed");

    act(() => intersect(true));
    expect(roadmap(container).dataset.reveal).toBe("on");
    expect(disconnect).toHaveBeenCalled();
  });

  it.each([
    ["fully", 100, 800],
    // 50px of an 800px roadmap above the fold.
    ["partly", 850, 1650],
  ])(
    "plays about 300ms after load when %s in view at load",
    (_, top, bottom) => {
      vi.useFakeTimers();
      mapAt(top, bottom);
      const { container } = render(<RoadMap />);
      expect(roadmap(container).dataset.reveal).toBe("armed");
      expect(observedThreshold).toBeUndefined();

      act(() => vi.advanceTimersByTime(299));
      expect(roadmap(container).dataset.reveal).toBe("armed");
      act(() => vi.advanceTimersByTime(1));
      expect(roadmap(container).dataset.reveal).toBe("on");
    },
  );

  it("clears the load timer when unmounted before it plays", () => {
    vi.useFakeTimers();
    mapAt(100, 800);
    const { unmount } = render(<RoadMap />);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("disconnects when unmounted before it is seen", () => {
    mapAt(2000, 2800);
    const { unmount } = render(<RoadMap />);
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("on narrow screens, reveals each stop as it reaches view", () => {
    vi.useFakeTimers();
    narrow = true;
    stopsAt();
    const { container } = render(<RoadMap />);
    const [first, second, third, fourth] = stops(container);

    expect(roadmap(container).dataset.reveal).toBe("armed");
    expect(observedThreshold).toBe(0.25);
    // Stops in view at load, even partly, play about 300ms after load and
    // are not observed.
    expect(first.dataset.in).toBeUndefined();
    expect(second.dataset.in).toBeUndefined();
    act(() => vi.advanceTimersByTime(300));
    expect(first.dataset.in).toBe("true");
    expect(second.dataset.in).toBe("true");
    expect(observed).not.toContain(first);
    expect(observed).not.toContain(second);
    expect(observed).toHaveLength(dayRoad.stops.length - 2);
    expect(third.dataset.in).toBeUndefined();

    act(() => intersect(false, third));
    expect(third.dataset.in).toBeUndefined();

    // Any overlap fires the first callback; 10% is under the threshold.
    act(() => intersect(true, third, 0.1));
    expect(third.dataset.in).toBeUndefined();

    act(() => intersect(true, third));
    expect(third.dataset.in).toBe("true");
    expect(fourth.dataset.in).toBeUndefined();
    expect(observed).not.toContain(third);

    act(() => intersect(true, third));
    expect(stops(container).filter((li) => li.dataset.in)).toHaveLength(3);
  });

  it("shows everything when the layout switches while armed", () => {
    narrow = true;
    stopsAt();
    const { container, unmount } = render(<RoadMap />);
    expect(roadmap(container).dataset.reveal).toBe("armed");

    // Shown at once (static: nothing hidden, nothing moves), no replay.
    act(() => layoutChange?.());
    expect(roadmap(container).dataset.reveal).toBe("static");
    expect(disconnect).toHaveBeenCalled();

    unmount();
    expect(removeListener).toHaveBeenCalledWith("change", layoutChange);
  });

  it("on narrow screens, disconnects on unmount", () => {
    narrow = true;
    stopsAt();
    const { unmount } = render(<RoadMap />);
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("draws the wide road through a uniquely named mask", () => {
    const { container } = render(
      <>
        <RoadMap />
        <RoadMap />
      </>,
    );
    const masks = container.querySelectorAll("mask");
    expect(masks).toHaveLength(2);
    expect(masks[0].id).not.toBe(masks[1].id);
    const draw = masks[0].querySelector("path.rm-draw");
    const road = container.querySelector(".rm-road .rm-asphalt");
    expect(draw?.getAttribute("pathLength")).toBe("1");
    expect(draw?.getAttribute("d")).toBe(road?.getAttribute("d"));
    expect(road?.closest("g")?.getAttribute("mask")).toBe(
      `url(#${masks[0].id})`,
    );
    // The region reaches past the drawing so the road ends are not cut.
    expect(Number(masks[0].getAttribute("x"))).toBeLessThan(-20);
    expect(
      Number(masks[0].getAttribute("x")) +
        Number(masks[0].getAttribute("width")),
    ).toBeGreaterThan(1420);
  });

  it("delays each stop by its place along the road", () => {
    const { container } = render(<RoadMap />);
    expect(roadmap(container).style.getPropertyValue("--road")).toBe("1.6s");
    const delays = Array.from(
      container.querySelectorAll<HTMLElement>(".rm-stop"),
      (li) => li.style.getPropertyValue("--delay"),
    );
    expect(delays).toHaveLength(dayRoad.stops.length);
    const seconds = delays.map((d) => Number.parseFloat(d));
    for (const [i, d] of delays.entries()) {
      expect(d).toMatch(/^\d+(\.\d+)?s$/);
      expect(seconds[i]).toBeGreaterThan(i === 0 ? 0 : seconds[i - 1]);
      expect(seconds[i]).toBeLessThan(1.6);
    }
  });

  it("renders six cards, and each opens the stop modal", () => {
    render(<RoadMap />);
    const cards = screen
      .getAllByRole("button")
      .filter((b) => b.classList.contains("rm-open"));
    expect(cards).toHaveLength(6);
    for (const [i, card] of cards.entries()) {
      fireEvent.click(card);
      const dialog = document.querySelector("dialog") as HTMLDialogElement;
      expect(dialog.open).toBe(true);
      expect(dialog.querySelector("h2")?.textContent).toBe(
        dayRoad.stops[i].title,
      );
      act(() => dialog.close());
    }
  });

  it("hides only under armed, never by opacity, and moves only once shown", () => {
    const rules = roadmapRules();
    // Text keeps full contrast: only the decorative hills set an opacity.
    for (const { selector } of rules.filter(({ body }) =>
      /(?<![\w-])opacity:/.test(body),
    )) {
      expect(selector).toMatch(/^\.rm-hill/);
    }
    const drawIn = rules.filter(({ selector }) =>
      /\[data-reveal|\[data-in\]/.test(selector),
    );
    const hiding = drawIn.filter(({ body }) =>
      /stroke-dashoffset: 1;|clip-path: inset\([^;]*100%|scale: 0;/.test(body),
    );
    expect(hiding.length).toBeGreaterThanOrEqual(5);
    for (const { selector } of hiding) {
      expect(selector).toContain('[data-reveal="armed"]');
    }
    const armed = drawIn.filter(({ selector }) =>
      selector.includes('[data-reveal="armed"]'),
    );
    // A stop that has scrolled in (narrow) is never hidden again.
    for (const { selector } of armed.filter(({ selector }) =>
      /\.rm-(pin|card|seg)$/.test(selector),
    )) {
      expect(selector).toContain(":not([data-in])");
    }
    // Cards wipe in from the side they come from; pins pop from nothing.
    const card = (side: string) =>
      armed.find(
        ({ selector }) =>
          selector.includes(side) && /\.rm-card$/.test(selector),
      )?.body;
    expect(card(":not([data-in]) .rm-card")).toMatch(
      /clip-path: inset\(calc\(100% \+ \d+px\)/,
    );
    expect(card('[data-side="below"]')).toMatch(
      /clip-path: inset\(-?\d+px -?\d+px calc\(100% \+ \d+px\)/,
    );
    expect(
      armed.find(({ selector }) => /\.rm-pin$/.test(selector))?.body,
    ).toMatch(/scale: 0;/);
    // No round cap on the hidden road, or it paints a dot at the start.
    const capped = rules.filter(({ body }) => /stroke-linecap/.test(body));
    const drawCaps = capped.filter(({ selector }) =>
      /\.rm-draw$/.test(selector),
    );
    expect(drawCaps).toHaveLength(1);
    expect(drawCaps[0].selector).toBe(
      '.rm:not([data-reveal="armed"]) .rm-draw',
    );
    // A focused card is shown whole with its focus ring, even armed.
    const focused = rules.find(({ selector }) =>
      selector.includes(".rm-stop:has(.rm-open:focus-visible) .rm-card"),
    );
    expect(focused?.body).toMatch(/clip-path: none;/);
    expect(focused?.body).toMatch(/transform: none;/);
    const moving = rules.filter(({ body }) => /transition/.test(body));
    expect(moving.length).toBeGreaterThanOrEqual(4);
    for (const { selector } of moving) {
      expect(selector).toMatch(/\[data-reveal="on"\]|\[data-in\]/);
    }
    const delayed = rules.filter(({ body }) => /var\(--delay\)/.test(body));
    expect(delayed.length).toBeGreaterThan(0);
    for (const { selector } of delayed) {
      expect(selector).toContain('[data-reveal="on"]');
    }
  });

  it("prints the whole roadmap even before it is revealed", () => {
    const css = globalsCss();
    const start = css.indexOf("/* Products roadmap (2D) */");
    const block = css.slice(start, css.indexOf("/* The stop modal. */", start));
    const print = /@media print \{([\s\S]*?)\n {2}\}/.exec(block)?.[1] ?? "";
    expect(print).toMatch(/\.rm-draw \{\s*stroke-dashoffset: 0;/);
    expect(print).toMatch(/\.rm-pin \{\s*scale: 1;/);
    expect(print).toMatch(/\.rm-card \{\s*clip-path: none;\s*transform: none;/);
  });
});

describe("RoadMap selection", () => {
  const selected = (container: HTMLElement) =>
    stops(container)
      .map((stop, i) => (stop.dataset.selected === "true" ? i : -1))
      .filter((i) => i >= 0);

  it("has no Start or Finish badge on the road", () => {
    const { container } = render(<RoadMap />);
    expect(container.querySelector(".rm-end")).toBeNull();
    expect(container.textContent).not.toContain(dayRoad.start);
    expect(container.textContent).not.toContain(dayRoad.finish);
  });

  it("highlights no pin until a card is clicked, then only that one", () => {
    const { container } = render(<RoadMap />);
    expect(selected(container)).toEqual([]);
    const cards = container.querySelectorAll<HTMLButtonElement>(".rm-open");
    fireEvent.click(cards[2]);
    expect(selected(container)).toEqual([2]);
  });

  it("moves the highlight with the modal and keeps it after closing", () => {
    const { container } = render(<RoadMap />);
    fireEvent.click(
      container.querySelectorAll<HTMLButtonElement>(".rm-open")[2],
    );
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    fireEvent.click(
      within(dialog).getByRole("button", {
        name: new RegExp(dayRoad.stops[3].title),
      }),
    );
    expect(selected(container)).toEqual([3]);
    act(() => dialog.close());
    expect(selected(container)).toEqual([3]);
  });

  it("colours only the selected pin amber", () => {
    const rules = roadmapRules();
    const amberPins = rules.filter(
      (r) => r.selector.includes(".rm-pin") && /--color-amber\)/.test(r.body),
    );
    expect(amberPins.map((r) => r.selector)).toEqual([
      '.rm-stop[data-selected="true"] .rm-pin',
    ]);
    expect(rules.some((r) => r.selector.includes(".rm-end"))).toBe(false);
  });
});
