import { act, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOTION_KEY } from "@/lib/motion/motion-preference";
import { undefinedClasses } from "@/test-utils/css-classes";
import { HomeScene, SceneMark } from "./home-scene";

let update: () => void;
let options: IntersectionObserverInit | undefined;
const observe = vi.fn();
const disconnect = vi.fn();

function stubMotion(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: reduced } as MediaQueryList),
  );
}

// Two marks; tops are set per test (the screen is 800px, the line at 400).
function mount() {
  const view = render(
    <HomeScene>
      <section>Outcomes</section>
      <SceneMark tone="blue" />
      <section>Why</section>
      <SceneMark tone="mist" />
      <section>Values</section>
    </HomeScene>,
  );
  const scene = view.container.querySelector(".home-scene") as HTMLElement;
  const marks = Array.from(scene.querySelectorAll<HTMLElement>("[data-tone]"));
  return { view, scene, marks };
}

function placeMarks(marks: HTMLElement[], tops: number[]) {
  marks.forEach((mark, index) => {
    vi.spyOn(mark, "getBoundingClientRect").mockReturnValue({
      top: tops[index],
    } as DOMRect);
  });
}

beforeEach(() => {
  observe.mockClear();
  disconnect.mockClear();
  localStorage.clear();
  vi.stubGlobal("innerHeight", 800);
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(next: () => void, init?: IntersectionObserverInit) {
        update = next;
        options = init;
      }
      observe = observe;
      disconnect = disconnect;
    },
  );
  stubMotion(false);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("HomeScene", () => {
  it("has no scene in the server HTML, so the sections keep their backgrounds", () => {
    const html = renderToString(
      <HomeScene>
        <SceneMark tone="mist" />
      </HomeScene>,
    );
    expect(html).not.toContain("data-scene");
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-tone="mist"');
  });

  it("starts on paper while every mark is below the middle line", () => {
    const { scene, marks } = mount();
    placeMarks(marks, [900, 2000]);
    act(update);
    expect(scene.dataset.scene).toBe("paper");
    expect(observe).toHaveBeenCalledTimes(2);
    expect(options?.rootMargin).toBe("0px 0px -50% 0px");
  });

  it("follows the last mark above the middle line, both ways", () => {
    const { scene, marks } = mount();
    placeMarks(marks, [-600, 380]);
    act(update);
    expect(scene.dataset.scene).toBe("mist");
    placeMarks(marks, [100, 1200]);
    act(update);
    expect(scene.dataset.scene).toBe("blue");
    placeMarks(marks, [401, 1500]);
    act(update);
    expect(scene.dataset.scene).toBe("paper");
  });

  it("draws three tone layers and two glows, hidden from screen readers", () => {
    const { view, scene } = mount();
    const layer = scene.querySelector(".scene-bg") as HTMLElement;
    expect(layer.getAttribute("aria-hidden")).toBe("true");
    expect(
      Array.from(layer.querySelectorAll(".scene-tone")).map(
        (tone) => tone.className,
      ),
    ).toEqual([
      "scene-tone scene-paper",
      "scene-tone scene-blue",
      "scene-tone scene-mist",
    ]);
    expect(layer.querySelectorAll(".scene-glow")).toHaveLength(2);
    expect(undefinedClasses(view.container)).toEqual([]);
  });

  it("stays off under reduced motion", () => {
    stubMotion(true);
    const { scene } = mount();
    expect(scene.dataset.scene).toBeUndefined();
    expect(observe).not.toHaveBeenCalled();
  });

  it("stays off after a saved Pause", () => {
    localStorage.setItem(MOTION_KEY, "off");
    const { scene } = mount();
    expect(scene.dataset.scene).toBeUndefined();
    expect(observe).not.toHaveBeenCalled();
  });

  it("stops watching on unmount", () => {
    const { view } = mount();
    view.unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
