import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { undefinedClasses } from "@/test-utils/css-classes";
import { GainCards } from "./gain-cards";

describe("GainCards", () => {
  it("shows What you'll gain along the way with the intro and four numbered cards", () => {
    const { container } = render(<GainCards />);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2.textContent).toBe("What you’ll gain along the way");
    expect(container.querySelector(".lede")?.textContent).toBe(
      "Grow your skills, explore new technologies, and work with people who support each other. Here’s what you can look forward to at XionTech.",
    );
    const cards = [...container.querySelectorAll("ol.gain-cards > li")];
    expect(
      cards.map((c) => [
        c.querySelector(".gain-num")?.textContent,
        c.querySelector("h3")?.textContent,
      ]),
    ).toEqual([
      ["01", "Hands-on Learning"],
      ["02", "AI & New Technologies"],
      ["03", "Real-World Projects"],
      ["04", "Team Experiences"],
    ]);
    expect(cards[3].querySelector("p")?.textContent).toBe(
      "Build connections through team activities, shared learning, and celebrating wins together.",
    );
    for (const card of cards) {
      expect(
        card.querySelector(".gain-art svg")?.getAttribute("aria-hidden"),
      ).toBe("true");
    }
    expect(container.querySelector("button")).toBeNull();
    expect(container.textContent).not.toMatch(/XionTechs/);
  });

  it("defines every class it uses in globals.css", () => {
    const { container } = render(<GainCards />);
    expect(undefinedClasses(container)).toEqual([]);
  });
});
