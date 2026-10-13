import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOTION_KEY } from "@/lib/motion/motion-preference";
import { PageFade } from "./page-fade";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

const animate = vi.fn();

function stubMotion(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: reduced } as MediaQueryList),
  );
}

function mount() {
  const main = document.createElement("main");
  main.id = "main";
  main.animate = animate;
  document.body.append(main);
  return main;
}

beforeEach(() => {
  pathname = "/";
  localStorage.clear();
  animate.mockClear();
  stubMotion(false);
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.getElementById("main")?.remove();
});

describe("PageFade", () => {
  it("does not fade the first page, then fades each new page up", () => {
    mount();
    const { rerender } = render(<PageFade />);
    expect(animate).not.toHaveBeenCalled();
    pathname = "/products";
    rerender(<PageFade />);
    expect(animate).toHaveBeenCalledOnce();
    const [frames, options] = animate.mock.calls[0];
    expect(frames).toEqual([
      { opacity: 0, translate: "0 14px" },
      { opacity: 1, translate: "0 0" },
    ]);
    expect(options.duration).toBe(450);
    expect(options.easing).toBe("ease-out");
  });

  it.each([
    ["reduced motion", () => stubMotion(true)],
    ["a saved Pause", () => localStorage.setItem(MOTION_KEY, "off")],
  ])("does not fade with %s", (_, setUp) => {
    setUp();
    mount();
    const { rerender } = render(<PageFade />);
    pathname = "/about";
    rerender(<PageFade />);
    expect(animate).not.toHaveBeenCalled();
  });

  it("does nothing without main", () => {
    const { rerender } = render(<PageFade />);
    pathname = "/news";
    expect(() => rerender(<PageFade />)).not.toThrow();
    expect(animate).not.toHaveBeenCalled();
  });
});
