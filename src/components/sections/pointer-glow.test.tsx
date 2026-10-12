import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PointerGlow } from "./pointer-glow";

let frames: FrameRequestCallback[];

function stubPointer(fine: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: fine } as MediaQueryList),
  );
}

// A glow card at (100, 50) with a plain child, and a card with no glow.
function mountCards() {
  document.body.innerHTML = `
    <a id="card" data-glow=""><span id="inner">Door</span></a>
    <p id="plain">Text</p>`;
  const card = document.getElementById("card") as HTMLElement;
  vi.spyOn(card, "getBoundingClientRect").mockReturnValue({
    left: 100,
    top: 50,
  } as DOMRect);
  return card;
}

const runFrames = () => frames.splice(0).forEach((frame) => frame(0));

beforeEach(() => {
  frames = [];
  vi.stubGlobal("requestAnimationFrame", (frame: FrameRequestCallback) => {
    frames.push(frame);
    return frames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  stubPointer(true);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("PointerGlow", () => {
  it("moves the light to the pointer inside a glow card, once a frame", () => {
    const card = mountCards();
    render(<PointerGlow />);
    const inner = document.getElementById("inner") as HTMLElement;
    fireEvent.pointerMove(inner, { clientX: 130, clientY: 90 });
    fireEvent.pointerMove(inner, { clientX: 140, clientY: 95 });
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1);
    runFrames();
    expect(card.style.getPropertyValue("--glow-x")).toBe("40px");
    expect(card.style.getPropertyValue("--glow-y")).toBe("45px");
  });

  it("ignores the pointer outside glow cards", () => {
    mountCards();
    render(<PointerGlow />);
    fireEvent.pointerMove(document.getElementById("plain") as HTMLElement);
    expect(frames).toEqual([]);
  });

  it("does nothing on touch screens", () => {
    stubPointer(false);
    const card = mountCards();
    render(<PointerGlow />);
    fireEvent.pointerMove(card, { clientX: 130, clientY: 90 });
    expect(frames).toEqual([]);
  });

  it("stops listening on unmount", () => {
    const card = mountCards();
    const view = render(<PointerGlow />);
    view.unmount();
    fireEvent.pointerMove(card, { clientX: 130, clientY: 90 });
    expect(frames).toEqual([]);
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });
});
