import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { careersValues } from "@/content/careers";
import { FlipCard } from "./flip-card";

const [agile] = careersValues.cards;

function renderCard() {
  return render(
    <FlipCard
      card={agile}
      num="01"
      frontHint="Flip for details"
      backHint="Flip back"
    />,
  );
}

const faces = (container: HTMLElement) => ({
  front: container.querySelector(".flip-front"),
  back: container.querySelector(".flip-back"),
});

describe("FlipCard", () => {
  it("is a button showing its front, with the back inert", () => {
    const { container } = renderCard();

    const button = screen.getByRole("button");
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(button.classList.contains("flipped")).toBe(false);
    const { front, back } = faces(container);
    expect(front?.textContent).toBe(
      "01[Placeholder] Stay agileFlip for details",
    );
    expect(front?.hasAttribute("inert")).toBe(false);
    expect(back?.hasAttribute("inert")).toBe(true);
    expect(back?.textContent).toBe(
      "01 · STAY AGILE[Placeholder] Move without losing direction.Stay flexible and adapt when new information or a better answer changes the path.Flip back",
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
      <FlipCard
        card={careersValues.cards[4]}
        num="05"
        frontHint="Flip for details"
        backHint="Flip back"
      />,
    );

    expect(screen.getByRole("button").classList.contains("accent")).toBe(true);
  });
});
