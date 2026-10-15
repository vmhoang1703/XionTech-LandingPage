import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ROTATE_INTERVAL_MS, RotatingWord } from "./rotating-word";

const WORDS = ["vision", "challenges", "ideas", "ambition", "goals"];

function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: reduce })),
  );
}

const active = (c: HTMLElement) =>
  c.querySelector('[data-state="in"]')?.getAttribute("data-word");

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("RotatingWord", () => {
  it("shows the first word at once, then rotates in order and loops", () => {
    stubReducedMotion(false);
    const { container } = render(<RotatingWord words={WORDS} suffix="." />);

    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    const seen = [active(container)];
    for (let i = 0; i < WORDS.length; i++) {
      act(() => vi.advanceTimersByTime(ROTATE_INTERVAL_MS));
      seen.push(active(container));
    }
    expect(seen).toEqual([
      "vision.",
      "challenges.",
      "ideas.",
      "ambition.",
      "goals.",
      "vision.",
    ]);
    expect(
      container.querySelector('[data-state="out"]')?.getAttribute("data-word"),
    ).toBe("goals.");
  });

  it("stays on the first word under reduced motion", () => {
    stubReducedMotion(true);
    const { container } = render(<RotatingWord words={WORDS} suffix="." />);

    act(() => vi.advanceTimersByTime(ROTATE_INTERVAL_MS * 3));
    expect(active(container)).toBe("vision.");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("clears its timer on unmount", () => {
    stubReducedMotion(false);
    const { unmount } = render(<RotatingWord words={WORDS} />);

    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
