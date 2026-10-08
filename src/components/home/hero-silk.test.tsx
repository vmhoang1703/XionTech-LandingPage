import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroSilk } from "./hero-silk";
import { createSilk, type Silk } from "./silk-shader";

vi.mock("./silk-shader", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./silk-shader")>()),
  createSilk: vi.fn(),
}));

let intersect: (visible: boolean) => void = () => undefined;
let silk: Silk;
let reducedMotion = false;

beforeEach(() => {
  reducedMotion = false;
  localStorage.clear();
  silk = { draw: vi.fn(), resize: vi.fn() };
  vi.mocked(createSilk).mockReturnValue(silk);
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: reducedMotion })),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersect = (visible) =>
          callback(
            [{ isIntersecting: visible } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn(() => 1),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.mocked(createSilk).mockReset();
});

function renderSilk() {
  const view = render(<HeroSilk />);
  const canvas = view.container.querySelector("canvas");
  if (!canvas) throw new Error("No canvas");
  return { ...view, canvas };
}

describe("HeroSilk", () => {
  it("renders an aria-hidden canvas", () => {
    const { canvas } = renderSilk();

    expect(canvas.getAttribute("aria-hidden")).toBe("true");
    expect(silk.resize).toHaveBeenCalled();
  });

  it("paints the canvas above the hero's static glow (z-index -2)", () => {
    const { canvas } = renderSilk();

    expect(canvas.classList.contains("-z-1")).toBe(true);
  });

  it("hides the toggle and the canvas when WebGL is unavailable", () => {
    vi.mocked(createSilk).mockReturnValue(null);
    const { canvas } = renderSilk();

    expect(screen.queryByRole("button")).toBeNull();
    expect(canvas.hidden).toBe(true);
  });

  it("starts moving and toggles between Pause motion and Play motion", () => {
    renderSilk();

    const button = screen.getByRole("button", { name: "Pause motion" });
    expect(button.getAttribute("aria-pressed")).toBeNull();
    // Phosphor icons draw on a 256 grid.
    const pauseIcon = button.querySelector("svg");
    expect(pauseIcon?.getAttribute("viewBox")).toBe("0 0 256 256");
    expect(requestAnimationFrame).toHaveBeenCalled();

    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Play motion" })).toBe(button);
    expect(button.querySelector("svg")?.innerHTML).not.toBe(
      pauseIcon?.innerHTML,
    );
    expect(cancelAnimationFrame).toHaveBeenCalled();

    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Pause motion" })).toBe(button);
  });

  it("advances the shader time on each frame", () => {
    let frame: FrameRequestCallback = () => undefined;
    vi.mocked(requestAnimationFrame).mockImplementation((callback) => {
      frame = callback;
      return 1;
    });
    vi.spyOn(performance, "now").mockReturnValue(0);
    renderSilk();

    act(() => frame(50));
    expect(silk.draw).toHaveBeenLastCalledWith(8 + 0.05 * 0.35);
  });

  it("starts paused when the visitor prefers reduced motion", () => {
    reducedMotion = true;
    renderSilk();

    expect(screen.getByRole("button", { name: "Play motion" })).toBeDefined();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("starts paused when the stored choice is off", () => {
    localStorage.setItem("xt-motion", "off");
    renderSilk();

    expect(screen.getByRole("button", { name: "Play motion" })).toBeDefined();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("saves the choice on click", () => {
    reducedMotion = true;
    renderSilk();

    fireEvent.click(screen.getByRole("button", { name: "Play motion" }));
    expect(localStorage.getItem("xt-motion")).toBe("on");

    fireEvent.click(screen.getByRole("button", { name: "Pause motion" }));
    expect(localStorage.getItem("xt-motion")).toBe("off");
  });

  it("stops when the hero is off screen and resumes when back", () => {
    renderSilk();
    vi.mocked(requestAnimationFrame).mockClear();

    act(() => intersect(false));
    expect(cancelAnimationFrame).toHaveBeenCalled();

    act(() => intersect(true));
    expect(requestAnimationFrame).toHaveBeenCalled();
  });

  it("stops while the tab is hidden", () => {
    renderSilk();
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(cancelAnimationFrame).toHaveBeenCalled();
    hidden.mockRestore();
  });

  it("falls back to the static glow when the WebGL context is lost", () => {
    const { canvas } = renderSilk();

    act(() => {
      canvas.dispatchEvent(new Event("webglcontextlost"));
    });
    expect(screen.queryByRole("button")).toBeNull();
    expect(canvas.hidden).toBe(true);
  });
  it("removes its listeners when unmounted", () => {
    const removeDocument = vi.spyOn(document, "removeEventListener");
    const { canvas, unmount } = renderSilk();
    const removeCanvas = vi.spyOn(canvas, "removeEventListener");

    unmount();
    expect(removeDocument).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
    );
    expect(removeCanvas).toHaveBeenCalledWith(
      "webglcontextlost",
      expect.any(Function),
    );
  });

  it("keeps the label visually hidden until hover or focus, even with reduced motion", () => {
    reducedMotion = true;
    renderSilk();

    const label = screen.getByText("Play motion");
    expect(label.className).toContain("max-w-0");
    expect(label.className).toContain("group-hover:max-w-50");
    expect(label.className).toContain("group-focus-visible:max-w-50");
    expect(label.className).not.toContain("motion-reduce:max-w");
  });

  it("is a 36px round button while its label is hidden", () => {
    renderSilk();

    const button = screen.getByRole("button", { name: "Pause motion" });
    for (const name of ["h-9", "min-w-9", "px-2", "justify-center"]) {
      expect(button.classList.contains(name)).toBe(true);
    }
  });
});
