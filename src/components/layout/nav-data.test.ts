import { describe, it, expect } from "vitest";
import { APPS, appById } from "@/content/apps";
import {
  currentSection,
  LABELS,
  NAV_LINKS,
  PRODUCTS,
  SERVICES,
} from "./nav-data";

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

    it("lists the apps in apps.ts order with their anchors", () => {
      expect(PRODUCTS.map((p) => p.anchor)).toEqual(
        APPS.map((app) => app.anchor),
      );
    });

    it("has product names", () => {
      expect(PRODUCTS.map((p) => p.name)).toEqual([
        "Parent Hub",
        "Staff Hub",
        "IoT Device Management",
        "AI Tutor",
      ]);
    });

    it("does not use the old names in value lines", () => {
      for (const p of PRODUCTS) {
        expect(p.valueLine).not.toMatch(/eXperience|PXP|LXP|SXP/);
      }
    });

    it("shows the AI Tutor row for students", () => {
      expect(PRODUCTS[3].forLine).toBe("Students");
      expect(PRODUCTS[3].valueLine).toBe(appById("ai-tutor").tagline);
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
    it("lists the five top-level pages in header order", () => {
      expect(NAV_LINKS.map((l) => [l.section, l.href, l.label])).toEqual([
        ["products", "/products", "Products"],
        ["services", "/services", "Services"],
        ["news", "/news", "News"],
        ["about", "/about", "About"],
        ["careers", "/careers", "Careers"],
      ]);
    });

    it("labels the mobile menu button Menu", () => {
      expect(LABELS.menu).toBe("Menu");
    });
  });
});
