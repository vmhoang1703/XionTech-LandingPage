import { describe, it, expect } from "vitest";
import * as navData from "./nav-data";
import { currentSection, NAV_LINKS, SERVICES } from "./nav-data";

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

    it("maps exactly / to home", () => {
      expect(currentSection("/")).toBe("home");
    });

    it.each(["/home", "//", "/not-a-page"])(
      "does not map %s to home",
      (path) => {
        expect(currentSection(path)).toBeNull();
      },
    );

    it("maps unknown paths to empty string", () => {
      expect(currentSection("/unknown")).toBeNull();
    });

    it.each([
      ["/en", "home"],
      ["/vi", "home"],
      ["/vi/news/x", "news"],
      ["/en/products", "products"],
    ])("ignores the locale prefix: %s is %s", (path, section) => {
      expect(currentSection(path)).toBe(section);
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

  describe("NAV_LINKS", () => {
    it("lists the six top-level pages in header order, Home first", () => {
      expect(NAV_LINKS.map((l) => [l.section, l.href])).toEqual([
        ["home", "/"],
        ["products", "/products"],
        ["services", "/services"],
        ["news", "/news"],
        ["about", "/about"],
        ["careers", "/careers"],
      ]);
    });

    it("has the contact link and no mega-menu data", () => {
      expect(navData.CONTACT_HREF).toBe("/#contact");
      expect(navData).not.toHaveProperty("PRODUCTS");
      expect(navData).not.toHaveProperty("PRODUCTS_FOOTER");
      expect(navData).not.toHaveProperty("SERVICES_FOOTER");
    });
  });
});
