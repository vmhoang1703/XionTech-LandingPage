import { describe, expect, it } from "vitest";
import { servicesSection } from "@/content/services";
import { serviceIcons } from "./service-icons";

describe("serviceIcons", () => {
  it("has all eight service ids mapped to an icon", () => {
    const expectedIds = servicesSection.services.map((service) => service.id);

    for (const id of expectedIds) {
      expect(serviceIcons[id]).toBeDefined();
      expect(serviceIcons[id].icon).toBeDefined();
    }
  });

  it("carries only an icon per service, no card variant", () => {
    for (const entry of Object.values(serviceIcons)) {
      expect(Object.keys(entry)).toEqual(["icon"]);
    }
  });
});
