import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeaderScroll } from "./header-scroll";

let y = 0;
let frames: FrameRequestCallback[] = [];

function scrollTo(next: number) {
  y = next;
  window.dispatchEvent(new Event("scroll"));
  for (const frame of frames.splice(0)) frame(0);
}

function mount() {
  const view = render(
    <header data-autohide="">
      <button type="button" aria-expanded="false">
        Menu
      </button>
      <a href="#main">logo</a>
      <HeaderScroll />
    </header>,
  );
  const header = view.container.querySelector("header") as HTMLElement;
  return { header, view };
}
const hidden = (header: HTMLElement) => header.hasAttribute("data-hidden");

beforeEach(() => {
  y = 0;
  frames = [];
  vi.spyOn(window, "scrollY", "get").mockImplementation(() => y);
  vi.stubGlobal("requestAnimationFrame", (frame: FrameRequestCallback) => {
    frames.push(frame);
    return frames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("HeaderScroll", () => {
  it("hides the header going down past the top, shows it going up", () => {
    const { header } = mount();
    scrollTo(80);
    expect(hidden(header)).toBe(false);
    scrollTo(400);
    expect(hidden(header)).toBe(true);
    scrollTo(300);
    expect(hidden(header)).toBe(false);
  });

  it("ignores small moves", () => {
    const { header } = mount();
    scrollTo(400);
    expect(hidden(header)).toBe(true);
    scrollTo(397);
    expect(hidden(header)).toBe(true);
  });

  it("keeps the header while the menu is open or focus is inside it", () => {
    const { header } = mount();
    const menu = header.querySelector("button") as HTMLElement;
    menu.setAttribute("aria-expanded", "true");
    scrollTo(400);
    expect(hidden(header)).toBe(false);
    menu.setAttribute("aria-expanded", "false");
    (header.querySelector("a") as HTMLElement).focus();
    scrollTo(800);
    expect(hidden(header)).toBe(false);
  });

  it("shows the header again and stops listening on unmount", () => {
    const { header, view } = mount();
    scrollTo(400);
    expect(hidden(header)).toBe(true);
    view.unmount();
    expect(hidden(header)).toBe(false);
  });

  it("does nothing without an auto-hide header", () => {
    const { container } = render(
      <header>
        <HeaderScroll />
      </header>,
    );
    scrollTo(500);
    expect(container.querySelector("header")?.hasAttribute("data-hidden")).toBe(
      false,
    );
  });
});
