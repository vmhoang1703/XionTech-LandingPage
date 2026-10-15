import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOTION_KEY } from "@/lib/motion/motion-preference";
import { ScrollReveal } from "./scroll-reveal";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let callback: Callback;
let observed: Element[];
const unobserve = vi.fn();
const disconnect = vi.fn();
let frames: FrameRequestCallback[];

function stubMotion(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: reduced } as MediaQueryList),
  );
}

// Three items: the first starts on screen, the other two below it.
function mountGroup() {
  document.body.innerHTML = `
    <div data-reveal="">
      <p id="a">A</p><p id="b">B</p><p id="c">C</p>
    </div>`;
  const tops: Record<string, number> = { a: 100, b: 2000, c: 2400 };
  for (const item of document.querySelectorAll("p")) {
    vi.spyOn(item, "getBoundingClientRect").mockReturnValue({
      top: tops[item.id],
    } as DOMRect);
  }
}

// Mounts the script and runs its one-frame-later scan.
function start() {
  const view = render(<ScrollReveal />);
  frames.splice(0).forEach((frame) => frame(0));
  return view;
}

const item = (id: string) => document.getElementById(id) as HTMLElement;

beforeEach(() => {
  pathname = "/";
  observed = [];
  frames = [];
  unobserve.mockClear();
  disconnect.mockClear();
  localStorage.clear();
  vi.stubGlobal("innerHeight", 800);
  vi.stubGlobal("requestAnimationFrame", (frame: FrameRequestCallback) => {
    frames.push(frame);
    return frames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(next: Callback) {
        callback = next;
      }
      observe(target: Element) {
        observed.push(target);
      }
      unobserve = unobserve;
      disconnect = disconnect;
    },
  );
  stubMotion(false);
  mountGroup();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ScrollReveal", () => {
  it("leaves on-screen items alone and marks the rest to wait", () => {
    start();
    expect(item("a").dataset.shown).toBeUndefined();
    expect(item("b").dataset.shown).toBe("wait");
    expect(observed).toEqual([item("b"), item("c")]);
  });

  it("plays items that arrive together one after another, once", () => {
    start();
    callback([
      { isIntersecting: true, target: item("b") },
      { isIntersecting: true, target: item("c") },
    ]);
    expect(item("b").dataset.shown).toBe("play");
    expect(item("b").style.getPropertyValue("--reveal-delay")).toBe("0ms");
    expect(item("c").style.getPropertyValue("--reveal-delay")).toBe("100ms");
    expect(unobserve).toHaveBeenCalledWith(item("c"));
  });

  it("plays arrivals in page order, whatever order they are reported in", () => {
    start();
    callback([
      { isIntersecting: true, target: item("c") },
      { isIntersecting: true, target: item("b") },
    ]);
    expect(item("b").style.getPropertyValue("--reveal-delay")).toBe("0ms");
    expect(item("c").style.getPropertyValue("--reveal-delay")).toBe("100ms");
  });

  it("gives a section with no group of its own one, stepping into a lone wrapper", () => {
    document.body.innerHTML = `
      <main>
        <section id="plain"><div class="wrap"><div id="grid"><p></p><p></p></div></div></section>
        <section id="story" class="mtn"><div class="wrap"><p></p><p></p></div></section>
        <section id="flow"><div class="wrap"><h2></h2><ol class="flow"><li></li></ol></div></section>
        <section id="own"><div class="wrap"><div data-reveal=""><p></p></div></div></section>
      </main>`;
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: 2000,
    } as DOMRect);
    start();
    expect(document.getElementById("grid")?.dataset.reveal).toBe("auto");
    expect(document.querySelectorAll("[data-reveal='auto']")).toHaveLength(1);
    expect(observed).toHaveLength(3);
  });

  it("ignores items leaving the screen", () => {
    start();
    callback([{ isIntersecting: false, target: item("b") }]);
    expect(item("b").dataset.shown).toBe("wait");
  });

  it("caps the delay of a long row", () => {
    document.body.innerHTML = `<div data-reveal="">${"<p></p>".repeat(7)}</div>`;
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: 2000,
    } as DOMRect);
    start();
    callback(observed.map((target) => ({ isIntersecting: true, target })));
    const last = observed.at(-1) as HTMLElement;
    expect(last.style.getPropertyValue("--reveal-delay")).toBe("500ms");
  });

  it("scans again after a navigation, keeping played items and freeing ones now on screen", () => {
    const view = start();
    callback([{ isIntersecting: true, target: item("b") }]);
    vi.spyOn(item("c"), "getBoundingClientRect").mockReturnValue({
      top: 300,
    } as DOMRect);
    observed = [];
    pathname = "/about";
    view.rerender(<ScrollReveal />);
    expect(disconnect).toHaveBeenCalled();
    frames.splice(0).forEach((frame) => frame(0));
    expect(item("b").dataset.shown).toBe("play");
    expect(item("c").dataset.shown).toBeUndefined();
    expect(observed).toEqual([]);
  });

  it("cancels the pending scan on unmount", () => {
    const view = render(<ScrollReveal />);
    view.unmount();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(disconnect).toHaveBeenCalled();
  });

  it("never marks anything under reduced motion", () => {
    stubMotion(true);
    start();
    expect(item("b").dataset.shown).toBeUndefined();
    expect(frames).toEqual([]);
  });

  it("never marks anything after a saved Pause", () => {
    localStorage.setItem(MOTION_KEY, "off");
    start();
    expect(item("b").dataset.shown).toBeUndefined();
  });
});
