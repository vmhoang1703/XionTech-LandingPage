import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dayRoad } from "@/content/products";
import { globalsCss } from "@/test-utils/css-classes";
import { RoadMap } from "./road-map";

let intersect: (visible: boolean) => void = () => undefined;
let observedThreshold: number | number[] | undefined;
const disconnect = vi.fn();
let reducedMotion = false;

beforeEach(() => {
  reducedMotion = false;
  observedThreshold = undefined;
  disconnect.mockClear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: reducedMotion })),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        observedThreshold = options?.threshold;
        intersect = (visible) =>
          callback(
            [{ isIntersecting: visible } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
      }
      observe() {}
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

    act(() => intersect(true));
    expect(roadmap(container).dataset.reveal).toBe("on");
    expect(disconnect).toHaveBeenCalled();
  });

  it("goes straight to on when already 30% in view at load", () => {
    mapAt(100, 800);
    const { container } = render(<RoadMap />);
    expect(roadmap(container).dataset.reveal).toBe("on");
    expect(observedThreshold).toBeUndefined();
  });

  it("disconnects when unmounted before it is seen", () => {
    mapAt(2000, 2800);
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

  it("dims and masks only under armed, and transitions only under on", () => {
    const rules = roadmapRules();
    const hiding = rules.filter(({ body }) =>
      /opacity:|stroke-dashoffset: 1|clip-path: inset\([^;]*100%|(?<![\w-])(?:transform|scale):/.test(
        body,
      ),
    );
    const armed = hiding.filter(({ selector }) =>
      selector.includes('[data-reveal="armed"]'),
    );
    expect(armed.length).toBeGreaterThanOrEqual(4);
    for (const { selector, body } of hiding) {
      if (selector.includes('[data-reveal="armed"]')) continue;
      // Outside armed, only the decorative hills set an opacity.
      expect(`${selector} {${body}}`).toMatch(/^\.rm-hill/);
    }
    const dims = armed.flatMap(({ body }) =>
      Array.from(body.matchAll(/opacity:\s*([\d.]+)/g), (m) => Number(m[1])),
    );
    expect(dims.length).toBeGreaterThanOrEqual(2);
    for (const opacity of dims) expect(opacity).toBeGreaterThanOrEqual(0.35);
    const moving = rules.filter(({ body }) => /transition/.test(body));
    expect(moving.length).toBeGreaterThanOrEqual(4);
    for (const { selector } of moving) {
      expect(selector).toContain('[data-reveal="on"]');
    }
    const delayed = rules.filter(({ body }) => /var\(--delay\)/.test(body));
    expect(delayed.length).toBeGreaterThan(0);
    for (const { selector } of delayed) {
      expect(selector).toContain('[data-reveal="on"]');
    }
  });
});
