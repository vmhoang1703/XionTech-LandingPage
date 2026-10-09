import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { Mesh, PerspectiveCamera, Scene } from "three";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CampusCanvas } from "./campus-canvas";
import { BEACON_NAME, placeTarget, skyAt } from "./campus-scene";

// jsdom has no WebGL: the renderer is a fake, the rest of three.js is real.
const { renderer, Renderer } = vi.hoisted(() => {
  const renderer = {
    setPixelRatio: vi.fn(),
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
  };
  return {
    renderer,
    Renderer: vi.fn(function () {
      return renderer;
    }),
  };
});

vi.mock("three", async (importOriginal) => ({
  ...(await importOriginal<typeof import("three")>()),
  WebGLRenderer: Renderer,
}));

class FakeObserver {
  static all: FakeObserver[] = [];
  connected = false;
  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    FakeObserver.all.push(this);
  }
  observe() {
    this.connected = true;
  }
  disconnect() {
    this.connected = false;
  }
}

let resize: () => void = () => undefined;
let frame: FrameRequestCallback = () => undefined;
let reducedMotion = false;
let getContext: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  reducedMotion = false;
  FakeObserver.all = [];
  localStorage.clear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: reducedMotion })),
  );
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      frame = callback;
      return 1;
    }),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  getContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue({} as WebGL2RenderingContext);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  Renderer.mockClear();
  for (const fn of Object.values(renderer)) fn.mockReset();
});

// Every connected observer sees the section: the loader (near the viewport)
// and the viewer (on screen).
function intersect(visible: boolean) {
  act(() => {
    for (const observer of FakeObserver.all.filter((o) => o.connected)) {
      observer.callback(
        [{ isIntersecting: visible } as IntersectionObserverEntry],
        observer as unknown as IntersectionObserver,
      );
    }
  });
}

function canvasOf(container: HTMLElement) {
  const canvas = container.querySelector("canvas");
  if (!canvas) throw new Error("No canvas");
  return canvas;
}

// The scene and camera the fake renderer last drew.
function lastDraw() {
  const call = renderer.render.mock.lastCall;
  if (!call) throw new Error("Nothing rendered");
  const [scene, camera] = call as [Scene, PerspectiveCamera];
  const beacon = scene.getObjectByName(BEACON_NAME);
  if (!beacon) throw new Error("No beacon");
  return { scene, camera, beacon };
}

// Resolves once the scene is ready and its first effect has run: a still
// frame drawn (paused) or the render loop started (playing). The button
// commits before those passive effects flush.
async function renderReady(progress = 0) {
  const view = render(<CampusCanvas progress={progress} />);
  intersect(true);
  await screen.findByRole("button");
  await waitFor(() => {
    const drawn = renderer.render.mock.calls.length;
    const looping = vi.mocked(requestAnimationFrame).mock.calls.length;
    expect(drawn + looping).toBeGreaterThan(0);
  });
  return view;
}

