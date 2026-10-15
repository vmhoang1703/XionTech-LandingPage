import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { careersLife } from "@/content/careers";
import { LifeCarousel, loop } from "./life-carousel";

const SLIDES = Array.from({ length: 6 }, (_, i) => ({
  src: `/careers/life/life-0${i + 1}.webp`,
  alt: `Photo ${i + 1}`,
  caption: `Caption ${i + 1}`,
}));

const current = (c: HTMLElement) =>
  c.querySelector(".life-slide.current figcaption")?.textContent;

describe("LifeCarousel", () => {
  it("loops both ways", () => {
    expect(loop(5, 1, 6)).toBe(0);
    expect(loop(0, -1, 6)).toBe(5);
  });

  it("renders nothing with no slides", () => {
    const { container } = render(
      <LifeCarousel slides={[]} copy={careersLife} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("shows the heading, a caption pill per photo and loops with arrows and keys", () => {
    const { container } = render(
      <LifeCarousel slides={SLIDES} copy={careersLife} />,
    );
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      "Life at XionTech",
    );
    expect(container.querySelectorAll(".life-cap")).toHaveLength(6);
    expect(current(container)).toBe("Caption 1");
    fireEvent.click(screen.getByRole("button", { name: "Previous photo" }));
    expect(current(container)).toBe("Caption 6");
    fireEvent.keyDown(screen.getByRole("group"), { key: "ArrowRight" });
    expect(current(container)).toBe("Caption 1");
    expect(container.textContent).not.toMatch(/Illustrative|Sample images/);
  });
});
