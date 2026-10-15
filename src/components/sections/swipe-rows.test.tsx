import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOTION_KEY } from "@/lib/motion/motion-preference";
import { globalsCss } from "@/test-utils/css-classes";
import { SWIPE_DELAY, SWIPE_ROWS, SwipeRows } from "./swipe-rows";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

let observed: (visible: boolean) => void;

// Phone width unless `wide`; reduced motion when `reduced`.
function stubMedia({ wide = false, reduced = false } = {}) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("reduce") ? reduced : !wide,
    })),
  );
}

// A row of `cards` 300px cards, 310px apart, in a 360px wide box.
function mountRow(cards = 3) {
  document.body.innerHTML = `<ul class="app-cards">${"<li></li>".repeat(cards)}</ul>`;
  const row = document.querySelector("ul") as HTMLElement;
  [...row.children].forEach((card, i) =>
    Object.defineProperty(card, "offsetLeft", { value: 16 + i * 310 }),
  );
  Object.defineProperties(row, {
    clientWidth: { value: 360 },
    scrollWidth: { value: 16 + cards * 310 + 6 },
    scrollLeft: { value: 0, writable: true },
  });
  row.scrollTo = vi.fn() as typeof row.scrollTo;
  return row;
}

const dots = () => [...document.querySelectorAll(".swipe-dots button")];
const active = (row: HTMLElement) =>
  [...row.children].findIndex((card) => card.hasAttribute("data-active"));

