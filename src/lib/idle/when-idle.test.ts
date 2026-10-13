import { afterEach, describe, expect, it, vi } from "vitest";
import { whenIdle } from "./when-idle";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("whenIdle", () => {
  it("waits for an idle moment, with a time limit, and can cancel", () => {
    const request = vi.fn(() => 4);
    const cancelIdle = vi.fn();
    vi.stubGlobal("requestIdleCallback", request);
    vi.stubGlobal("cancelIdleCallback", cancelIdle);
    const start = vi.fn();
    const cancel = whenIdle(start, 1200);
    expect(request).toHaveBeenCalledWith(start, { timeout: 1200 });
    cancel();
    expect(cancelIdle).toHaveBeenCalledWith(4);
  });

  it("waits 200ms where there is no requestIdleCallback", () => {
    vi.useFakeTimers();
    vi.stubGlobal("requestIdleCallback", undefined);
    const start = vi.fn();
    whenIdle(start);
    vi.advanceTimersByTime(199);
    expect(start).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(start).toHaveBeenCalled();
    const later = vi.fn();
    whenIdle(later)();
    vi.advanceTimersByTime(500);
    expect(later).not.toHaveBeenCalled();
  });
});
