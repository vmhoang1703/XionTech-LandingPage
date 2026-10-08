import { fireEvent, render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOTION_KEY } from "@/lib/motion/motion-preference";
import { ProductsHero } from "./products-hero";

let reducedMotion = false;

beforeEach(() => {
  reducedMotion = false;
  localStorage.clear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: reducedMotion })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function glows(container: HTMLElement) {
  const bg = container.querySelector(".eco-bg");
  if (!bg) throw new Error("No glows");
  return bg;
}

describe("ProductsHero", () => {
  it("renders the H1 on three lines and the lede, with no button link or breadcrumb", () => {
    const { container } = render(<ProductsHero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("Built apart.Bettertogether.");
    expect(h1.querySelectorAll("br")).toHaveLength(2);
    expect(
      screen.getByText(/A connected suite for school communities/),
    ).toBeDefined();
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(container.querySelector(".btn")).toBeNull();
  });

  it("links the four diagram cards to their showcase cards, clockwise from the top left", () => {
    render(<ProductsHero />);
    const diagram = screen.getByRole("group", {
      name: "The four apps share one platform",
    });
    const links = within(diagram).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "#pxp",
      "#ai-tutor",
      "#sxp",
      "#iot",
    ]);
    expect(links.map((a) => a.querySelector("b")?.textContent)).toEqual([
      "Parent Hub",
      "AI Tutor",
      "Staff Hub",
      "IoT",
    ]);
    expect(diagram.querySelector(".eco-hub")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("starts moving and pauses on click, saving the choice", () => {
    const { container } = render(<ProductsHero />);
    expect(glows(container).getAttribute("data-motion")).toBe("on");

    fireEvent.click(screen.getByRole("button", { name: "Pause motion" }));

    expect(glows(container).getAttribute("data-motion")).toBe("off");
    expect(localStorage.getItem(MOTION_KEY)).toBe("off");
    fireEvent.click(screen.getByRole("button", { name: "Play motion" }));
    expect(glows(container).getAttribute("data-motion")).toBe("on");
    expect(localStorage.getItem(MOTION_KEY)).toBe("on");
  });

  it("starts paused with a stored off, or with reduced motion and nothing stored", () => {
    localStorage.setItem(MOTION_KEY, "off");
    const first = render(<ProductsHero />);
    expect(glows(first.container).getAttribute("data-motion")).toBe("off");
    first.unmount();

    localStorage.clear();
    reducedMotion = true;
    const { container } = render(<ProductsHero />);
    expect(glows(container).getAttribute("data-motion")).toBe("off");
    expect(screen.getByRole("button", { name: "Play motion" })).toBeDefined();
  });

  it("server-renders no Pause motion button and no motion state", () => {
    const html = renderToString(<ProductsHero />);
    expect(html).not.toContain("eco-toggle");
    expect(html).not.toContain("data-motion");
  });

  it("hides the glows from assistive technology", () => {
    const { container } = render(<ProductsHero />);
    expect(glows(container).getAttribute("aria-hidden")).toBe("true");
  });
});