describe("CampusCanvas", () => {
  it("loads three.js only once the section nears the viewport", async () => {
    render(<CampusCanvas progress={0} />);

    expect(getContext).not.toHaveBeenCalled();
    const loader = FakeObserver.all.find((o) => o.options?.rootMargin);
    expect(loader).toBeDefined();

    intersect(true);
    await waitFor(() => expect(Renderer).toHaveBeenCalledOnce());
    expect(getContext).toHaveBeenCalledWith("webgl2");
  });

  it("shows the still SVG campus and no toggle without WebGL", async () => {
    getContext.mockReturnValue(null);
    const { container } = render(<CampusCanvas progress={0} />);
    intersect(true);
    await vi.dynamicImportSettled();

    expect(getContext).toHaveBeenCalled();
    expect(Renderer).not.toHaveBeenCalled();
    expect(screen.queryByRole("button")).toBeNull();
    expect(canvasOf(container).hidden).toBe(true);
    const fallback = container.querySelector("svg.flow-fallback");
    expect(fallback?.getAttribute("aria-hidden")).toBe("true");
  });

  it("swaps the SVG for an aria-hidden canvas with the pixel ratio capped at 2", async () => {
    vi.stubGlobal("devicePixelRatio", 3);
    const { container } = await renderReady();

    const canvas = canvasOf(container);
    expect(canvas.hidden).toBe(false);
    expect(canvas.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".flow-fallback")).toBeNull();
    expect(renderer.setPixelRatio).toHaveBeenCalledWith(2);
  });

  it("starts paused under reduced motion: one still frame, no animation frame", async () => {
    reducedMotion = true;
    await renderReady();

    expect(screen.getByRole("button", { name: "Play motion" })).toBeDefined();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(renderer.render).toHaveBeenCalledOnce();
    const { camera, scene } = lastDraw();
    expect(camera.position.equals(placeTarget("gate").position)).toBe(true);
    expect(scene.background).toEqual(skyAt(0));
  });

  it("while paused, a new chapter draws one still frame at its place", async () => {
    localStorage.setItem("xt-motion", "off");
    const { rerender } = await renderReady();

    rerender(<CampusCanvas progress={0.6} />);
    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(renderer.render).toHaveBeenCalledTimes(2);
    const { camera, beacon } = lastDraw();
    const classroom = placeTarget("classroom");
    expect(camera.position.equals(classroom.position)).toBe(true);
    expect(beacon.position.x).toBe(classroom.lookAt.x);
    expect(beacon.position.z).toBe(classroom.lookAt.z);
  });

  it("marks the host paused only while the ready scene is paused", async () => {
    const { container } = render(<CampusCanvas progress={0} />);
    const host = container.querySelector(".flow-canvas");
    expect(host?.hasAttribute("data-paused")).toBe(false);

    intersect(true);
    const button = await screen.findByRole("button", { name: "Pause motion" });
    expect(host?.hasAttribute("data-paused")).toBe(false);

    fireEvent.click(button);
    expect(host?.getAttribute("data-paused")).toBe("true");
    fireEvent.click(button);
    expect(host?.hasAttribute("data-paused")).toBe(false);
  });

  it("marks the host paused when the scene loads paused, not before", async () => {
    localStorage.setItem("xt-motion", "off");
    const { container } = render(<CampusCanvas progress={0} />);
    const host = container.querySelector(".flow-canvas");
    expect(host?.hasAttribute("data-paused")).toBe(false);

    intersect(true);
    await screen.findByRole("button", { name: "Play motion" });
    expect(host?.getAttribute("data-paused")).toBe("true");
  });

  it("the toggle saves the preference and stops or starts the loop", async () => {
    await renderReady();

    const button = screen.getByRole("button", { name: "Pause motion" });
    expect(requestAnimationFrame).toHaveBeenCalled();

    fireEvent.click(button);
    expect(localStorage.getItem("xt-motion")).toBe("off");
    expect(screen.getByRole("button", { name: "Play motion" })).toBe(button);
    expect(cancelAnimationFrame).toHaveBeenCalled();

    vi.mocked(requestAnimationFrame).mockClear();
    fireEvent.click(button);
    expect(localStorage.getItem("xt-motion")).toBe("on");
    expect(screen.getByRole("button", { name: "Pause motion" })).toBe(button);
    expect(requestAnimationFrame).toHaveBeenCalled();
  });

  it("glides the camera and raises the beacon over the active place in 900ms", async () => {
    const { rerender } = await renderReady();
    act(() => frame(1000));
    expect(
      lastDraw().camera.position.equals(placeTarget("gate").position),
    ).toBe(true);

    rerender(<CampusCanvas progress={0.9} />);
    const rooftop = placeTarget("rooftop");
    act(() => frame(1000));
    act(() => frame(1450));
    const halfway = lastDraw().camera.position;
    expect(halfway.equals(rooftop.position)).toBe(false);
    expect(halfway.equals(placeTarget("gate").position)).toBe(false);

    act(() => frame(1900));
    const { camera, beacon, scene } = lastDraw();
    expect(camera.position.equals(rooftop.position)).toBe(true);
    expect(beacon.position.x).toBe(rooftop.lookAt.x);
    expect(beacon.position.z).toBe(rooftop.lookAt.z);
    expect(beacon.position.y).toBeGreaterThan(rooftop.lookAt.y + 2);
    expect(scene.background).toEqual(skyAt(0.9));
  });

  it("cancels the running tween when a new chapter becomes active", async () => {
    const { rerender } = await renderReady();
    act(() => frame(1000));

    rerender(<CampusCanvas progress={0.9} />);
    act(() => frame(1000));
    act(() => frame(1300));
    rerender(<CampusCanvas progress={0.3} />);
    act(() => frame(1400));
    act(() => frame(2300));

    const position = lastDraw().camera.position;
    expect(position.equals(placeTarget("staff-room").position)).toBe(true);
  });

  it("stops rendering when off screen and resumes when back", async () => {
    await renderReady();
    const drawn = renderer.render.mock.calls.length;

    intersect(false);
    expect(cancelAnimationFrame).toHaveBeenCalled();
    expect(renderer.render).toHaveBeenCalledTimes(drawn);

    vi.mocked(requestAnimationFrame).mockClear();
    intersect(true);
    expect(requestAnimationFrame).toHaveBeenCalled();
  });

  it("stops rendering while the tab is hidden", async () => {
    await renderReady();
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(cancelAnimationFrame).toHaveBeenCalled();
    hidden.mockRestore();
  });

  it("falls back to the still campus when the WebGL context is lost", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { container } = await renderReady();

    act(() => {
      canvasOf(container).dispatchEvent(new Event("webglcontextlost"));
    });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("context lost"));
    expect(cancelAnimationFrame).toHaveBeenCalled();
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector(".flow-fallback")).not.toBeNull();
  });

  it("falls back to the still campus when three.js fails to start", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = new Error("No renderer");
    Renderer.mockImplementationOnce(function () {
      throw error;
    });
    const { container } = render(<CampusCanvas progress={0} />);
    intersect(true);

    await waitFor(() =>
      expect(warn).toHaveBeenCalledWith(expect.any(String), error),
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector(".flow-fallback")).not.toBeNull();
  });

  it("sizes the renderer and the camera to the canvas", async () => {
    localStorage.setItem("xt-motion", "off");
    const { container } = render(<CampusCanvas progress={0} />);
    const canvas = canvasOf(container);
    intersect(true);
    await screen.findByRole("button");
    // A canvas with no size yet (hidden) is skipped.
    expect(renderer.setSize).not.toHaveBeenCalled();

    vi.spyOn(canvas, "clientWidth", "get").mockReturnValue(800);
    vi.spyOn(canvas, "clientHeight", "get").mockReturnValue(400);
    act(() => resize());
    expect(renderer.setSize).toHaveBeenCalledWith(800, 400, false);
    expect(lastDraw().camera.aspect).toBe(2);
  });

  it("disposes the scene and the renderer when unmounted", async () => {
    const { container, unmount } = await renderReady();
    act(() => frame(0));
    const { scene } = lastDraw();
    const mesh = scene.getObjectByName(BEACON_NAME) as Mesh;
    const geometry = vi.spyOn(mesh.geometry, "dispose");
    const removeCanvas = vi.spyOn(canvasOf(container), "removeEventListener");
    const removeDocument = vi.spyOn(document, "removeEventListener");

    unmount();
    expect(geometry).toHaveBeenCalled();
    expect(renderer.dispose).toHaveBeenCalled();
    expect(removeCanvas).toHaveBeenCalledWith(
      "webglcontextlost",
      expect.any(Function),
    );
    expect(removeDocument).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
    );
  });

  it("does not start three.js when unmounted while it loads", async () => {
    const { unmount } = render(<CampusCanvas progress={0} />);
    intersect(true);
    unmount();
    await vi.dynamicImportSettled();

    expect(Renderer).not.toHaveBeenCalled();
  });
});
