import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { productLinks } from "@/content/product-links";
import { pxpSection } from "@/content/products";
import { undefinedClasses } from "@/test-utils/css-classes";
import { PxpSection, storeLinkAttributes } from "./pxp-section";

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

  it("puts the heading before the phone, so a #pxp jump on a narrow screen shows it", () => {
    render(<PxpSection />);
    const h2 = screen.getByRole("heading", { level: 2 });
    const tablist = screen.getByRole("tablist");
    expect(
      h2.compareDocumentPosition(tablist) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(tablist.closest(".pxp-phone")).not.toBeNull();
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

  it("marks the unconfirmed PXP claims as [Placeholder]", () => {
    expect(pxpSection.lede.startsWith("[Placeholder]")).toBe(true);
    for (const feature of pxpSection.features) {
      expect(feature.body.startsWith("[Placeholder]")).toBe(true);
    }
  });

  it("shows App Store and Google Play placeholders that stay on the page while the address is #", () => {
    render(<PxpSection />);
    const cases = [
      ["[Placeholder] App Store", productLinks.pxpAppStore],
      ["[Placeholder] Google Play", productLinks.pxpGooglePlay],
    ];
    for (const [label, href] of cases) {
      const link = screen.getByRole("link", { name: label });
      expect(link.textContent).toBe(label);
      expect(link.getAttribute("href")).toBe(href);
      expect(link.getAttribute("target")).toBeNull();
      expect(link.classList.contains("btn-glass")).toBe(true);
      expect(within(link).queryByRole("img")).toBeNull();
    }
  });

  it("opens a real store address in a new tab", () => {
    expect(storeLinkAttributes("#", "App Store")).toEqual({
      "aria-label": "App Store",
    });
    expect(
      storeLinkAttributes("https://apps.apple.com/app/id1", "App Store"),
    ).toEqual({
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "App Store (opens in a new tab)",
    });
  });

  it("uses only classes that globals.css defines", () => {
    const { container } = render(<PxpSection />);
    expect(undefinedClasses(container, /^(mt-[\d.]+|size-\d+)$/)).toEqual([]);
  });
});
