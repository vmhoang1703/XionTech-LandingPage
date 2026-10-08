import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  MOTION_KEY,
  readMotionPaused,
  saveMotionPaused,
} from "./motion-preference";

let reducedMotion = false;

beforeEach(() => {
  reducedMotion = false;
  localStorage.clear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: reducedMotion })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function blockStorage() {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
}

describe("readMotionPaused", () => {
  it("reads a stored off as paused, even without reduced motion", () => {
    localStorage.setItem(MOTION_KEY, "off");

    expect(readMotionPaused()).toBe(true);
  });

  it("reads a stored on as playing, even with reduced motion", () => {
    reducedMotion = true;
    localStorage.setItem(MOTION_KEY, "on");

    expect(readMotionPaused()).toBe(false);
  });

  it("follows reduced motion when nothing is stored", () => {
    expect(readMotionPaused()).toBe(false);

    reducedMotion = true;
    expect(readMotionPaused()).toBe(true);
  });

  it("follows reduced motion when the stored value is not off or on", () => {
    reducedMotion = true;
    localStorage.setItem(MOTION_KEY, "maybe");

    expect(readMotionPaused()).toBe(true);
  });

  it("falls back to reduced motion when storage throws", () => {
    blockStorage();
    reducedMotion = true;

    expect(readMotionPaused()).toBe(true);
  });
});

describe("saveMotionPaused", () => {
  it("stores off when paused and on when playing", () => {
    saveMotionPaused(true);
    expect(localStorage.getItem(MOTION_KEY)).toBe("off");

    saveMotionPaused(false);
    expect(localStorage.getItem(MOTION_KEY)).toBe("on");
  });

  it("does not throw when storage is blocked", () => {
    blockStorage();

    expect(() => saveMotionPaused(true)).not.toThrow();
  });
});
