import { describe, it, expect } from "vitest";
import { currentSection, PRODUCTS, SERVICES } from "./nav-data";

describe("nav-data", () => {
  describe("currentSection", () => {
    it("maps /news/x to news", () => {
      expect(currentSection("/news/x")).toBe("news");
    });

    it("maps /news to news", () => {
      expect(currentSection("/news")).toBe("news");
    });

    it("maps /careers/x to careers", () => {
      expect(currentSection("/careers/x")).toBe("careers");
    });

    it("maps /careers to careers", () => {
      expect(currentSection("/careers")).toBe("careers");
    });

    it("maps /products to products", () => {
      expect(currentSection("/products")).toBe("products");
    });

    it("maps / to empty string", () => {
      expect(currentSection("/")).toBeNull();
    });

    it("maps unknown paths to empty string", () => {
      expect(currentSection("/unknown")).toBeNull();
    });

    it("maps /about to about (per spec I/O Matrix)", () => {
      expect(currentSection("/about")).toBe("about");
    });

    it("maps /about/x to about", () => {
      expect(currentSection("/about/x")).toBe("about");
    });

    it("maps /demo to empty string", () => {
      expect(currentSection("/demo")).toBeNull();
    });

    it.each(["/newsletter", "/aboutus", "/News", "/products-x", "/careersx"])(
      "does not match %s",
      (path) => {
        expect(currentSection(path)).toBeNull();
      },
    );

    it("maps /services to services", () => {
      expect(currentSection("/services")).toBe("services");
    });

    it("maps /services/x to services", () => {
      expect(currentSection("/services/x")).toBe("services");
    });
  });

  describe("PRODUCTS", () => {
    it("has exactly 4 products", () => {
      expect(PRODUCTS).toHaveLength(4);
    });

    it("has products in correct order", () => {
      expect(PRODUCTS[0].anchor).toBe("pxp");
      expect(PRODUCTS[1].anchor).toBe("lxp");
      expect(PRODUCTS[2].anchor).toBe("sxp");
      expect(PRODUCTS[3].anchor).toBe("iot");
    });

    it("has product names", () => {
      expect(PRODUCTS[0].name).toBe("PXP");
      expect(PRODUCTS[1].name).toBe("LXP");
      expect(PRODUCTS[2].name).toBe("SXP");
      expect(PRODUCTS[3].name).toBe("IoT Device Management");
    });
  });

  describe("SERVICES", () => {
    it("has exactly 8 services", () => {
      expect(SERVICES).toHaveLength(8);
    });

    it("has services in correct order", () => {
      const anchors = SERVICES.map((s) => s.anchor);
      expect(anchors).toEqual([
        "product-engineering",
        "ai-analytics",
        "co-creation",
        "staffing",
        "custom-apps",
        "low-code",
        "ai-solutions",
        "cloud",
      ]);
    });
  });
});