function scrollTo(row: HTMLElement, left: number) {
  row.scrollLeft = left;
  fireEvent.scroll(row);
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  stubMedia();
  vi.stubGlobal("requestAnimationFrame", (frame: FrameRequestCallback) => {
    frame(0);
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        observed = (visible) =>
          callback(
            [{ isIntersecting: visible } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
      }
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("SwipeRows", () => {
  it("puts one dot a card under the row, the first card in front", () => {
    const row = mountRow();
    render(<SwipeRows />);
    expect(row.nextElementSibling?.className).toBe("swipe-dots");
    expect(dots()).toHaveLength(3);
    expect(dots()[1].getAttribute("aria-label")).toBe("Show card 2 of 3");
    expect(dots().map((dot) => dot.getAttribute("aria-current"))).toEqual([
      "true",
      "false",
      "false",
    ]);
    expect(active(row)).toBe(0);
    expect(row.dataset.swipe).toBe("move");
  });

  it("moves the amber dot and the front card with the scroll", () => {
    const row = mountRow();
    render(<SwipeRows />);
    scrollTo(row, 300);
    expect(active(row)).toBe(1);
    const strip = row.nextElementSibling as HTMLElement;
    expect(strip.style.getPropertyValue("--i")).toBe("1");
    expect(dots()[1].getAttribute("aria-current")).toBe("true");
    scrollTo(row, 590);
    expect(active(row)).toBe(2);
  });

  it("moves on by one card while in view, back to the first after the last", () => {
    const row = mountRow();
    render(<SwipeRows />);
    observed(true);
    observed(true);
    vi.advanceTimersByTime(SWIPE_DELAY);
    expect(row.scrollTo).toHaveBeenLastCalledWith({
      left: 310,
      behavior: "smooth",
    });
    row.scrollLeft = 590;
    vi.advanceTimersByTime(SWIPE_DELAY);
    expect(row.scrollTo).toHaveBeenLastCalledWith({
      left: 0,
      behavior: "smooth",
    });
  });

  it("stops out of view, and for good once the visitor touches the row", () => {
    const row = mountRow();
    render(<SwipeRows />);
    observed(true);
    observed(false);
    vi.advanceTimersByTime(SWIPE_DELAY);
    expect(row.scrollTo).not.toHaveBeenCalled();
    observed(true);
    fireEvent.pointerDown(row);
    observed(true);
    vi.advanceTimersByTime(SWIPE_DELAY * 2);
    expect(row.scrollTo).not.toHaveBeenCalled();
  });

  it("goes to a card from its dot and hands the row over", () => {
    const row = mountRow();
    render(<SwipeRows />);
    observed(true);
    fireEvent.click(dots()[2]);
    expect(row.scrollTo).toHaveBeenCalledWith({
      left: 620,
      behavior: "smooth",
    });
    fireEvent.click(row.nextElementSibling as HTMLElement);
    observed(true);
    vi.advanceTimersByTime(SWIPE_DELAY);
    expect(row.scrollTo).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["reduced motion", () => stubMedia({ reduced: true })],
    ["a saved Pause", () => localStorage.setItem(MOTION_KEY, "off")],
  ])("keeps the dots but stays still with %s", (_, setUp) => {
    setUp();
    const row = mountRow();
    render(<SwipeRows />);
    expect(row.dataset.swipe).toBe("still");
    observed(true);
    vi.advanceTimersByTime(SWIPE_DELAY);
    expect(row.scrollTo).not.toHaveBeenCalled();
    fireEvent.click(dots()[1]);
    expect(row.scrollTo).toHaveBeenCalledWith({ left: 310, behavior: "auto" });
  });

  it("lets a keyboard reach a row with nothing to focus inside, until it is torn down", () => {
    const row = mountRow();
    const { unmount } = render(<SwipeRows />);
    expect(row.getAttribute("tabindex")).toBe("0");
    unmount();
    expect(row.hasAttribute("tabindex")).toBe(false);
  });

  it("counts a tabindex=-1 child as nothing to focus, and keeps a row's own tabindex", () => {
    const row = mountRow();
    row.firstElementChild?.setAttribute("tabindex", "-1");
    const { unmount } = render(<SwipeRows />);
    expect(row.getAttribute("tabindex")).toBe("0");
    unmount();
    const own = mountRow();
    own.setAttribute("tabindex", "-1");
    const second = render(<SwipeRows />);
    expect(own.getAttribute("tabindex")).toBe("-1");
    second.unmount();
    expect(own.getAttribute("tabindex")).toBe("-1");
  });

  it("leaves a row whose cards hold links out of the tab order", () => {
    const row = mountRow();
    row.firstElementChild?.insertAdjacentHTML(
      "beforeend",
      '<a href="/x">x</a>',
    );
    render(<SwipeRows />);
    expect(row.hasAttribute("tabindex")).toBe(false);
  });

  it("skips the 4-D track and nodes", () => {
    const row = mountRow(3);
    const track = document.createElement("li");
    track.className = "track";
    row.prepend(track);
    render(<SwipeRows />);
    expect(dots()).toHaveLength(3);
    expect(track.hasAttribute("data-active")).toBe(false);
  });

  it("leaves a row of one card alone", () => {
    const row = mountRow(1);
    render(<SwipeRows />);
    expect(row.dataset.swipe).toBeUndefined();
    expect(dots()).toHaveLength(0);
  });

  it("does nothing from 640px or with no matchMedia", () => {
    stubMedia({ wide: true });
    mountRow();
    const { unmount } = render(<SwipeRows />);
    expect(dots()).toHaveLength(0);
    unmount();
    vi.stubGlobal("matchMedia", undefined);
    render(<SwipeRows />);
    expect(dots()).toHaveLength(0);
  });

  it("cleans up on unmount", () => {
    const row = mountRow();
    const { unmount } = render(<SwipeRows />);
    observed(true);
    unmount();
    expect(dots()).toHaveLength(0);
    expect(row.dataset.swipe).toBeUndefined();
    expect(active(row)).toBe(-1);
    vi.advanceTimersByTime(SWIPE_DELAY);
    expect(row.scrollTo).not.toHaveBeenCalled();
  });

  it("targets the same rows as the phone swipe CSS", () => {
    expect(globalsCss()).toContain(
      SWIPE_ROWS.replaceAll(", ", ",\n  ").replace(
        ".sgrid-row",
        ".sgrid-row {",
      ),
    );
  });
});
