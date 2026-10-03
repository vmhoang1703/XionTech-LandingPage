import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { productLinks } from "@/content/product-links";
import { pxpSection } from "@/content/products";
import { undefinedClasses } from "@/test-utils/css-classes";
import { PxpSection } from "./pxp-section";

describe("PxpSection", () => {
  it("keeps the #pxp anchor with its heading", () => {
    const { container } = render(<PxpSection />);
    const section = container.querySelector("section#pxp");
    expect(section?.classList.contains("products-anchor")).toBe(true);
    expect(section?.getAttribute("aria-labelledby")).toBe("pxp-h");
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2.id).toBe("pxp-h");
    expect(h2.textContent).toBe("The school day, in a parent's pocket.");
    expect(screen.getByText(pxpSection.lede)).toBeDefined();
    expect(screen.getByText("PXP").classList.contains("b-pxp")).toBe(true);
  });

  it("holds the story phone with five tabs", () => {
    render(<PxpSection />);
    expect(screen.getAllByRole("tab")).toHaveLength(5);
  });

  it("lists the four PXP features", () => {
    const { container } = render(<PxpSection />);
    const items = container.querySelectorAll(".feature-list > div");
    expect([...items].map((i) => i.querySelector("b")?.textContent)).toEqual([
      "Know they arrived",
      "See progress early",
      "Talk to teachers",
      "Pay fees in a tap",
    ]);
  });

  it("shows App Store and Google Play placeholders that open a new tab", () => {
    render(<PxpSection />);
    const cases = [
      ["[Placeholder] App Store", productLinks.pxpAppStore],
      ["[Placeholder] Google Play", productLinks.pxpGooglePlay],
    ];
    for (const [label, href] of cases) {
      const link = screen.getByRole("link", {
        name: `${label} (opens in a new tab)`,
      });
      expect(link.textContent).toBe(label);
      expect(link.getAttribute("href")).toBe(href);
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link.classList.contains("btn-glass")).toBe(true);
      expect(within(link).queryByRole("img")).toBeNull();
    }
  });

  it("uses only classes that globals.css defines", () => {
    const { container } = render(<PxpSection />);
    expect(undefinedClasses(container, /^(mt-[\d.]+|size-\d+)$/)).toEqual([]);
  });
});
