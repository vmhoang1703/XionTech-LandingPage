import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { aboutFaq } from "@/content/about";
import { undefinedClasses } from "@/test-utils/css-classes";
import { HomeFaq } from "./home-faq";

describe("HomeFaq", () => {
  it("answers four About questions, in About's order", () => {
    render(<HomeFaq />);

    const region = screen.getByRole("region", {
      name: "Your questions, answered.",
    });
    expect(region.querySelector(".lede")?.textContent).toBe(aboutFaq.lede);
    const questions = Array.from(region.querySelectorAll("summary")).map(
      (summary) => summary.textContent,
    );
    expect(questions).toEqual([
      "How can our school try Parent Hub or Staff Hub?",
      "How do you work across time zones?",
      "What results can we expect?",
      "How do we give feedback during a project?",
    ]);
    for (const question of questions) {
      const item = aboutFaq.items.find((faq) => faq.question === question);
      expect(within(region).getByText(item?.answer ?? "missing")).toBeDefined();
    }
    expect(region.textContent).not.toContain("[Placeholder]");
  });

  it("opens an answer with the native details toggle", () => {
    const { container } = render(<HomeFaq />);

    const [first] = Array.from(container.querySelectorAll("details"));
    expect(first.open).toBe(false);
    fireEvent.click(first.querySelector("summary") as HTMLElement);
    expect(first.open).toBe(true);
  });

  it("links to every question on About", () => {
    const { container } = render(<HomeFaq />);

    expect(
      screen
        .getByRole("link", { name: "See all questions" })
        .getAttribute("href"),
    ).toBe("/en/about#faq");
    expect(undefinedClasses(container)).toEqual([]);
  });
});
