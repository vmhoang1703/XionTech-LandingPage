import { describe, expect, it } from "vitest";
import { definesClass } from "./css-classes";

describe("definesClass", () => {
  it("finds a class used as a selector", () => {
    expect(definesClass(".door { color: red; }", "door")).toBe(true);
    expect(definesClass(".a, .door:hover { color: red; }", "door")).toBe(true);
  });

  it("ignores mentions inside CSS comments", () => {
    expect(definesClass("/* reuses .go arrow */ .x { }", "go")).toBe(false);
  });

  it("ignores a class that only appears compounded onto another class", () => {
    expect(definesClass(".field.full { }", "full")).toBe(false);
  });

  it("does not let a name with regex characters match other text", () => {
    expect(definesClass(".gapX3 { }", "gap.3")).toBe(false);
    expect(definesClass(".w-1/3 { }", "w-1/3")).toBe(true);
  });

  it("accepts a modifier compounded with a class the same element has", () => {
    expect(definesClass(".svc.feature { }", "feature", ["spot", "svc"])).toBe(
      true,
    );
    expect(definesClass(".svc.feature { }", "feature", ["tile"])).toBe(false);
  });
});
