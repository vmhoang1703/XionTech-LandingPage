import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { undefinedClasses } from "@/test-utils/css-classes";
import { aboutValues, homeValuesHeading } from "@/content/values";
import { HomeValues } from "./home-values";

const faceText = (card: HTMLElement, face: "front" | "back") =>
  card.querySelector(`.flip-${face}`)?.textContent;

describe("HomeValues", () => {
  it("is a region named Our core values. with the lede and no #values id", () => {
    const { container } = render(<HomeValues />);

    const region = screen.getByRole("region", { name: "Our core values." });
    expect(region.querySelector(".lede")?.textContent).toBe(
      "What guides how we work. Flip a card to read each value in full.",
    );
    expect(container.querySelector("#values")).toBeNull();
    expect(region.querySelector("h2")?.id).toBe("home-values-h");
  });

  it("shows each value's title and short line, with the full text on the back", () => {
    render(<HomeValues />);

    const cards = screen.getAllByRole("button");
    expect(cards).toHaveLength(aboutValues.items.length);
    aboutValues.items.forEach(({ title, short, text }, index) => {
      const card = cards[index];
      expect(card.getAttribute("aria-pressed")).toBe("false");
      expect(faceText(card, "front")).toBe(`${title}${short}Flip for details`);
      expect(faceText(card, "back")).toBe(`${title}${text}Flip back`);
      expect(card.querySelector(".flip-back")?.hasAttribute("inert")).toBe(
        true,
      );
    });
    expect(aboutValues.items.map(({ title }) => title)).toEqual([
      "Startup Spirit",
      "Client Centricity",
      "Integrity First",
      "Innovation Driven",
      '"Get IT Done" Attitude',
      "People-Centered Culture",
    ]);
  });

  it("features Get IT Done in gold", () => {
    render(<HomeValues />);

    const accents = screen
      .getAllByRole("button")
      .filter((card) => card.classList.contains("accent"));
    expect(accents).toHaveLength(1);
    expect(
      within(accents[0]).getAllByText('"Get IT Done" Attitude'),
    ).toHaveLength(2);
  });

  it("flips a card to its full value and back", () => {
    render(<HomeValues />);

    const [card] = screen.getAllByRole("button");
    fireEvent.click(card);
    expect(card.getAttribute("aria-pressed")).toBe("true");
    expect(card.querySelector(".flip-front")?.hasAttribute("inert")).toBe(true);
    expect(card.querySelector(".flip-back")?.hasAttribute("inert")).toBe(false);
    fireEvent.click(card);
    expect(card.getAttribute("aria-pressed")).toBe("false");
  });

  it("writes every short line shorter than the full value", () => {
    for (const { short, text } of aboutValues.items) {
      expect(short.length).toBeLessThan(text.length / 3);
    }
  });

  it("uses only classes that globals.css defines", () => {
    const { container } = render(<HomeValues />);

    expect(undefinedClasses(container)).toEqual([]);
  });

  it("never writes the brand as XionTech without the s (lead, 2026-10-12)", () => {
    const { container } = render(<HomeValues />);

    expect(container.textContent).not.toMatch(/XionTech(?!s)/);
    expect(JSON.stringify(homeValuesHeading)).not.toMatch(/XionTech(?!s)/);
  });
});
