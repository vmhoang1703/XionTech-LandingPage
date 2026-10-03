import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import { ProductBento } from "./product-bento";

function tile(name: string) {
  // The heading's name comes from its link's label, "PXP, Parent eXperience Place".
  const heading = screen.getByRole("heading", {
    level: 3,
    name: new RegExp(`^${name},`),
  });
  const article = heading.closest("article");
  if (!article) throw new Error(`No tile for ${name}`);
  return article;
}

describe("ProductBento", () => {
  it("shows the section heading and four tiles, each one link to its app", () => {
    render(<ProductBento />);

    const section = screen.getByRole("region", {
      name: "Four apps. One school day.",
    });
    expect(
      within(section)
        .getAllByRole("link")
        .map((link) => [
          link.getAttribute("aria-label"),
          link.getAttribute("href"),
        ]),
    ).toEqual([
      ["PXP, Parent eXperience Place", "/products#pxp"],
      ["SXP, Staff eXperience Place", "/products#sxp"],
      ["LXP, Learner eXperience Place", "/products#lxp"],
      ["IoT, Device management", "/products#iot"],
    ]);
  });

  it("uses the mist section with linen texture and the prototype section head", () => {
    render(<ProductBento />);

    const section = screen.getByRole("region", {
      name: "Four apps. One school day.",
    });
    for (const name of ["sec", "surface-mist", "linen"]) {
      expect(section.classList.contains(name)).toBe(true);
    }
    const head = section.querySelector(".sec-head");
    expect(head?.querySelector("h2")?.textContent).toBe(
      "Four apps. One school day.",
    );
    expect(head?.querySelector(".lede")).not.toBeNull();
  });

  it("puts the app name next to every badge and swaps badges on PXP and SXP", () => {
    render(<ProductBento />);

    const badges = {
      PXP: "b-sxp",
      SXP: "b-pxp",
      LXP: "b-lxp",
      IoT: "b-iot",
    } as const;
    for (const [name, badge] of Object.entries(badges)) {
      const el = tile(name).querySelector(".badge");
      expect(el?.classList.contains(badge)).toBe(true);
      expect(el?.getAttribute("aria-hidden")).toBe("true");
    }
    expect(tile("IoT").querySelector(".badge svg")).not.toBeNull();
    for (const name of ["PXP", "SXP", "LXP"]) {
      expect(tile(name).querySelector(".badge")?.textContent).toBe(name);
    }
  });

  it("hides the visible full name from screen readers, as the link already says it", () => {
    render(<ProductBento />);

    for (const name of ["PXP", "SXP", "LXP", "IoT"]) {
      expect(
        tile(name).querySelector(".full")?.getAttribute("aria-hidden"),
      ).toBe("true");
    }
  });

  it("sizes the bento with the prototype tile classes", () => {
    render(<ProductBento />);

    expect(tile("PXP").parentElement?.classList.contains("bento")).toBe(true);
    for (const [name, cls] of [
      ["PXP", "t-pxp"],
      ["SXP", "t-sxp"],
      ["LXP", "t-lxp"],
      ["IoT", "t-iot"],
    ]) {
      expect(tile(name).classList.contains("tile")).toBe(true);
      expect(tile(name).classList.contains(cls)).toBe(true);
    }
    for (const name of ["LXP", "IoT"]) {
      expect(tile(name).classList.contains("spot")).toBe(true);
    }
  });

  it("shows an arrow on every tile but IoT", () => {
    render(<ProductBento />);

    for (const name of ["PXP", "SXP", "LXP"]) {
      expect(tile(name).querySelector(".go svg")).not.toBeNull();
    }
    expect(tile("IoT").querySelector(".go")).toBeNull();
  });

  it("keeps the mini phone non-interactive with an empty placeholder frame", () => {
    render(<ProductBento />);

    const phone = tile("PXP").querySelector(".mini-phone");
    expect(phone?.getAttribute("aria-hidden")).toBe("true");
    expect(phone?.querySelector(".home-media")?.textContent).toBe(
      "[Placeholder] PXP screen",
    );
    for (const link of screen.getAllByRole("link")) {
      expect(link.querySelector("a, button, input")).toBeNull();
    }
  });

  it("uses only classes that globals.css defines", () => {
    const { container } = render(<ProductBento />);

    expect(undefinedClasses(container)).toEqual([]);
    const css = globalsCss();
    expect(css).toMatch(/@media \(hover: hover\)[^}]*\.tile:hover \.go/);
    expect(css).toMatch(
      /prefers-reduced-motion: reduce\)\s*\{\s*\.tile:hover \.go\s*\{\s*transform: none;/,
    );
    // Bento spans from 900px: PXP 7 x 2, SXP 5, LXP 3, IoT 2.
    expect(css).toMatch(
      /\.t-pxp\s*\{\s*grid-column: span 7;\s*grid-row: span 2;/,
    );
    expect(css).toMatch(/\.t-sxp\s*\{\s*grid-column: span 5;/);
    expect(css).toMatch(/\.t-lxp\s*\{\s*grid-column: span 3;/);
    expect(css).toMatch(/\.t-iot\s*\{\s*grid-column: span 2;/);
  });
});
