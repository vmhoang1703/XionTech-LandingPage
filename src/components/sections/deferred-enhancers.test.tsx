import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mounted = vi.fn();
vi.mock("./pointer-glow", () => ({
  PointerGlow: () => {
    mounted("glow");
    return null;
  },
}));
vi.mock("./swipe-rows", () => ({
  SwipeRows: () => {
    mounted("swipe");
    return null;
  },
}));
vi.mock("./touch-press", () => ({
  TouchPress: () => {
    mounted("press");
    return null;
  },
}));

const { DeferredEnhancers } = await import("./deferred-enhancers");

describe("DeferredEnhancers", () => {
  it("loads the pointer glow, swipe rows and touch press after render, with no markup", async () => {
    const { container } = render(<DeferredEnhancers />);

    await waitFor(() => expect(mounted).toHaveBeenCalledTimes(3));
    expect(mounted.mock.calls.flat()).toEqual(["glow", "swipe", "press"]);
    expect(container.innerHTML).toBe("");
  });
});
