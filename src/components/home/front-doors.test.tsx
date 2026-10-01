import { render, screen, within } from "@testing-library/react";
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
});
