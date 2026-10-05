import { describe, expect, it } from "vitest";
import { serviceIcons } from "./service-icons";

describe("serviceIcons", () => {
  it("has all eight service ids mapped to an icon", () => {
    const expectedIds = [
      "product-engineering",
      "ai-analytics",
      "co-creation",
      "staffing",
      "custom-apps",
      "low-code",
      "ai-solutions",
      "cloud",
    ];

    for (const id of expectedIds) {
      expect(serviceIcons[id as keyof typeof serviceIcons]).toBeDefined();
      expect(serviceIcons[id as keyof typeof serviceIcons].icon).toBeDefined();
    }
  });

  it("has product-engineering with feature variant", () => {
    expect(serviceIcons["product-engineering"].variant).toBe("feature");
  });

  it("has cloud with feature variant", () => {
    expect(serviceIcons.cloud.variant).toBe("feature");
  });

  it("has ai-solutions with navy variant", () => {
    expect(serviceIcons["ai-solutions"].variant).toBe("navy");
  });

  it("has no variant for the other four services", () => {
    const noVariantIds = [
      "ai-analytics",
      "co-creation",
      "staffing",
      "custom-apps",
      "low-code",
    ];

    for (const id of noVariantIds) {
      expect(
        serviceIcons[id as keyof typeof serviceIcons].variant,
      ).toBeUndefined();
    }
  });
});
