import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { undefinedClasses } from "@/test-utils/css-classes";
import { aboutValues } from "@/content/values";
import { HomeValues } from "./home-values";

describe("HomeValues", () => {
  it("is a region named What drives us with the lede and no #values id", () => {
    const { container } = render(<HomeValues />);

    const region = screen.getByRole("region", { name: "What drives us" });
    expect(region.querySelector(".lede")?.textContent).toBe(
      "Five principles that guide how we collaborate, make decisions, and deliver meaningful results.",
    );
    expect(container.querySelector("#values")).toBeNull();
    expect(region.querySelector("h2")?.id).toBe("home-values-h");
  });

  it("shows the five principles as flip cards: label and title on the front, the line on the back", () => {
    const { container } = render(<HomeValues />);

    const cards = [
      ...container.querySelectorAll(".flip-cards > button.flip-card"),
    ];
    expect(
      cards.map((card) => [
        card.querySelector(".flip-front .flip-label")?.textContent,
        card.querySelector(".flip-front .flip-title")?.textContent,
        card.querySelector(".flip-back .flip-text")?.textContent,
      ]),
    ).toEqual([
      [
        "01 · Stay agile",
        "Adapt with purpose.",
        "Stay flexible, respond to change, and keep moving toward what matters.",
      ],
      [
        "02 · Take ownership",
        "Own the outcome.",
        "Speak up, take responsibility, and see things through from start to finish.",
      ],
      [
        "03 · Innovate",
        "Make innovation useful.",
        "Explore new ideas and technologies that create meaningful value for people and businesses.",
      ],
      [
        "04 · Grow together",
        "Better together.",
        "Share knowledge, support each other, and grow through collaboration and feedback.",
      ],
      [
        "05 · Get IT done",
        "Turn ideas into impact.",
        "Move beyond ideas and deliver practical solutions that make a difference.",
      ],
    ]);
    expect(aboutValues.items).toHaveLength(5);
    for (const card of cards) {
      expect(card.querySelector(".flip-front svg.flip-icon")).not.toBeNull();
      expect(card.querySelector(".flip-front .flip-hint")?.textContent).toBe(
        "Flip for details",
      );
      expect(card.getAttribute("aria-pressed")).toBe("false");
    }
    expect(cards.map((c) => c.classList.contains("accent"))).toEqual([
      false,
      false,
      false,
      false,
      true,
    ]);
  });

  it("defines every class it uses in globals.css", () => {
    const { container } = render(<HomeValues />);
    expect(undefinedClasses(container)).toEqual([]);
  });
});
