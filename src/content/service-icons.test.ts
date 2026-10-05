import { describe, expect, it } from "vitest";
import { homeServices } from "@/content/home";
import { serviceIcons } from "./service-icons";

describe("serviceIcons", () => {
  it("has all eight service ids mapped to an icon", () => {
    const expectedIds = homeServices.cards.map((card) => card.id);

    for (const id of expectedIds) {
      expect(serviceIcons[id]).toBeDefined();
      expect(serviceIcons[id].icon).toBeDefined();
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

  it("has no variant for the other five services", () => {
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
