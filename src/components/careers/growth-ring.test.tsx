import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/components/layout/locale-link";
import { GrowthRing } from "./growth-ring";

let reducedMotion = false;
let intersect: (visible: boolean) => void = () => {};
let observedThreshold: number | number[] | undefined;
const disconnect = vi.fn();

beforeEach(() => {
  reducedMotion = false;
  observedThreshold = undefined;
  disconnect.mockClear();
  vi.useFakeTimers();
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
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const current = (container: HTMLElement) =>
  [...container.querySelectorAll(".cycle-node")].findIndex((node) =>
    node.classList.contains("current"),
  );

const dotTransform = (container: HTMLElement) =>
  container.querySelector<HTMLElement>(".cycle-dot")?.style.transform;

describe("GrowthRing", () => {
  it("names the model once for screen readers and hides the drawing", () => {
    const { container } = render(<GrowthRing />);

    const figure = container.querySelector("figure.cycle");
    expect(figure?.getAttribute("aria-label")).toBe(
      "[Placeholder] Growth Learning Model: Curious, Learn, Ask, Grow, Improve",
    );
    expect(
      container.querySelector(".cycle-stage")?.getAttribute("aria-hidden"),
    ).toBe("true");
    expect(container.querySelector("figcaption")?.textContent).toBe(
      "[Placeholder] Growth Learning Model",
    );
    expect(container.querySelector(".cycle-center")?.textContent).toBe(
      "Growth",
    );
    expect(
      [...container.querySelectorAll(".cycle-node")].map((n) => n.textContent),
    ).toEqual(["01Curious", "02Learn", "03Ask", "04Grow", "05Improve"]);
  });

  it("starts on Curious with the dot at the top", () => {
    const { container } = render(<GrowthRing />);

    expect(current(container)).toBe(0);
    expect(dotTransform(container)).toBe(
      "rotate(-90deg) translateX(var(--cycle-radius)) rotate(90deg)",
    );
  });

  it("travels once round the ring when 40% is in view and rests on Improve", () => {
    const { container } = render(<GrowthRing />);
    expect(observedThreshold).toBe(0.4);

    act(() => intersect(false));
    act(() => vi.advanceTimersByTime(5000));
    expect(current(container)).toBe(0);

    act(() => intersect(true));
    expect(disconnect).toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1199));
    expect(current(container)).toBe(0);
    act(() => vi.advanceTimersByTime(1));
    expect(current(container)).toBe(1);
    expect(dotTransform(container)).toBe(
      "rotate(-18deg) translateX(var(--cycle-radius)) rotate(18deg)",
    );
    for (const step of [2, 3, 4]) {
      act(() => vi.advanceTimersByTime(2600));
      expect(current(container)).toBe(step);
    }
    expect(dotTransform(container)).toBe(
      "rotate(198deg) translateX(var(--cycle-radius)) rotate(-198deg)",
    );

    act(() => vi.advanceTimersByTime(20000));
    expect(current(container)).toBe(4);
  });

  it("plays only once, even if it comes into view again", () => {
    const { container } = render(<GrowthRing />);

    act(() => intersect(true));
    act(() => vi.advanceTimersByTime(1200 + 2600 * 3));
    act(() => intersect(true));
    act(() => vi.advanceTimersByTime(1200));
    expect(current(container)).toBe(4);
  });

  it("stays on Curious and never watches the ring with reduced motion", () => {
    reducedMotion = true;
    const { container } = render(<GrowthRing />);

    expect(observedThreshold).toBeUndefined();
    act(() => vi.advanceTimersByTime(20000));
    expect(current(container)).toBe(0);
  });

  it("stops its timers when it unmounts", () => {
    const { container, unmount } = render(<GrowthRing />);

    act(() => intersect(true));
    unmount();
    expect(disconnect).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
    expect(container.querySelector(".cycle")).toBeNull();
  });
});

describe("GrowthRing in Vietnamese", () => {
  it("names the model and its steps in Vietnamese", () => {
    const { container } = render(
      <LocaleProvider locale="vi">
        <GrowthRing />
      </LocaleProvider>,
    );

    expect(
      container.querySelector("figure.cycle")?.getAttribute("aria-label"),
    ).toBe(
      "[Placeholder] Mô hình học hỏi để phát triển: Tò mò, Học hỏi, Đặt câu hỏi, Phát triển, Cải thiện",
    );
  });
});
