import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import { homeDoors } from "@/content/home";
import { FrontDoors } from "./front-doors";

function door(name: RegExp) {
  render(<FrontDoors />);
  return screen.getByRole("link", { name });
}

describe("FrontDoors", () => {
  it("renders exactly two door links, one to /products and one to /services", () => {
    render(<FrontDoors />);

    const region = screen.getByRole("region", { name: "What we do" });
    expect(
      within(region)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/en/products", "/en/services"]);
  });

  it("gives both doors the pointer glow", () => {
    render(<FrontDoors />);

    for (const link of screen.getAllByRole("link")) {
      expect(link.dataset.glow).toBe("");
    }
  });

  it("shows the Products door with label, title, line and four app tiles", () => {
    const products = door(/Products for schools/);

    expect(products.getAttribute("href")).toBe("/en/products");
    expect(
      within(products).getByRole("heading", {
        name: "Platforms in one ecosystem",
      }),
    ).toBeDefined();
    for (const text of ["Products for schools", homeDoors.products.line]) {
      expect(within(products).getByText(text)).toBeDefined();
    }
    expect(
      Array.from(
        products.querySelectorAll(".door-mini b"),
        (b) => b.textContent,
      ),
    ).toEqual(homeDoors.products.badges.map((app) => app.shortName));
  });

  it("shows the Services door with label, title and line, and no chips", () => {
    const services = door(/Custom software for your business/);

    expect(services.getAttribute("href")).toBe("/en/services");
    for (const text of ["Outsourcing services", homeDoors.services.line]) {
      expect(within(services).getByText(text)).toBeDefined();
    }
    expect(services.querySelectorAll(".chip")).toHaveLength(0);
  });

  it("puts no interactive element inside either door", () => {
    render(<FrontDoors />);

    for (const link of screen.getAllByRole("link")) {
      expect(
        link.querySelector("a, button, input, select, textarea"),
      ).toBeNull();
    }
  });

  it("uses the ported door and badge classes, with the badges in mini-tiles", () => {
    render(<FrontDoors />);

    const region = screen.getByRole("region", { name: "What we do" });
    expect(region.classList.contains("doors")).toBe(true);
    const links = within(region).getAllByRole("link");
    expect(links).toHaveLength(2);
    const [products, services] = links;
    for (const name of ["door", "door-products"]) {
      expect(products.classList.contains(name)).toBe(true);
    }
    for (const name of ["door", "door-services", "surface-navy"]) {
      expect(services.classList.contains(name)).toBe(true);
    }
    expect(
      Array.from(products.querySelectorAll(".badge")).map((b) =>
        Array.from(b.classList).find((c) => c.startsWith("b-")),
      ),
    ).toEqual(["b-pxp", "b-sxp", "b-iot", "b-ait"]);
    expect(products.querySelector(".badge")?.parentElement?.className).toBe(
      "door-mini",
    );
    for (const link of [products, services]) {
      expect(link.querySelector(".go svg")?.getAttribute("aria-hidden")).toBe(
        "true",
      );
    }
    expect(
      within(services)
        .getByText("Outsourcing services")
        .classList.contains("label"),
    ).toBe(true);
  });

  it("shows the IoT badge as a CPU icon and keeps IoT in the door's name", () => {
    render(<FrontDoors />);

    const iot = document.querySelector(".b-iot");
    expect(iot?.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(iot?.querySelector(".sr-only")?.textContent).toBe("IoT");
  });

  it("uses only classes that globals.css defines, with a reduced-motion reset", () => {
    // The first build shipped class names no stylesheet defined, and every
    // class-name test still passed. Check the CSS side too.
    const { container } = render(<FrontDoors />);
    expect(
      undefinedClasses(container, /^(flex|flex-wrap|gap-\d+|sr-only)$/),
    ).toEqual([]);
    expect(globalsCss()).toMatch(
      /prefers-reduced-motion: reduce\)\s*\{\s*\.door:hover,\s*\.door:hover \.go,[^{]*\{\s*transform: none;/,
    );
  });
});
