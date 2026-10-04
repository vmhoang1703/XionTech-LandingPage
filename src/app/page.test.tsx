import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

// jsdom has no WebGL; the silk falls back to the static glow.
vi.mock("@/components/home/silk-shader", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/components/home/silk-shader")>()),
  createSilk: () => null,
}));

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false })),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// An async Server Component cannot render in jsdom; Story 3.7 tests it alone.
vi.mock("@/components/news/home-news", () => ({
  HomeNews: () => (
    <section className="sec surface-mist" aria-labelledby="news-h">
      <h2 id="news-h">Latest from XionTech.</h2>
    </section>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("Home page", () => {
  it("opens with the Home hero as the only H1", () => {
    render(<Home />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe("Every school community, connected.");
  });

  it("leaves the main landmark to the root layout", () => {
    render(<Home />);

    expect(screen.queryByRole("main")).toBeNull();
  });
  it("puts the two front doors directly after the hero", () => {
    const { container } = render(<Home />);

    const [hero, doors] = Array.from(container.children);
    expect(hero.getAttribute("aria-labelledby")).toBe("home-hero-title");
    expect(doors.getAttribute("aria-label")).toBe("What we do");
  });
  it("shows the 4-D process on the navy band after the services", () => {
    render(<Home />);

    const band = screen.getByRole("region", {
      name: "From your request to launch, in four steps.",
    });
    expect(band.textContent).toContain("How we work");
    expect(
      screen.getByRole("list", { name: "4-D process" }).closest("section"),
    ).toBe(band);
  });

  it("keeps the demo capture band last, after the hero", () => {
    const { container } = render(<Home />);

    const band = screen
      .getByRole("heading", { name: "See it working at your school." })
      .closest("section");
    expect(container.lastElementChild).toBe(band);
    expect(container.firstElementChild?.getAttribute("aria-labelledby")).toBe(
      "home-hero-title",
    );
    expect(screen.getByRole("button", { name: "Book a demo" })).toBeDefined();
  });

  it("puts the news section between the 4-D band and the capture band", () => {
    const { container } = render(<Home />);

    const rhythm = Array.from(container.children)
      .slice(1)
      .map((section) =>
        Array.from(section.classList).filter(
          (name) => name.startsWith("surface-") || name === "linen",
        ),
      );
    expect(rhythm).toEqual([
      [],
      ["surface-mist", "linen"],
      ["surface-paper"],
      ["surface-navy"],
      ["surface-mist"],
      ["surface-amber"],
    ]);
    const news = screen
      .getByRole("heading", { name: "Latest from XionTech." })
      .closest("section");
    expect(news?.previousElementSibling?.getAttribute("aria-labelledby")).toBe(
      screen
        .getByRole("list", { name: "4-D process" })
        .closest("section")
        ?.getAttribute("aria-labelledby"),
    );
    expect(news?.nextElementSibling).toBe(container.lastElementChild);
  });
});
