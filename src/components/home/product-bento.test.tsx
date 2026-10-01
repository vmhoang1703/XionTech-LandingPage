import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductBento } from "./product-bento";

describe("ProductBento", () => {
  it("shows the section heading and four tiles, each one link to its app", () => {
    render(<ProductBento />);

    const section = screen.getByRole("region", {
      name: "Four apps. One school day.",
    });
    expect(
      within(section)
        .getAllByRole("link")
        .map((link) => [link.textContent, link.getAttribute("href")]),
    ).toEqual([
      ["PXP", "/products#pxp"],
      ["SXP", "/products#sxp"],
      ["LXP", "/products#lxp"],
      ["IoT", "/products#iot"],
    ]);
  });

  it("puts the app name next to every badge", () => {
    render(<ProductBento />);

    for (const name of ["PXP", "SXP", "LXP", "IoT"]) {
      const heading = screen.getByRole("heading", { level: 3, name });
      const tile = heading.closest("article");
      expect(tile?.querySelector("[aria-hidden='true']")?.textContent).toBe(
        name,
      );
    }
  });

  it("swaps badges for contrast on the PXP and SXP tiles and sizes the bento", () => {
    render(<ProductBento />);

    const tile = (name: string) =>
      screen.getByRole("heading", { level: 3, name }).closest("article");
    const badge = (name: string) =>
      tile(name)?.querySelector("[aria-hidden='true']")?.className;

    expect(tile("PXP")?.className).toContain("md:col-span-7");
    expect(tile("PXP")?.className).toContain("md:row-span-2");
    expect(badge("PXP")).toContain("product-badge-sxp");
    expect(tile("SXP")?.className).toContain("md:col-span-5");
    expect(badge("SXP")).toContain("product-badge-pxp");
    expect(tile("LXP")?.className).toContain("md:col-span-3");
    expect(tile("IoT")?.className).toContain("md:col-span-2");
  });

  it("keeps the mini phone non-interactive with a placeholder frame", () => {
    render(<ProductBento />);

    const pxp = screen
      .getByRole("heading", { level: 3, name: "PXP" })
      .closest("article");
    expect(
      within(pxp as HTMLElement).getByText("[Placeholder] PXP screen"),
    ).toBeDefined();
    for (const link of screen.getAllByRole("link")) {
      expect(link.querySelector("a, button, input")).toBeNull();
    }
  });
});
