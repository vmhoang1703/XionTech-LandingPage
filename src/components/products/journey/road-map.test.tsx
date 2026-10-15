import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/components/layout/locale-link";
import { APPS, appById } from "@/content/apps";
import { productRoad, productRoadVi } from "@/content/products";
import { siteFooter } from "@/content/site-footer";
import { globalsCss } from "@/test-utils/css-classes";
import { RoadMap } from "./road-map";

const COUNT = productRoad.stops.length;

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
let cssSupports: (property: string) => boolean = () => true;
let frames: FrameRequestCallback[] = [];
const cancelFrame = vi.fn();

// Runs the animation frames queued so far.
function nextFrame() {
  const queued = frames;
  frames = [];
  act(() => {
    for (const frame of queued) frame(0);
  });
}

beforeEach(() => {
  reducedMotion = false;
  narrow = false;
  observedThreshold = undefined;
  observed = [];
  disconnect.mockClear();
  layoutChange = undefined;
  removeListener.mockClear();
  cssSupports = () => true;
  frames = [];
  cancelFrame.mockClear();
  // jsdom has no CSS.supports and runs no animation frames.
  vi.stubGlobal("CSS", {
    supports: vi.fn((property: string) => cssSupports(property)),
  });
  vi.stubGlobal("requestAnimationFrame", (frame: FrameRequestCallback) => {
    frames.push(frame);
    return frames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", cancelFrame);
  // A wide window (jsdom's own is 1024x768, under the 1100px breakpoint).
  vi.stubGlobal("innerWidth", 1280);
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
    // No tour: no track (steps) and no road share.
    expect(html).not.toContain("data-tour");
    expect(html).not.toContain("rm-step");
    expect(html).not.toContain("--share");
    expect(html).not.toContain("--rm-stops");
  });

  it("stays static under reduced motion", () => {
    reducedMotion = true;
    mapAt(2000, 2800);
    const { container } = render(<RoadMap />);
    expect(roadmap(container).dataset.reveal).toBe("static");
    expect(roadmap(container).dataset.tour).toBeUndefined();
    expect(observedThreshold).toBeUndefined();
  });

  it("on narrow screens, reveals each stop as it reaches view", () => {
    vi.useFakeTimers();
    narrow = true;
    stopsAt();
    const { container } = render(<RoadMap />);
    const [first, second, third] = stops(container);

    expect(roadmap(container).dataset.reveal).toBe("armed");
    expect(observedThreshold).toBe(0.25);
    // Stops in view at load, even partly, play about 300ms after load and
    // are not observed.
    expect(first.dataset.in).toBeUndefined();
    expect(second.dataset.in).toBeUndefined();
    const [start, finish] = Array.from(
      container.querySelectorAll<HTMLElement>(".rm-end"),
    );
    expect(start.dataset.in).toBeUndefined();
    act(() => vi.advanceTimersByTime(300));
    expect(first.dataset.in).toBe("true");
    expect(second.dataset.in).toBe("true");
    // Start's half bend draws in with stop 1, Finish's with the last stop.
    expect(start.dataset.in).toBe("true");
    expect(finish.dataset.in).toBeUndefined();
    expect(observed).not.toContain(first);
    expect(observed).not.toContain(second);
    expect(observed).toHaveLength(COUNT - 2);
    expect(third.dataset.in).toBeUndefined();

    act(() => intersect(false, third));
    expect(third.dataset.in).toBeUndefined();

    // Any overlap fires the first callback; 10% is under the threshold.
    act(() => intersect(true, third, 0.1));
    expect(third.dataset.in).toBeUndefined();

    act(() => intersect(true, third));
    expect(third.dataset.in).toBe("true");
    expect(finish.dataset.in).toBe("true");
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

  it("renders a card for each of the three products, and each opens the stop modal", () => {
    render(<RoadMap />);
    const cards = screen
      .getAllByRole("button")
      .filter((b) => b.classList.contains("rm-open"));
    expect(cards).toHaveLength(3);
    for (const [i, card] of cards.entries()) {
      fireEvent.click(card);
      const dialog = document.querySelector("dialog") as HTMLDialogElement;
      expect(dialog.open).toBe(true);
      expect(dialog.querySelector("h2")?.textContent).toBe(
        appById(productRoad.stops[i]).fullName,
      );
      act(() => dialog.close());
    }
  });

  it("shows on each card the product's name, its tagline, who it is for and Details", () => {
    const { container } = render(<RoadMap />);
    const tags = ["Parent", "Teacher and staff", "Student"];
    for (const [i, card] of Array.from(
      container.querySelectorAll(".rm-card"),
    ).entries()) {
      const app = appById(productRoad.stops[i]);
      expect(card.querySelector(".rm-title")?.textContent).toBe(
        `${i + 1}. ${app.shortName}`,
      );
      expect(card.querySelector(".rm-text")?.textContent).toBe(app.tagline);
      expect(card.querySelector(".rm-who")?.textContent).toBe(tags[i]);
      expect(card.querySelector(".rm-more")?.textContent).toBe("Details");
      // No school-day time, no app pill, no row of every app.
      expect(card.querySelector("time, .rm-app, .rm-apps")).toBeNull();
    }
  });

  it("makes the last milestone the navy finale", () => {
    const { container } = render(<RoadMap />);
    expect(stops(container).map((stop) => stop.dataset.last)).toEqual([
      undefined,
      undefined,
      "true",
    ]);
    expect(
      roadmapRules().find(({ selector }) =>
        /^\.rm-stop\[data-last="true"\] \.rm-card$/.test(selector),
      )?.body,
    ).toMatch(/background: var\(--color-navy\)/);
  });

  it("speaks Vietnamese on vi: the tag and the tagline, product names in English", () => {
    const { container } = render(
      <LocaleProvider locale="vi">
        <RoadMap />
      </LocaleProvider>,
    );
    const cards = Array.from(container.querySelectorAll(".rm-card"));
    expect(
      cards.map((card) => card.querySelector(".rm-who")?.textContent),
    ).toEqual(["Phụ huynh", "Giáo viên và nhân viên", "Học sinh"]);
    expect(
      cards.map((card) => card.querySelector(".rm-open")?.textContent),
    ).toEqual(["1. Parent Hub", "2. Staff Hub", "3. AI Tutor"]);
    expect(cards[0].querySelector(".rm-text")?.textContent).toBe(
      "Giúp phụ huynh luôn nắm bắt thông tin và gắn kết với đời sống học đường của con.",
    );
    expect(cards[0].querySelector(".rm-more")?.textContent).toBe("Chi tiết");
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
    expect(hiding.length).toBeGreaterThanOrEqual(4);
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
    // The wide road is drawn whole, or (tour) up to the active stop.
    expect(
      rules
        .filter(({ selector }) => /\.rm-draw$/.test(selector))
        .map(({ selector }) => selector),
    ).toEqual([
      ".rm-draw",
      '.rm[data-tour="on"] .rm-draw',
      '.rm[data-tour="on"][data-road="moving"] .rm-draw',
    ]);
    // A focused card is shown whole with its focus ring, even armed.
    const focused = rules.find(({ selector }) =>
      selector.includes(".rm-stop:has(.rm-open:focus-visible) .rm-card"),
    );
    expect(focused?.body).toMatch(/clip-path: none;/);
    expect(focused?.body).toMatch(/transform: none;/);
    const moving = rules.filter(({ body }) => /transition/.test(body));
    expect(moving.length).toBeGreaterThanOrEqual(4);
    for (const { selector } of moving) {
      expect(selector).toMatch(/\[data-tour="on"\]|\[data-in\]/);
    }
    // The timed wide draw-in is gone.
    expect(rules.some(({ body }) => /--delay|--road\b/.test(body))).toBe(false);
    expect(
      rules.some(({ selector }) => selector.includes('[data-reveal="on"]')),
    ).toBe(false);
  });

  it("prints the whole roadmap even before it is revealed", () => {
    const css = globalsCss();
    const start = css.indexOf("/* Products roadmap (2D) */");
    const block = css.slice(start, css.indexOf("/* The stop modal. */", start));
    const print = /@media print \{([\s\S]*?)\n {2}\}/.exec(block)?.[1] ?? "";
    // The road is never hidden: the tour's partial road is screen only.
    expect(print).not.toMatch(/rm-draw|data-tour/);
    expect(print).toMatch(/\.rm-pin \{\s*scale: 1;/);
    expect(print).toMatch(/\.rm-card \{\s*clip-path: none;\s*transform: none;/);
  });
});

describe("RoadMap selection", () => {
  // Narrow: no tour, so only a click selects.
  beforeEach(() => {
    narrow = true;
  });

  const selected = (container: HTMLElement) =>
    stops(container)
      .map((stop, i) => (stop.dataset.selected === "true" ? i : -1))
      .filter((i) => i >= 0);

  it("marks the road's Start before the first stop and its Finish after the last", () => {
    const { container } = render(<RoadMap />);
    const ends = Array.from(container.querySelectorAll<HTMLElement>(".rm-end"));
    expect(ends.map((end) => end.dataset.end)).toEqual(["start", "finish"]);
    expect(ends.map((end) => end.textContent)).toEqual([
      productRoad.start,
      productRoad.finish,
    ]);
    // Decoration: the stops carry the content.
    for (const end of ends) {
      expect(end.getAttribute("aria-hidden")).toBe("true");
    }
    const list = container.querySelector(".rm-stops") as HTMLElement;
    expect(ends[0].nextElementSibling).toBe(list);
    expect(list.nextElementSibling).toBe(ends[1]);
  });

  it("joins the narrow road's pieces straight down at x 40, overlapping", () => {
    const { container } = render(<RoadMap />);
    const pieces = Array.from(container.querySelectorAll(".rm-seg"));
    // Start, three stops, Finish: one continuous road.
    expect(pieces).toHaveLength(COUNT + 2);
    const d = (piece: Element, stroke: string) =>
      piece.querySelector(`.${stroke}`)?.getAttribute("d") ?? "";
    const [start, ...rest] = pieces;
    const finish = rest.pop() as Element;
    // Start leaves its flag and joins stop 1 below, heading down.
    expect(d(start, "rm-asphalt")).toMatch(
      /^M67 50 C 67 75, 40 75, 40 100 L40 102$/,
    );
    for (const stop of rest) {
      // Asphalt runs past both ends further than the edge; the dashes do not.
      expect(d(stop, "rm-asphalt")).toMatch(
        /^M40 -2 L40 0 C 40 25, .* 40 100 L40 102$/,
      );
      expect(d(stop, "rm-edge")).toMatch(/^M40 -1 L40 0 C .* L40 101$/);
      expect(d(stop, "rm-line")).toMatch(/^M40 0 L40 0 C .* L40 100$/);
    }
    expect(d(finish, "rm-asphalt")).toMatch(
      /^M40 -2 L40 0 C 40 25, 67 25, 67 50$/,
    );
  });

  it("speaks Start and Finish in Vietnamese on vi", () => {
    const { container } = render(
      <LocaleProvider locale="vi">
        <RoadMap />
      </LocaleProvider>,
    );
    expect(
      Array.from(container.querySelectorAll(".rm-end-label")).map(
        (el) => el.textContent,
      ),
    ).toEqual([productRoadVi.start, productRoadVi.finish]);
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
      container.querySelectorAll<HTMLButtonElement>(".rm-open")[0],
    );
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    fireEvent.click(
      within(dialog).getByRole("button", {
        name: appById(productRoad.stops[1]).shortName,
      }),
    );
    expect(selected(container)).toEqual([1]);
    act(() => dialog.close());
    expect(selected(container)).toEqual([1]);
  });

  it("colours only the selected pin amber", () => {
    const rules = roadmapRules();
    const amberPins = rules.filter(
      (r) => r.selector.includes(".rm-pin") && /--color-amber\)/.test(r.body),
    );
    expect(amberPins.map((r) => r.selector)).toEqual([
      '.rm-stop[data-selected="true"] .rm-pin',
    ]);
  });
});

describe("RoadMap anchors", () => {
  // The footer's /products#… links and every app's anchor, once each.
  const anchors = new Set([
    ...siteFooter.columns
      .flatMap((column) => column.links)
      .filter((link) => link.href.startsWith("/products#"))
      .map((link) => link.href.replace("/products#", "")),
    ...APPS.map((a) => a.anchor),
  ]);

  // The stop an anchor belongs to: its stop, or (tour) its step's stop. An app
  // with no stop (IoT) has an alias at the start of the roadmap instead.
  const stopOf = (container: HTMLElement, target: HTMLElement) => {
    const step = target.style.getPropertyValue("--step");
    return step === ""
      ? stops(container).indexOf(target.closest(".rm-stop") as HTMLElement)
      : Number(step);
  };

  it.each([
    ["narrow", true, ".rm-stop"],
    ["wide (tour)", false, ".rm-step"],
  ])(
    "%s: puts each app anchor once inside #map, on the stop of that app or at the start",
    (_, isNarrow, holder) => {
      narrow = isNarrow;
      const { container } = render(
        <section id="map">
          <RoadMap />
        </section>,
      );
      const map = container.querySelector("#map") as HTMLElement;
      expect(anchors.size).toBe(APPS.length);
      for (const anchor of anchors) {
        const targets = container.querySelectorAll<HTMLElement>(
          `[id="${anchor}"]`,
        );
        expect(targets, anchor).toHaveLength(1);
        expect(map.contains(targets[0]), anchor).toBe(true);
        const app = APPS.find((a) => a.anchor === anchor);
        expect(app, anchor).toBeDefined();
        const stop = productRoad.stops.findIndex((id) => id === app?.id);
        if (stop < 0) {
          expect(targets[0].matches(".rm-alias"), anchor).toBe(true);
        } else {
          expect(targets[0].matches(holder), anchor).toBe(true);
          expect(stopOf(container, targets[0]), anchor).toBe(stop);
        }
      }
    },
  );

  it("moves the anchors back onto the stops when the layout switches", () => {
    const { container } = render(<RoadMap />);
    expect(container.querySelectorAll(".rm-step[id]")).toHaveLength(COUNT);
    expect(container.querySelector(".rm-stop[id]")).toBeNull();
    act(() => layoutChange?.());
    expect(container.querySelector(".rm-step")).toBeNull();
    expect(container.querySelectorAll(".rm-stop[id]")).toHaveLength(COUNT);
    // IoT's mark stays at the start of the roadmap in both.
    expect(container.querySelectorAll(".rm-alias#iot")).toHaveLength(1);
  });

  it("clears the header when a stop or a step is the scroll target", () => {
    const anchored = roadmapRules().filter((r) =>
      r.selector.split(",").some((s) => s.trim() === ".rm-stop[id]"),
    );
    expect(anchored).toHaveLength(1);
    expect(anchored[0].selector).toContain(".rm-step");
    expect(anchored[0].selector).toContain(".rm-alias");
    expect(anchored[0].body).toMatch(/scroll-margin-top: 16px/);
  });
});

describe("RoadMap scroll tour (wide)", () => {
  // The stage is 700px tall and pins below the header; the track adds one
  // 500px step per stop. `travel` is how far the page has scrolled past the pin.
  const STAGE = 700;
  const STEP = 500;
  const PIN = 96;

  function tourAt(travel: number) {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        const top = PIN - travel;
        const height = STAGE + COUNT * STEP;
        if (this.classList.contains("rm-stage")) {
          const pinned = Math.min(Math.max(PIN, top), top + height - STAGE);
          return {
            top: pinned,
            bottom: pinned + STAGE,
            height: STAGE,
          } as DOMRect;
        }
        return { top, bottom: top + height, height } as DOMRect;
      },
    );
  }

  function scrollTo(travel: number) {
    tourAt(travel);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
  }

  const flagged = (container: HTMLElement, flag: "active" | "selected") =>
    stops(container)
      .map((stop, i) => (stop.dataset[flag] === "true" ? i : -1))
      .filter((i) => i >= 0);
  const active = (container: HTMLElement) => flagged(container, "active");
  const selected = (container: HTMLElement) => flagged(container, "selected");
  const share = (container: HTMLElement) =>
    Number(roadmap(container).style.getPropertyValue("--share"));

  afterEach(() => {
    window.history.replaceState(null, "", "/");
    // jsdom has no scrollIntoView; the deep-link tests add one.
    Reflect.deleteProperty(Element.prototype, "scrollIntoView");
  });

  it("turns on with JavaScript on wide screens: stop 1 active, nothing armed", () => {
    tourAt(-400);
    const { container } = render(<RoadMap />);
    expect(roadmap(container).dataset.tour).toBe("on");
    expect(roadmap(container).dataset.reveal).toBe("static");
    expect(observedThreshold).toBeUndefined();
    expect(container.querySelector(".rm-stage")).not.toBeNull();
    expect(active(container)).toEqual([0]);
    expect(selected(container)).toEqual([0]);
    nextFrame();
    nextFrame();
    expect(share(container)).toBeGreaterThan(0);
  });

  it("steps through the stops as the page scrolls, and back", () => {
    tourAt(0);
    const { container } = render(<RoadMap />);
    nextFrame();
    nextFrame();
    const shares: number[] = [];
    for (let i = 0; i < COUNT; i += 1) {
      scrollTo(i * STEP + STEP / 2);
      expect(active(container)).toEqual([i]);
      expect(selected(container)).toEqual([i]);
      shares.push(share(container));
    }
    for (let i = 1; i < COUNT; i += 1) {
      expect(shares[i]).toBeGreaterThan(shares[i - 1]);
    }
    expect(shares[COUNT - 1]).toBeLessThan(1);

    // Past the last step the stage releases; the last stop stays active.
    scrollTo(COUNT * STEP + 900);
    expect(active(container)).toEqual([COUNT - 1]);

    // Scrolling back steps back, the road too.
    scrollTo(STEP + 10);
    expect(active(container)).toEqual([1]);
    expect(selected(container)).toEqual([1]);
    expect(share(container)).toBe(shares[1]);
  });

  it("a click selects mid-tour; the next step takes the selection", () => {
    tourAt(2 * STEP + 10);
    const { container } = render(<RoadMap />);
    expect(active(container)).toEqual([2]);
    fireEvent.click(
      container.querySelectorAll<HTMLButtonElement>(".rm-open")[1],
    );
    expect(selected(container)).toEqual([1]);
    expect(active(container)).toEqual([2]);
    expect(document.querySelector("dialog")?.open).toBe(true);
    // A scroll within the same step keeps the clicked stop.
    scrollTo(2 * STEP + 200);
    expect(selected(container)).toEqual([1]);
    act(() => (document.querySelector("dialog") as HTMLDialogElement).close());
    scrollTo(10);
    expect(selected(container)).toEqual([0]);
  });

  it("lands a deep link on its step once the tour is on", () => {
    const scrolled = vi.fn();
    Element.prototype.scrollIntoView = scrolled;
    window.history.replaceState(null, "", "#sxp");
    tourAt(0);
    const { container } = render(<RoadMap />);
    expect(scrolled).toHaveBeenCalledTimes(1);
    const target = scrolled.mock.contexts[0] as Element;
    expect(target).toBe(container.querySelector("#sxp"));
    expect(target.matches(".rm-step")).toBe(true);
  });

  it("lands the old #iot link at the start of the roadmap, where IoT has no stop", () => {
    const scrolled = vi.fn();
    Element.prototype.scrollIntoView = scrolled;
    window.history.replaceState(null, "", "#iot");
    tourAt(0);
    const { container } = render(<RoadMap />);
    expect(scrolled).toHaveBeenCalledTimes(1);
    const target = scrolled.mock.contexts[0] as Element;
    expect(target).toBe(container.querySelector("#iot"));
    expect(target.matches(".rm-alias")).toBe(true);
    expect(active(container)).toEqual([0]);
  });

  it("leaves a hash outside the roadmap alone", () => {
    const scrolled = vi.fn();
    Element.prototype.scrollIntoView = scrolled;
    window.history.replaceState(null, "", "#elsewhere");
    tourAt(0);
    render(<RoadMap />);
    expect(scrolled).not.toHaveBeenCalled();
  });

  it("ignores a hash that is not a valid URI (#100%)", () => {
    const scrolled = vi.fn();
    Element.prototype.scrollIntoView = scrolled;
    window.history.replaceState(null, "", "#100%");
    expect(location.hash).toBe("#100%");
    tourAt(0);
    const { container } = render(<RoadMap />);
    expect(roadmap(container).dataset.tour).toBe("on");
    expect(scrolled).not.toHaveBeenCalled();
  });

  it("paints the road empty at Start, then draws it to stop 1 a frame later", () => {
    tourAt(0);
    const { container, unmount } = render(<RoadMap />);
    expect(roadmap(container).dataset.tour).toBe("on");
    expect(roadmap(container).dataset.road).toBeUndefined();
    expect(share(container)).toBe(0);
    // One frame paints the empty road with no transition.
    nextFrame();
    expect(roadmap(container).dataset.road).toBeUndefined();
    nextFrame();
    expect(roadmap(container).dataset.road).toBe("moving");
    expect(share(container)).toBeGreaterThan(0);
    unmount();
  });

  it("draws the road on to Finish past the last stop's anchor, and back", () => {
    tourAt(0);
    const { container } = render(<RoadMap />);
    nextFrame();
    nextFrame();
    // The last stop's anchor (mid-step): the road ends at the stop.
    scrollTo((COUNT - 0.5) * STEP);
    expect(active(container)).toEqual([COUNT - 1]);
    expect(share(container)).toBeLessThan(1);
    scrollTo((COUNT - 0.2) * STEP);
    expect(active(container)).toEqual([COUNT - 1]);
    expect(share(container)).toBe(1);
    scrollTo((COUNT - 0.5) * STEP);
    expect(share(container)).toBeLessThan(1);
  });

  it("cancels the pending frame when unmounted first", () => {
    tourAt(0);
    const { unmount } = render(<RoadMap />);
    unmount();
    expect(cancelFrame).toHaveBeenCalled();
  });

  it("stays static where the browser cannot zoom the stage", () => {
    // `zoom` works, tan(atan2()) does not: both are checked.
    cssSupports = (property) => property === "zoom";
    tourAt(0);
    const { container } = render(<RoadMap />);
    expect(CSS.supports).toHaveBeenCalledWith("zoom", "0.5");
    expect(CSS.supports).toHaveBeenCalledWith(
      "width",
      "calc(1px * tan(atan2(1px, 2px)))",
    );
    expect(roadmap(container).dataset.tour).toBeUndefined();
    expect(roadmap(container).dataset.reveal).toBe("static");
    expect(container.querySelector(".rm-step")).toBeNull();
    expect(container.querySelectorAll(".rm-stop[id]")).toHaveLength(COUNT);
    expect(selected(container)).toEqual([]);
  });

  it("stops following the scroll on a layout switch", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    tourAt(0);
    const { container } = render(<RoadMap />);
    act(() => layoutChange?.());
    expect(roadmap(container).dataset.tour).toBeUndefined();
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
    scrollTo(2 * STEP + 10);
    expect(active(container)).toEqual([]);
  });

  it("clears the tour's selected pin and road motion on a layout switch", () => {
    tourAt(2 * STEP + 10);
    const { container } = render(<RoadMap />);
    nextFrame();
    nextFrame();
    expect(selected(container)).toEqual([2]);
    act(() => layoutChange?.());
    expect(selected(container)).toEqual([]);
    expect(roadmap(container).dataset.road).toBeUndefined();
  });

  it("follows a resize that moves the track", () => {
    tourAt(STEP + 10);
    const { container } = render(<RoadMap />);
    expect(active(container)).toEqual([1]);
    tourAt(2 * STEP + 10);
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    expect(active(container)).toEqual([2]);
  });

  it("keeps the open stop selected while the modal is open", () => {
    tourAt(STEP + 10);
    const { container } = render(<RoadMap />);
    fireEvent.click(
      container.querySelectorAll<HTMLButtonElement>(".rm-open")[2],
    );
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    // The page can still move under the modal (a resize, a script).
    scrollTo(10);
    expect(selected(container)).toEqual([2]);
    expect(active(container)).toEqual([0]);
    act(() => dialog.close());
    expect(selected(container)).toEqual([2]);
    scrollTo(STEP + 10);
    expect(selected(container)).toEqual([1]);
  });

  it("stays static on a wide but short window, where the stage would be too small", () => {
    vi.stubGlobal("innerHeight", 560);
    tourAt(0);
    const { container } = render(<RoadMap />);
    expect(roadmap(container).dataset.tour).toBeUndefined();
    expect(roadmap(container).dataset.reveal).toBe("static");
    expect(container.querySelectorAll(".rm-stop[id]")).toHaveLength(COUNT);
  });

  it("needs about 702px of height: 700 stays static, 720 tours", () => {
    vi.stubGlobal("innerHeight", 700);
    tourAt(0);
    const short = render(<RoadMap />);
    expect(roadmap(short.container).dataset.tour).toBeUndefined();
    short.unmount();
    vi.stubGlobal("innerHeight", 720);
    const tall = render(<RoadMap />);
    expect(roadmap(tall.container).dataset.tour).toBe("on");
  });

  it("does not run under reduced motion: static, nothing selected", () => {
    reducedMotion = true;
    tourAt(0);
    const { container } = render(<RoadMap />);
    scrollTo(2 * STEP + 10);
    expect(roadmap(container).dataset.tour).toBeUndefined();
    expect(container.querySelector(".rm-step")).toBeNull();
    expect(active(container)).toEqual([]);
    expect(selected(container)).toEqual([]);
  });

  it("styles the tour on wide screens only, and hides nothing with it", () => {
    const css = globalsCss();
    const start = css.indexOf("/* Products roadmap (2D) */");
    const block = css.slice(start, css.indexOf("/* The stop modal. */", start));
    const first = block.indexOf('.rm[data-tour="on"]');
    expect(first).toBeGreaterThan(0);
    // Every tour rule sits in the wide, screen-only block (not in print).
    expect(block.lastIndexOf("@media", first)).toBe(
      block.lastIndexOf("@media screen and (min-width: 1100px)", first),
    );
    expect(block.indexOf("@media", first)).toBeGreaterThan(
      block.lastIndexOf('[data-tour="on"]'),
    );
    const tour = roadmapRules().filter(({ selector }) =>
      selector.includes("[data-tour"),
    );
    expect(tour.length).toBeGreaterThanOrEqual(4);
    for (const { body } of tour) {
      expect(body).not.toMatch(
        /opacity|visibility|display: none|scale: 0|clip-path/,
      );
    }
    const rule = (selector: string) =>
      tour.find((r) => r.selector === selector)?.body ?? "";
    expect(rule('.rm[data-tour="on"] .rm-stage')).toMatch(
      /position: sticky;[\s\S]*top: calc\(var\(--spacing-header-room\) \/ var\(--rm-k\)\)/,
    );
    expect(rule('.rm[data-tour="on"] .rm-draw')).toMatch(
      /stroke-dashoffset: calc\(1 - var\(--share\)\)/,
    );
    // The first tour frame snaps the road to stop 1; only then it moves.
    expect(rule('.rm[data-tour="on"] .rm-draw')).not.toMatch(/transition/);
    expect(rule('.rm[data-tour="on"][data-road="moving"] .rm-draw')).toMatch(
      /transition: stroke-dashoffset 700ms var\(--ease-brand\)/,
    );
    // The track is one step per stop: the component sets the count.
    expect(rule('.rm[data-tour="on"]')).toMatch(
      /height: calc\(820px \* var\(--rm-k\) \+ var\(--rm-stops\) \* var\(--rm-step\)\)/,
    );
    // The zoom never drops below 0.72 (or to 0) on a short window.
    expect(rule('.rm[data-tour="on"]')).toMatch(
      /--rm-k: max\(\s*0\.72,\s*min\(/,
    );
    // Zoomed, functional text stays at --text-label (11.5px) or larger.
    for (const part of ["rm-kicker", "rm-who", "rm-text", "rm-more"]) {
      const sized = tour.find((r) =>
        r.selector.split(",").some((one) => one.trim().endsWith(`.${part}`)),
      );
      expect(sized?.body, part).toMatch(
        /font-size: max\([\d.]+rem, calc\(var\(--text-label\) \/ var\(--rm-k\)\)\)/,
      );
    }
    // Zoomed, the focus ring keeps 2px and the title button a 24px target.
    expect(
      tour.find((r) => r.selector.includes(".rm-stage :focus-visible"))?.body,
    ).toMatch(/outline-width: calc\(2px \/ var\(--rm-k\)\)/);
    expect(rule('.rm[data-tour="on"] .rm-open')).toMatch(
      /24px \/ var\(--rm-k\)/,
    );
    // The active card: border, shadow and transform only.
    const card = rule(
      '.rm[data-tour="on"] .rm-stop[data-active="true"] .rm-card',
    );
    const props = Array.from(card.matchAll(/([\w-]+):/g), (m) => m[1]);
    expect(props.length).toBeGreaterThan(0);
    for (const prop of props) {
      expect(prop).toMatch(/^(border-color|box-shadow|transform)$/);
    }
  });
});
