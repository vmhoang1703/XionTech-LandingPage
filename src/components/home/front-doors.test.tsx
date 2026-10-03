import { render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
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
    ).toEqual(["/products", "/services"]);
  });

  it("shows the Products door with badges, line and chips", () => {
    const products = door(/Products for schools/);

    expect(products.getAttribute("href")).toBe("/products");
    expect(
      within(products).getByRole("heading", { name: "Products for schools" }),
    ).toBeDefined();
    for (const text of [
      "PXP",
      "LXP",
      "SXP",
      "IoT",
      "Connected apps for parents, students, teachers, leaders and school staff.",
      "PXP · Parents",
      "LXP · Students",
      "SXP · Staff",
      "IoT · Campus",
    ]) {
      expect(within(products).getByText(text)).toBeDefined();
    }
  });

  it("shows the Services door with label, line and chips", () => {
    const services = door(/Your software delivery team/);

    expect(services.getAttribute("href")).toBe("/services");
    for (const text of [
      "Outsourcing services",
      "Dedicated teams and end-to-end delivery for companies building digital products.",
      "Product Engineering",
      "AI-Driven Analytics",
      "Staffing",
      "Low-code",
      "Cloud",
      "+3 more",
    ]) {
      expect(within(services).getByText(text)).toBeDefined();
    }
  });

  it("puts no interactive element inside either door", () => {
    render(<FrontDoors />);

    for (const link of screen.getAllByRole("link")) {
      expect(
        link.querySelector("a, button, input, select, textarea"),
      ).toBeNull();
    }
  });

  it("uses the ported door, badge and chip classes", () => {
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
    ).toEqual(["b-pxp", "b-lxp", "b-sxp", "b-iot"]);
    expect(products.querySelectorAll(".chip")).toHaveLength(4);
    expect(services.querySelectorAll(".chip")).toHaveLength(6);
    expect(products.querySelector(".badge")?.parentElement?.className).toBe(
      "chips",
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
    const css = readFileSync(
      join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    const { container } = render(<FrontDoors />);
    const used = new Set(
      Array.from(container.querySelectorAll("[class]")).flatMap((el) =>
        Array.from(el.classList).filter((name) => !name.includes(":")),
      ),
    );
    const tailwind = /^(flex|flex-wrap|gap-\d+|sr-only)$/;
    for (const name of used) {
      if (tailwind.test(name)) continue;
      expect(css, `.${name}`).toMatch(
        new RegExp(String.raw`\.${name}[\s,:{.]`),
      );
    }
    expect(css).toMatch(
      /prefers-reduced-motion: reduce\)\s*\{\s*\.door:hover,\s*\.door:hover \.go\s*\{\s*transform: none;/,
    );
  });
});
