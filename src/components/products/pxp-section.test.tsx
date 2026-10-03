import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PLACEHOLDER_HREF, productLinks } from "@/content/product-links";
import { pxpSection } from "@/content/products";
import { undefinedClasses } from "@/test-utils/css-classes";
import { AppleLogoIcon } from "@phosphor-icons/react/ssr";
import { PxpSection, StoreButton } from "./pxp-section";

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

  it("keeps the phone before the text in the markup, as in the mockup", () => {
    render(<PxpSection />);
    const h2 = screen.getByRole("heading", { level: 2 });
    const tablist = screen.getByRole("tablist");
    expect(
      tablist.compareDocumentPosition(h2) & Node.DOCUMENT_POSITION_FOLLOWING,
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

  it("shows App Store and Google Play placeholders as disabled labels, not links, while the address is the stand-in", () => {
    expect(productLinks.pxpAppStore).toBe(PLACEHOLDER_HREF);
    expect(productLinks.pxpGooglePlay).toBe(PLACEHOLDER_HREF);
    render(<PxpSection />);
    expect(screen.queryAllByRole("link")).toEqual([]);
    for (const label of [
      "[Placeholder] App Store",
      "[Placeholder] Google Play",
    ]) {
      const el = screen.getByText(label).closest(".btn") as HTMLElement;
      expect(el.tagName).toBe("SPAN");
      expect(el.getAttribute("aria-disabled")).toBe("true");
      expect(el.classList.contains("btn-glass")).toBe(true);
      expect(within(el).queryByRole("img")).toBeNull();
    }
  });

  it("renders the stand-in address as a disabled label with no link", () => {
    const { container } = render(
      <StoreButton
        href={PLACEHOLDER_HREF}
        label="App Store"
        Icon={AppleLogoIcon}
      />,
    );
    const el = container.querySelector(".btn") as HTMLElement;
    expect(el.tagName).toBe("SPAN");
    expect(el.textContent).toBe("App Store");
    expect(el.getAttribute("aria-disabled")).toBe("true");
    expect(el.getAttribute("href")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("turns a real store address into a link that opens a new tab", () => {
    render(
      <StoreButton
        href="https://apps.apple.com/app/id1"
        label="App Store"
        Icon={AppleLogoIcon}
      />,
    );
    const link = screen.getByRole("link", {
      name: "App Store (opens in a new tab)",
    });
    expect(link.getAttribute("href")).toBe("https://apps.apple.com/app/id1");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link.classList.contains("btn-glass")).toBe(true);
  });

  it("uses only classes that globals.css defines", () => {
    const { container } = render(<PxpSection />);
    expect(undefinedClasses(container, /^(mt-[\d.]+|size-\d+)$/)).toEqual([]);
  });
});
