import { act, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { processFlow } from "@/content/process";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import { ProcessFlow } from "./process-flow";

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
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// jsdom has no layout; place the list relative to a 900px-tall window.
function listAt(top: number, bottom: number) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top,
    bottom,
    height: bottom - top,
  } as DOMRect);
  vi.stubGlobal("innerHeight", 900);
}

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
      .map((heading) => heading.closest("li")?.style.getPropertyValue("--d"));
    // Only the reveal ("on") uses the delay, so hiding is never delayed.
    for (const heading of within(flow()).getAllByRole("heading", {
      level: 3,
    })) {
      expect(heading.closest("li")?.style.transitionDelay).toBe("");
    }
    expect(delays).toEqual(["0.3s", "0.85s", "1.4s", "1.95s"]);
  });

  it("arms the animation and plays it once when 30% visible", () => {
    listAt(2000, 2600);
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
          steps: [{ ...processFlow.steps[0], title: "Scope" }],
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

  it("does not hide steps that are already 30% in view when it loads", () => {
    listAt(100, 600);
    render(<ProcessFlow flow={processFlow} />);

    expect(flow().dataset.phase).toBe("on");
    expect(observedThreshold).toBeUndefined();
  });

  it("still arms a flow that only peeks above the fold, so it reveals on scroll", () => {
    // 50px of a 600px list visible: under 30%.
    listAt(850, 1450);
    render(<ProcessFlow flow={processFlow} />);

    expect(flow().dataset.phase).toBe("armed");
  });

  it("arms a flow that starts below the fold or above the viewport", () => {
    listAt(2000, 2600);
    const { unmount } = render(<ProcessFlow flow={processFlow} />);
    expect(flow().dataset.phase).toBe("armed");
    unmount();

    listAt(-900, -100);
    render(<ProcessFlow flow={processFlow} />);
    expect(flow().dataset.phase).toBe("armed");
  });

  it("renders the prototype track, nodes and illustrated step cards", () => {
    render(<ProcessFlow flow={processFlow} />);

    const list = flow();
    expect(list.classList.contains("flow")).toBe(true);
    const track = list.querySelector(".track");
    expect(track?.getAttribute("aria-hidden")).toBe("true");
    expect(track?.querySelector("i")).not.toBeNull();
    const nodes = list.querySelectorAll(".node");
    expect(nodes).toHaveLength(2);
    expect(nodes[1].classList.contains("end")).toBe(true);
    for (const node of nodes) {
      expect(node.querySelector(".dot svg")?.getAttribute("aria-hidden")).toBe(
        "true",
      );
    }
    const steps = list.querySelectorAll(".step4");
    expect(steps).toHaveLength(4);
    for (const step of steps) {
      const art = step.querySelector(".art");
      expect(art?.getAttribute("aria-hidden")).toBe("true");
      expect(art?.querySelectorAll(".main svg")).toHaveLength(1);
      expect(art?.querySelectorAll(".orb svg")).toHaveLength(3);
      expect(step.querySelector(".num")).not.toBeNull();
      expect(step.querySelector(".get b")?.textContent).toBe("You receive");
    }
  });

  it("uses only classes that globals.css defines, with the delay only on reveal", () => {
    const { container } = render(<ProcessFlow flow={processFlow} />);

    expect(undefinedClasses(container)).toEqual([]);
    expect(globalsCss()).toMatch(
      /\.flow\[data-phase="on"\] \.step4\s*\{\s*transition-delay: var\(--d\);/,
    );
  });
});
