import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { aboutValues } from "@/content/values";
import { ValueFlipCard } from "./value-flip-card";

const [agile, , , , done] = aboutValues.items;

function renderCard() {
  return render(
    <ValueFlipCard
      num="01"
      label={agile.label}
      title={agile.title}
      text={agile.text}
      drawing={agile.drawing}
      frontHint="Flip for details"
      backHint="Flip back"
    />,
  );
}

const faces = (container: HTMLElement) => ({
  front: container.querySelector(".flip-front"),
  back: container.querySelector(".flip-back"),
});

describe("ValueFlipCard", () => {
  it("is a button showing its front, with the back inert", () => {
    const { container } = renderCard();

    const button = screen.getByRole("button");
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(button.classList.contains("flipped")).toBe(false);
    const { front, back } = faces(container);
    expect(front?.textContent).toBe(
      "01 · Stay agileAdapt with purpose.Flip for details",
    );
    expect(front?.hasAttribute("inert")).toBe(false);
    expect(back?.hasAttribute("inert")).toBe(true);
    expect(back?.textContent).toBe(
      "01 · Stay agileStay flexible, respond to change, and keep moving toward what matters.Flip back",
    );
  });

  // Enter and Space on a native <button> fire this click in the browser
  // (checked by hand, UX row 12); jsdom does not synthesise it.
  it("flips on click and flips back on a second click", () => {
    const { container } = renderCard();
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.classList.contains("flipped")).toBe(true);
    expect(faces(container).front?.hasAttribute("inert")).toBe(true);
    expect(faces(container).back?.hasAttribute("inert")).toBe(false);

    fireEvent.click(button);
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(faces(container).front?.hasAttribute("inert")).toBe(false);
    expect(faces(container).back?.hasAttribute("inert")).toBe(true);
  });

  it("marks the accent card", () => {
    render(
      <ValueFlipCard
        num="05"
        label={done.label}
        title={done.title}
        text={done.text}
        drawing={done.drawing}
        accent
        frontHint="Flip for details"
        backHint="Flip back"
      />,
    );

    expect(screen.getByRole("button").classList.contains("accent")).toBe(true);
  });
});
