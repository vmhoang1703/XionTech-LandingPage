import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApplyBar } from "./apply-bar";

let report: (isIntersecting: boolean, top: number) => void;
const disconnect = vi.fn();

beforeEach(() => {
  disconnect.mockClear();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        report = (isIntersecting, top) =>
          act(() =>
            callback(
              [
                {
                  isIntersecting,
                  boundingClientRect: { top },
                } as IntersectionObserverEntry,
              ],
              this as unknown as IntersectionObserver,
            ),
          );
      }
      observe() {}
      disconnect = disconnect;
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function mount(target = "apply") {
  const view = render(
    <>
      <div id="apply" />
      <ApplyBar target={target} />
    </>,
  );
  const bar = view.container.querySelector(".apply-bar") as HTMLElement;
  return { view, bar };
}

describe("ApplyBar", () => {
  it("starts hidden and inert, as a link to the form", () => {
    const { bar } = mount();
    expect(bar.hasAttribute("data-shown")).toBe(false);
    expect(bar.hasAttribute("inert")).toBe(true);
    const link = bar.querySelector("a");
    expect(link?.getAttribute("href")).toBe("#apply");
    expect(link?.textContent).toBe("Apply for this role");
  });

  it("shows while the form is below the screen, then hides at the form", () => {
    const { bar } = mount();
    report(false, 900);
    expect(bar.hasAttribute("data-shown")).toBe(true);
    expect(bar.hasAttribute("inert")).toBe(false);
    expect(
      screen.getByRole("link", { name: "Apply for this role" }),
    ).toBeTruthy();
    report(true, 300);
    expect(bar.hasAttribute("data-shown")).toBe(false);
  });

  it("stays hidden once the form is above the screen", () => {
    const { bar } = mount();
    report(false, -400);
    expect(bar.hasAttribute("data-shown")).toBe(false);
  });

  it("stops watching on unmount, and does nothing without the form", () => {
    const first = mount();
    first.view.unmount();
    expect(disconnect).toHaveBeenCalled();
    disconnect.mockClear();
    const { bar } = mount("missing");
    expect(bar.hasAttribute("inert")).toBe(true);
  });
});
