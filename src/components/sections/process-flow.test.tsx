import { act, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { processFlow } from "@/content/process";
import { ProcessFlow } from "./process-flow";

let intersect: (visible: boolean) => void = () => undefined;
let observedThreshold: number | number[] | undefined;
const disconnect = vi.fn();
let reducedMotion = false;

beforeEach(() => {
  reducedMotion = false;
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
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function flow() {
  return screen.getByRole("list", { name: "4-D process" });
}

describe("ProcessFlow", () => {
  it("renders the request, four steps and launch as one ordered list", () => {
    render(<ProcessFlow flow={processFlow} />);

    expect(flow().tagName).toBe("OL");
    const items = within(flow())
      .getAllByRole("listitem")
      .map((item) => item.textContent);
    expect(items).toEqual([
      "Your requestAn idea, a brief or a requirement.",
      "01DiscoveryWe learn your goals, users and scope.You receiveA clear scope and delivery plan.",
      "02DesignWe shape flows, interfaces and architecture.You receiveA clickable prototype and technical design.",
      "03DevelopmentWe build in agile sprints with open updates.You receiveWorking software every sprint.",
      "04DeploymentWe release, monitor and keep improving.You receiveA live release with ongoing support.",
      "LaunchAnd we keep growing it together.",
    ]);
  });

  it("staggers the steps at 0.3s, 0.85s, 1.4s and 1.95s", () => {
    render(<ProcessFlow flow={processFlow} />);

    const delays = within(flow())
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.closest("li")?.style.transitionDelay);
    expect(delays).toEqual(["0.3s", "0.85s", "1.4s", "1.95s"]);
  });

  it("arms the animation and plays it once when 30% visible", () => {
    render(<ProcessFlow flow={processFlow} />);

    expect(flow().dataset.phase).toBe("armed");
    expect(observedThreshold).toBe(0.3);

    act(() => intersect(false));
    expect(flow().dataset.phase).toBe("armed");

    act(() => intersect(true));
    expect(flow().dataset.phase).toBe("on");
    expect(disconnect).toHaveBeenCalled();
  });

  it("shows everything at once under reduced motion", () => {
    reducedMotion = true;
    render(<ProcessFlow flow={processFlow} />);

    expect(flow().dataset.phase).toBe("static");
  });
  it("renders the step content it is given", () => {
    render(
      <ProcessFlow
        flow={{
          ...processFlow,
          steps: [
            {
              num: "01",
              title: "Scope",
              line: "Agree scope.",
              receive: "A plan.",
            },
          ],
        }}
      />,
    );

    expect(
      within(flow())
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(["Scope"]);
  });

  it("disconnects when unmounted before it is seen", () => {
    const { unmount } = render(<ProcessFlow flow={processFlow} />);

    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
