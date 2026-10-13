import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { globalsCss } from "@/test-utils/css-classes";
import { AutoSwipe, SWIPE_DELAY, SWIPE_ROWS } from "./auto-swipe";

let observed: (visible: boolean) => void;

function stubMedia(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches } as MediaQueryList),
  );
}

// A row of three 300px cards, 310px apart, in a 360px wide box.
function mountRow(scrollLeft = 0, cards = 3) {
  document.body.innerHTML = `<ul class="app-cards">${"<li></li>".repeat(cards)}</ul>`;
  const row = document.querySelector("ul") as HTMLElement;
  [...row.children].forEach((card, i) =>
    Object.defineProperty(card, "offsetLeft", { value: 16 + i * 310 }),
  );
  Object.defineProperties(row, {
    clientWidth: { value: 360 },
    scrollWidth: { value: 16 + cards * 310 + 6 },
    scrollLeft: { value: scrollLeft, writable: true },
  });
  row.scrollTo = vi.fn() as typeof row.scrollTo;
  return row;
}

beforeEach(() => {
  vi.useFakeTimers();
  stubMedia(true);
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        observed = (visible) =>
          callback(
            [
              {
                target: document.querySelector("ul"),
                isIntersecting: visible,
              } as unknown as IntersectionObserverEntry,
            ],
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

describe("AutoSwipe", () => {
  it("moves a row on by one card while it is in view", () => {
    const row = mountRow();
    render(<AutoSwipe />);
    observed(true);
    vi.advanceTimersByTime(SWIPE_DELAY);
    expect(row.scrollTo).toHaveBeenCalledWith({
      left: 310,
      behavior: "smooth",
    });
  });

  it("goes back to the first card after the last", () => {
    const row = mountRow(620);
    render(<AutoSwipe />);
    observed(true);
    vi.advanceTimersByTime(SWIPE_DELAY);
    expect(row.scrollTo).toHaveBeenCalledWith({ left: 0, behavior: "smooth" });
  });

  it("stops out of view and when the visitor touches the row", () => {
    const row = mountRow();
    render(<AutoSwipe />);
    observed(true);
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

  it("does nothing for a row of one card", () => {
    const row = mountRow(0, 1);
    render(<AutoSwipe />);
    observed(true);
    vi.advanceTimersByTime(SWIPE_DELAY);
    expect(row.scrollTo).not.toHaveBeenCalled();
  });

  it("stays off with reduced motion or from 640px", () => {
    stubMedia(false);
    const row = mountRow();
    const { unmount } = render(<AutoSwipe />);
    vi.advanceTimersByTime(SWIPE_DELAY);
    expect(row.scrollTo).not.toHaveBeenCalled();
    unmount();
  });

  it("cleans up on unmount", () => {
    const row = mountRow();
    const { unmount } = render(<AutoSwipe />);
    observed(true);
    unmount();
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
