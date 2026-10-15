import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOTION_KEY } from "@/lib/motion/motion-preference";
import type { RoadApp } from "@/content/products";
import { POINTS } from "../journey/road-geometry";
import { ProductScene } from "./product-scene";

let reducedMotion = false;
let smallScreen = false;
const setPointerCapture = vi.fn();

beforeEach(() => {
  reducedMotion = false;
  smallScreen = false;
  localStorage.clear();
  setPointerCapture.mockClear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("reduce") ? reducedMotion : smallScreen,
    })),
  );
  vi.stubGlobal("innerWidth", 1000);
  vi.stubGlobal("innerHeight", 800);
  // jsdom has no pointer capture.
  Element.prototype.setPointerCapture = setPointerCapture;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function setup(index = 1, app: RoadApp = "staff-hub") {
  const view = render(<ProductScene index={index} app={app} />);
  const root = view.container.querySelector(".rd-scene") as HTMLElement;
  return { ...view, root };
}

const copies = (root: HTMLElement, selector: string) =>
  root.querySelector(selector)?.querySelectorAll(".dv-slice");

describe("ProductScene", () => {
  it("is decoration: hidden from assistive technology, with nothing to focus", () => {
    const { root } = setup();
    expect(root.getAttribute("aria-hidden")).toBe("true");
    expect(root.querySelector("button, a, [tabindex]")).toBeNull();
  });

  it("stands Parent Hub on a phone: one slab, a notch, no keyboard", () => {
    const { root } = setup(0, "parent-hub");
    expect(root.querySelector(".dv")?.getAttribute("data-kind")).toBe("phone");
    expect(root.querySelectorAll(".dv-slab")).toHaveLength(1);
    expect(root.querySelector(".dv-body .dv-notch")).not.toBeNull();
    expect(root.querySelector(".dv-deck")).toBeNull();
  });

  it("stands Staff Hub on a laptop: a screen on a hinge over a keyboard", () => {
    const { root } = setup(1, "staff-hub");
    expect(root.querySelector(".dv")?.getAttribute("data-kind")).toBe("laptop");
    expect(root.querySelector(".dv-hinge .dv-lid .dv-screen")).not.toBeNull();
    expect(root.querySelector(".dv-deck .dv-keys")).not.toBeNull();
    expect(root.querySelector(".dv-deck .dv-pad")).not.toBeNull();
    expect(root.querySelectorAll(".dv-slab")).toHaveLength(2);
  });

  it("stands AI Tutor on a desktop monitor: a head on a neck over a foot", () => {
    const { root } = setup(2, "ai-tutor");
    expect(root.querySelector(".dv")?.getAttribute("data-kind")).toBe(
      "monitor",
    );
    expect(root.querySelector(".dv-head .dv-screen")).not.toBeNull();
    expect(root.querySelector(".dv-neck")).not.toBeNull();
    expect(root.querySelector(".dv-foot")).not.toBeNull();
    expect(root.querySelectorAll(".dv-slab")).toHaveLength(3);
  });

  it("shows only the screen of the product it stands", () => {
    const { root } = setup(0, "parent-hub");
    expect(root.querySelectorAll(".dv-screen")).toHaveLength(1);
    expect(root.querySelector(".ws-name")?.textContent).toBe("Parent Hub");
  });

  it("gives a slab thickness: flat copies behind its front face, farthest first, the face painted last", () => {
    const { root } = setup(0, "parent-hub");
    const body = root.querySelector(".dv-body") as HTMLElement;
    const layers = Array.from(copies(root, ".dv-body") ?? []);
    expect(layers).toHaveLength(12);
    expect(
      layers.map((el) => (el as HTMLElement).style.getPropertyValue("--k")),
    ).toEqual(layers.map((_, i) => String(12 - i)));
    expect(body.lastElementChild?.className).toBe("dv-face");
  });

  it("uses half the layers on a small screen", () => {
    smallScreen = true;
    const { root } = setup(0, "parent-hub");
    expect(copies(root, ".dv-body")).toHaveLength(6);
  });

  it("lays the road with a pin for every stop, the shown stop lit and in front of the device", () => {
    const { root } = setup(2, "ai-tutor");
    const pins = Array.from(root.querySelectorAll(".rd-pin"));
    expect(pins).toHaveLength(POINTS.length);
    expect(pins.map((pin) => pin.getAttribute("data-on"))).toEqual(
      pins.map((_, i) => (i === 2 ? "true" : null)),
    );
    const ground = root.querySelector(".rd-ground") as HTMLElement;
    expect(ground.style.getPropertyValue("--px")).toBe(String(POINTS[2].x));
    expect(ground.style.getPropertyValue("--py")).toBe(String(POINTS[2].y));
  });

  it("slides the road to the next stop and stands the next device, keeping the ground", () => {
    const { root, rerender } = setup(1, "staff-hub");
    const ground = root.querySelector(".rd-ground");
    const city = root.querySelector(".rd-city");
    rerender(<ProductScene index={2} app="ai-tutor" />);
    expect(root.querySelector(".rd-ground")).toBe(ground);
    expect(root.querySelector(".rd-city")).not.toBe(city);
    expect(
      (root.querySelector(".rd-ground") as HTMLElement).style.getPropertyValue(
        "--px",
      ),
    ).toBe(String(POINTS[2].x));
    expect(root.querySelector(".dv")?.getAttribute("data-kind")).toBe(
      "monitor",
    );
  });

  describe("motion", () => {
    it("plays by default", () => {
      expect(setup().root.getAttribute("data-play")).toBe("on");
    });

    it("rests at its final view under reduced motion", () => {
      reducedMotion = true;
      expect(setup().root.getAttribute("data-play")).toBe("off");
    });

    it("rests at its final view with a saved Pause", () => {
      localStorage.setItem(MOTION_KEY, "off");
      expect(setup().root.getAttribute("data-play")).toBe("off");
    });

    it("rests even with a saved Play, when the system asks for reduced motion", () => {
      reducedMotion = true;
      localStorage.setItem(MOTION_KEY, "on");
      expect(setup().root.getAttribute("data-play")).toBe("off");
    });

    it("does not turn with the pointer when it rests", () => {
      reducedMotion = true;
      const { root } = setup();
      fireEvent.pointerDown(root, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(root, { clientX: 300, clientY: 10 });
      expect(root.style.getPropertyValue("--yaw")).toBe("");
      expect(setPointerCapture).not.toHaveBeenCalled();
    });
  });

  describe("look-around", () => {
    it("turns toward a mouse pointer, most at the window's edge", () => {
      const { root } = setup();
      fireEvent.pointerMove(root, {
        pointerType: "mouse",
        clientX: 500,
        clientY: 400,
      });
      expect(root.style.getPropertyValue("--yaw")).toBe("0deg");
      expect(root.style.getPropertyValue("--pitch")).toBe("0deg");
      fireEvent.pointerMove(root, {
        pointerType: "mouse",
        clientX: 0,
        clientY: 800,
      });
      expect(root.style.getPropertyValue("--yaw")).toBe("9deg");
      expect(root.style.getPropertyValue("--pitch")).toBe("4deg");
    });

    it("does not turn with a finger that is not pressed", () => {
      const { root } = setup();
      fireEvent.pointerMove(root, {
        pointerType: "touch",
        clientX: 0,
        clientY: 0,
      });
      expect(root.style.getPropertyValue("--yaw")).toBe("");
    });

    it("turns with a drag, within its limits", () => {
      const { root } = setup();
      fireEvent.pointerDown(root, {
        pointerType: "touch",
        pointerId: 4,
        clientX: 100,
        clientY: 100,
      });
      expect(setPointerCapture).toHaveBeenCalledWith(4);
      fireEvent.pointerMove(root, {
        pointerType: "touch",
        clientX: 150,
        clientY: 80,
      });
      expect(root.style.getPropertyValue("--yaw")).toBe("11deg");
      expect(root.style.getPropertyValue("--pitch")).toBe("2.8deg");
      fireEvent.pointerMove(root, {
        pointerType: "touch",
        clientX: 900,
        clientY: -500,
      });
      expect(root.style.getPropertyValue("--yaw")).toBe("34deg");
      expect(root.style.getPropertyValue("--pitch")).toBe("10deg");
      fireEvent.pointerMove(root, {
        pointerType: "touch",
        clientX: -900,
        clientY: 900,
      });
      expect(root.style.getPropertyValue("--yaw")).toBe("-34deg");
      expect(root.style.getPropertyValue("--pitch")).toBe("-10deg");
    });

    it("settles back when a finger lifts", () => {
      const { root } = setup();
      fireEvent.pointerDown(root, {
        pointerType: "touch",
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerMove(root, {
        pointerType: "touch",
        clientX: 160,
        clientY: 100,
      });
      fireEvent.pointerUp(root, { pointerType: "touch" });
      expect(root.style.getPropertyValue("--yaw")).toBe("0deg");
      expect(root.style.getPropertyValue("--pitch")).toBe("0deg");
    });

    it("keeps the look when a mouse or pen lifts, and starts the next drag from it", () => {
      const { root } = setup();
      fireEvent.pointerDown(root, {
        pointerType: "mouse",
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerMove(root, {
        pointerType: "mouse",
        clientX: 150,
        clientY: 100,
      });
      fireEvent.pointerUp(root, { pointerType: "mouse" });
      expect(root.style.getPropertyValue("--yaw")).toBe("11deg");
      fireEvent.pointerDown(root, {
        pointerType: "mouse",
        clientX: 300,
        clientY: 100,
      });
      fireEvent.pointerMove(root, {
        pointerType: "mouse",
        clientX: 310,
        clientY: 100,
      });
      expect(root.style.getPropertyValue("--yaw")).toBe("13.2deg");
    });

    it("ignores a lift with no press, and a cancelled press", () => {
      const { root } = setup();
      fireEvent.pointerUp(root, { pointerType: "touch" });
      expect(root.style.getPropertyValue("--yaw")).toBe("");
      fireEvent.pointerDown(root, {
        pointerType: "touch",
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerMove(root, {
        pointerType: "touch",
        clientX: 150,
        clientY: 100,
      });
      fireEvent.pointerCancel(root, { pointerType: "touch" });
      expect(root.style.getPropertyValue("--yaw")).toBe("0deg");
    });
  });

  describe("the click that ends a drag", () => {
    function setupInside() {
      const outer = vi.fn();
      const view = render(
        <div onClick={outer}>
          <ProductScene index={1} app="ai-tutor" />
        </div>,
      );
      const root = view.container.querySelector(".rd-scene") as HTMLElement;
      return { root, outer };
    }

    const drag = (root: HTMLElement, by: number) => {
      fireEvent.pointerDown(root, {
        pointerType: "mouse",
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerMove(root, {
        pointerType: "mouse",
        clientX: 100 + by,
        clientY: 100,
      });
      fireEvent.pointerUp(root, { pointerType: "mouse" });
    };

    it("does not reach the dialog, which closes on a click", () => {
      const { root, outer } = setupInside();
      drag(root, 40);
      fireEvent.click(root);
      expect(outer).not.toHaveBeenCalled();
    });

    it("lets the next click through", () => {
      const { root, outer } = setupInside();
      drag(root, 40);
      fireEvent.click(root);
      fireEvent.click(root);
      expect(outer).toHaveBeenCalledTimes(1);
    });

    it("lets a tap through: a press that hardly moved is a click", () => {
      const { root, outer } = setupInside();
      drag(root, 3);
      fireEvent.click(root);
      expect(outer).toHaveBeenCalledTimes(1);
    });
  });
});
