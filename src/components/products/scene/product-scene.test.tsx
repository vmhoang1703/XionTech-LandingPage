import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOTION_KEY } from "@/lib/motion/motion-preference";
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

function setup(index = 1, words: string[] = ["Staff Hub"]) {
  const view = render(<ProductScene index={index} words={words} />);
  const root = view.container.querySelector(".rd-scene") as HTMLElement;
  return { ...view, root };
}

const towers = (root: HTMLElement) =>
  Array.from(root.querySelectorAll(".rd-tower"));

describe("ProductScene", () => {
  it("is decoration: hidden from assistive technology, with no text of its own to read", () => {
    const { root } = setup();
    expect(root.getAttribute("aria-hidden")).toBe("true");
    expect(root.querySelector("button, a, [tabindex]")).toBeNull();
  });

  it("stands a tower for each letter, and a gap for a space", () => {
    const { root } = setup(1, ["Staff Hub"]);
    expect(towers(root)).toHaveLength(8);
    expect(root.querySelectorAll(".rd-gap")).toHaveLength(1);
    expect(towers(root).map((el) => el.firstElementChild?.textContent)).toEqual(
      Array.from("StaffHub"),
    );
  });

  it("builds each tower from flat copies of its letter, front face first", () => {
    const { root } = setup(1, ["IoT"]);
    const [first] = towers(root);
    const copies = Array.from(first.querySelectorAll(".rd-slice"));
    expect(copies).toHaveLength(22);
    expect(new Set(copies.map((el) => el.textContent))).toEqual(new Set(["I"]));
    expect(
      copies.map((el) => (el as HTMLElement).style.getPropertyValue("--k")),
    ).toEqual(copies.map((_, k) => String(k)));
  });

  it("gives a word its fit for both stages and its towers their heights", () => {
    const { root } = setup(1, ["Staff Hub"]);
    const word = root.querySelector(".rd-word") as HTMLElement;
    for (const name of [
      "--w-size",
      "--w-stretch",
      "--w-x",
      "--w-z",
      "--n-size",
      "--n-stretch",
      "--n-x",
      "--n-z",
    ]) {
      expect(word.style.getPropertyValue(name)).not.toBe("");
    }
    const heights = towers(root).map((el) =>
      Number((el as HTMLElement).style.getPropertyValue("--h")),
    );
    expect(new Set(heights).size).toBeGreaterThan(1);
  });

  it("stands the four apps with fewer copies each, and marks the count", () => {
    const { root } = setup(5, ["Parent Hub", "Staff Hub", "IoT", "AI Tutor"]);
    expect(root.getAttribute("data-count")).toBe("4");
    expect(root.querySelectorAll(".rd-word")).toHaveLength(4);
    expect(
      root.querySelector(".rd-tower")?.querySelectorAll(".rd-slice"),
    ).toHaveLength(10);
  });

  it("uses half the copies on a small screen", () => {
    smallScreen = true;
    const { root } = setup(1, ["IoT"]);
    expect(
      root.querySelector(".rd-tower")?.querySelectorAll(".rd-slice"),
    ).toHaveLength(10);
    const many = setup(5, ["Parent Hub", "Staff Hub", "IoT", "AI Tutor"]);
    expect(
      many.root.querySelector(".rd-tower")?.querySelectorAll(".rd-slice"),
    ).toHaveLength(6);
  });

  it("lays the road with a pin for every stop, the shown stop lit and under the towers", () => {
    const { root } = setup(2);
    const pins = Array.from(root.querySelectorAll(".rd-pin"));
    expect(pins).toHaveLength(POINTS.length);
    expect(pins.map((pin) => pin.getAttribute("data-on"))).toEqual(
      pins.map((_, i) => (i === 2 ? "true" : null)),
    );
    const ground = root.querySelector(".rd-ground") as HTMLElement;
    expect(ground.style.getPropertyValue("--px")).toBe(String(POINTS[2].x));
    expect(ground.style.getPropertyValue("--py")).toBe(String(POINTS[2].y));
  });

  it("slides the road to the next stop and builds the next words, keeping the ground", () => {
    const { root, rerender } = setup(1, ["Staff Hub"]);
    const ground = root.querySelector(".rd-ground");
    const city = root.querySelector(".rd-city");
    rerender(<ProductScene index={2} words={["Parent Hub"]} />);
    expect(root.querySelector(".rd-ground")).toBe(ground);
    expect(root.querySelector(".rd-city")).not.toBe(city);
    expect(
      (root.querySelector(".rd-ground") as HTMLElement).style.getPropertyValue(
        "--px",
      ),
    ).toBe(String(POINTS[2].x));
    expect(towers(root)).toHaveLength(9);
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
          <ProductScene index={1} words={["IoT"]} />
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
