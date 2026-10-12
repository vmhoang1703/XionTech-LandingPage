import { fireEvent, render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import { Capabilities } from "./capabilities";

const INDUSTRIES = ["Healthcare", "Logistics", "Private Equity"];

function reveal() {
  render(<Capabilities />);
  return screen.getByRole("button", { name: /^\+3 more industries/ });
}

describe("Capabilities", () => {
  it("is Why XionTech., with a lede and the two cards", () => {
    render(<Capabilities />);

    const region = screen.getByRole("region", { name: "Why XionTech." });
    expect(
      within(region).getByText(
        "The capabilities behind every school app and every product we deliver, and a team that keeps finding smarter ways to build with AI.",
      ),
    ).toBeDefined();
    expect(
      within(region)
        .getAllByRole("heading", { level: 3 })
        .map((h) => h.textContent),
    ).toEqual([
      "Two headquarters, one working day.",
      "Deep in education. Built to adapt.",
    ]);
  });

  it("drops the products and services cards: the doors and app cards link there", () => {
    render(<Capabilities />);

    const region = screen.getByRole("region", { name: "Why XionTech." });
    expect(within(region).queryAllByRole("link")).toEqual([]);
    expect(region.querySelector(".badge")).toBeNull();
  });

  it("shows both offices: zone label in the server HTML, then the time", () => {
    const html = renderToString(<Capabilities />);
    expect(html).toContain("US Central");
    expect(html).toContain("GMT+7");

    render(<Capabilities />);
    const chips = screen.getAllByText(/^\d{2}:\d{2}$/);
    expect(chips).toHaveLength(2);
    expect(screen.getByText("HCMC").getAttribute("title")).toBe(
      "Ho Chi Minh City",
    );
  });

  it("has the three industries in the markup before any click", () => {
    const button = reveal();

    expect(button.getAttribute("aria-expanded")).toBe("false");
    for (const name of INDUSTRIES) {
      expect(screen.getByText(name)).toBeDefined();
    }
    expect(button.getAttribute("aria-label")).toBe(
      "+3 more industries: Healthcare, Logistics and Private Equity",
    );
  });

  it('toggles aria-expanded and the open state when "+3" is clicked', () => {
    const button = reveal();
    const more = button.closest(".w-more");

    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(more?.classList.contains("open")).toBe(true);

    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(more?.classList.contains("open")).toBe(false);
  });

  it("opens and closes with Enter from the keyboard, state following aria-expanded", () => {
    const button = reveal();
    const more = button.closest(".w-more");
    button.focus();

    // A browser turns Enter or Space on a button into a click.
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(more?.classList.contains("open")).toBe(true);
    expect(document.activeElement).toBe(button);

    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(more?.classList.contains("open")).toBe(false);
  });

  it("does not open the list on focus alone, so it matches aria-expanded", () => {
    expect(globalsCss()).not.toMatch(/\.w-more:focus-within/);
  });

  it("keeps the open trigger clickable at every width so a tap can close it", () => {
    expect(globalsCss()).not.toMatch(
      /\.w-more\.open \.w-more-trigger\s*\{[^}]*pointer-events:\s*none/,
    );
  });

  it("closes the list when focus leaves the reveal area", () => {
    const button = reveal();
    fireEvent.click(button);

    fireEvent.blur(button, { relatedTarget: document.body });

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.closest(".w-more")?.classList.contains("open")).toBe(false);
  });

  it("keeps the list open when focus moves inside the reveal area", () => {
    const button = reveal();
    fireEvent.click(button);

    fireEvent.blur(button, {
      relatedTarget: screen.getByText("Healthcare"),
    });

    expect(button.getAttribute("aria-expanded")).toBe("true");
  });

  it("shows the three industries in the server HTML, before JavaScript runs", () => {
    const host = document.createElement("div");
    host.innerHTML = renderToString(<Capabilities />);

    const list = host.querySelector(".w-more-list");
    expect(list?.hasAttribute("hidden")).toBe(false);
    expect(list?.closest(".w-more")?.classList.contains("open")).toBe(true);
    for (const name of INDUSTRIES) expect(list?.textContent).toContain(name);
  });

  it("hides the list once hydrated until it is opened", () => {
    const button = reveal();
    const list = button.closest(".w-more")?.querySelector(".w-more-list");

    expect(list?.hasAttribute("hidden")).toBe(true);
    fireEvent.click(button);
    expect(list?.hasAttribute("hidden")).toBe(false);
  });

  it("shows the list while a mouse hovers, without changing aria-expanded", () => {
    const button = reveal();
    const more = button.closest(".w-more") as HTMLElement;
    const list = more.querySelector(".w-more-list");

    fireEvent.pointerEnter(more, { pointerType: "mouse" });
    expect(list?.hasAttribute("hidden")).toBe(false);
    expect(more.classList.contains("open")).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("false");

    fireEvent.pointerLeave(more, { pointerType: "mouse" });
    expect(list?.hasAttribute("hidden")).toBe(true);
  });

  it("hides the list on a second click while the mouse still hovers", () => {
    const button = reveal();
    const more = button.closest(".w-more") as HTMLElement;
    const list = more.querySelector(".w-more-list");

    fireEvent.pointerEnter(more, { pointerType: "mouse" });
    fireEvent.click(button);
    expect(list?.hasAttribute("hidden")).toBe(false);
    fireEvent.click(button);

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(list?.hasAttribute("hidden")).toBe(true);
  });

  it("closes a hover-revealed list when focus leaves the reveal area", () => {
    const button = reveal();
    const more = button.closest(".w-more") as HTMLElement;

    fireEvent.pointerEnter(more, { pointerType: "mouse" });
    fireEvent.blur(button, { relatedTarget: document.body });

    expect(more.querySelector(".w-more-list")?.hasAttribute("hidden")).toBe(
      true,
    );
  });

  it("closes with Escape, whether opened by click or by hover", () => {
    const button = reveal();
    const more = button.closest(".w-more") as HTMLElement;
    const list = more.querySelector(".w-more-list");

    fireEvent.click(button);
    fireEvent.keyDown(button, { key: "Escape" });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(list?.hasAttribute("hidden")).toBe(true);

    fireEvent.pointerEnter(more, { pointerType: "mouse" });
    fireEvent.keyDown(button, { key: "Escape" });
    expect(list?.hasAttribute("hidden")).toBe(true);

    fireEvent.click(button);
    fireEvent.keyDown(button, { key: "Tab" });
    expect(list?.hasAttribute("hidden")).toBe(false);
  });

  it("ignores touch pointer enter; a tap opens through the click", () => {
    const button = reveal();
    const more = button.closest(".w-more") as HTMLElement;

    fireEvent.pointerEnter(more, { pointerType: "touch" });
    expect(more.querySelector(".w-more-list")?.hasAttribute("hidden")).toBe(
      true,
    );
  });

  it("ends with the motto", () => {
    render(<Capabilities />);

    expect(screen.getByText("Get IT Done")).toBeDefined();
    expect(screen.getByText("Built with ownership.")).toBeDefined();
    expect(
      screen.getByText("Ownership of our commitments and pride in quality."),
    ).toBeDefined();
  });

  it("only uses classes that globals.css defines", () => {
    const { container } = render(<Capabilities />);

    expect(undefinedClasses(container, /^(sr-only|wrap)$/)).toEqual([]);
    expect(globalsCss()).toMatch(/\.w-more\.open/);
  });
});
