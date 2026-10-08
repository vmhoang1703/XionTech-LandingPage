// @vitest-environment node
import { describe, expect, it } from "vitest";
import { postAudience } from "./audience";

describe("postAudience", () => {
  it.each(["schools", "students", "parents", "company"])(
    "keeps %s as it is",
    (category) => {
      expect(postAudience({ category })).toBe(category);
    },
  );

  it("maps team to company", () => {
    expect(postAudience({ category: "team" })).toBe("company");
  });

  it.each(["PXP", "parent-hub"])(
    "maps a product with the Parent Hub app %s to parents",
    (app) => {
      expect(postAudience({ category: "product", app })).toBe("parents");
    },
  );

  it("maps a product with the AI Tutor app to students", () => {
    expect(postAudience({ category: "product", app: "ai-tutor" })).toBe(
      "students",
    );
  });

  it.each(["SXP", "staff-hub", "IoT", "LXP", null, undefined])(
    "maps a product with the app %s to schools",
    (app) => {
      expect(postAudience({ category: "product", app })).toBe("schools");
    },
  );

  it.each(["events", "toString", "", null, undefined])(
    "gives no audience for the category %j",
    (category) => {
      expect(postAudience({ category })).toBeNull();
    },
  );
});
