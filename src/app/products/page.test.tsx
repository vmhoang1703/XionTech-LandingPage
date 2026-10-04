import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { productsHero, productsMeta } from "@/content/products";
import ProductsPage, { metadata } from "./page";

describe("Products page", () => {
  it("renders the H1 with the highlight on connected", () => {
    render(<ProductsPage />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("Four apps. One connected school.");
    expect(h1.querySelector(".hl")?.textContent).toBe("connected");
  });

  it("renders the amber hero with breadcrumbs and the lede", () => {
    const { container } = render(<ProductsPage />);
    expect(container.querySelector(".hero-amber")).not.toBeNull();
    const crumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(crumbs.textContent).toBe("Home/Products");
    expect(within(crumbs).getByRole("link", { name: "Home" })).toHaveProperty(
      "pathname",
      "/",
    );
    expect(screen.getByText(productsHero.lede)).toBeDefined();
  });

  it("has one navy Book a demo button to /demo#form and no Updates link", () => {
    const { container } = render(<ProductsPage />);
    const cta = screen.getByRole("link", { name: "Book a demo" });
    expect(cta.getAttribute("href")).toBe("/demo#form");
    expect(cta.classList.contains("btn-navy")).toBe(true);
    expect(container.querySelector('a[href="#updates"]')).toBeNull();
    expect(screen.queryByRole("link", { name: /updates/i })).toBeNull();
  });

  it("shows empty device frames with placeholder captions and no image", () => {
    const { container } = render(<ProductsPage />);
    expect(screen.getByText(productsHero.devices.tablet)).toBeDefined();
    expect(screen.getByText(productsHero.devices.phone)).toBeDefined();
    expect(container.querySelectorAll("img")).toHaveLength(0);
  });

  it("has a sub-nav with PXP, LXP, SXP and IoT pills in order", () => {
    render(<ProductsPage />);
    const nav = screen.getByRole("navigation", {
      name: "Products on this page",
    });
    const links = within(nav).getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual([
      "PXP",
      "LXP",
      "SXP",
      "IoT",
    ]);
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "#pxp",
      "#lxp",
      "#sxp",
      "#iot",
    ]);
    expect(nav.classList.contains("subnav")).toBe(true);
  });

  it("gives every sub-nav link a section with that id and a heading", () => {
    const { container } = render(<ProductsPage />);
    for (const id of ["pxp", "lxp", "sxp", "iot"]) {
      const section = container.querySelector(`section#${id}`);
      expect(section?.classList.contains("products-anchor")).toBe(true);
      expect(
        within(section as HTMLElement).getByRole("heading", { level: 2 }),
      ).toBeDefined();
    }
  });

  it("renders PXP, LXP, SXP and IoT sections in order, LXP to IoT in full", () => {
    const { container } = render(<ProductsPage />);
    const ids = [...container.querySelectorAll("section.products-anchor")].map(
      (section) => section.id,
    );
    expect(ids).toEqual(["pxp", "lxp", "sxp", "iot"]);
    for (const id of ["lxp", "sxp", "iot"]) {
      const section = container.querySelector(`section#${id}`);
      expect(section?.querySelector(".browser .bar-url")).not.toBeNull();
    }
  });

  it("renders the PXP story section in #pxp, not the stub", () => {
    const { container } = render(<ProductsPage />);
    const pxp = container.querySelector("section#pxp") as HTMLElement;
    expect(within(pxp).getByRole("heading", { level: 2 }).textContent).toBe(
      "The school day, in a parent's pocket.",
    );
    const tablist = within(pxp).getByRole("tablist", { name: "PXP screens" });
    expect(within(tablist).getAllByRole("tab")).toHaveLength(5);
  });

  it("sets the page metadata", () => {
    expect(metadata.title).toBe(productsMeta.title);
    expect(metadata.description).toBe(productsMeta.description);
  });

  it("uses the brand name XionTech, not XionTechs", () => {
    expect(productsMeta.title).toMatch(/\| XionTech$/);
    expect(`${productsMeta.title} ${productsMeta.description}`).not.toMatch(
      /XionTechs/,
    );
  });
});
