import { describe, expect, it } from "vitest";
import { journeyMap } from "@/content/products";

describe("journeyMap", () => {
  it("has the H1 and a lede", () => {
    expect(journeyMap.intro.title).toBe("Built apart. Better together.");
    expect(journeyMap.intro.lede).toBe(
      "A connected suite for school communities — bringing parents, learning, staff operations and campus technology into one shared ecosystem.",
    );
  });
});
