import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { undefinedClasses } from "@/test-utils/css-classes";
import { aboutValues } from "@/content/values";
import { HomeValues } from "./home-values";

describe("HomeValues", () => {
  it("is a region named Our core values. with the lede and no #values id", () => {
    const { container } = render(<HomeValues />);

    const region = screen.getByRole("region", { name: "Our core values." });
    expect(region.querySelector(".lede")?.textContent).toBe(
      "What guides how we work.",
    );
    expect(container.querySelector("#values")).toBeNull();
    expect(region.querySelector("h2")?.id).toBe("home-values-h");
  });

  it("renders the six values with Get IT Done featured", () => {
    const { container } = render(<HomeValues />);

    expect(container.querySelectorAll(".value")).toHaveLength(
      aboutValues.items.length,
    );
    expect(
      Array.from(container.querySelectorAll(".value h3")).map(
        (h3) => h3.textContent,
      ),
    ).toEqual([
      "Startup Spirit",
      "Client Centricity",
      "Integrity First",
      "Innovation Driven",
      '"Get IT Done" Attitude',
      "People-Centered Culture",
    ]);
    expect(container.querySelectorAll(".value.feat")).toHaveLength(1);
    expect(container.querySelector(".value.feat h3")?.textContent).toBe(
      '"Get IT Done" Attitude',
    );
  });

  it("uses only classes that globals.css defines", () => {
    const { container } = render(<HomeValues />);

    expect(undefinedClasses(container)).toEqual([]);
  });
});
