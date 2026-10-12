import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home, { metadata } from "./page";

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

// Top-level sections in page order, named by their labelling heading.
function sectionNames(container: HTMLElement) {
  return Array.from(container.querySelectorAll("section"))
    .filter((section) => !section.parentElement?.closest("section"))
    .map((section) => {
      const id = section.getAttribute("aria-labelledby") ?? "";
      return document.getElementById(id)?.textContent;
    });
}

describe("Home page", () => {
  it("sets the page title", () => {
    expect(metadata.title).toBe(
      "XionTech | School Platforms & Software Outsourcing in Vietnam",
    );
  });

  it("opens with the Home hero as the only H1", () => {
    render(<Home />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe(
      "Build smarter. Ship faster. Get IT done.",
    );
  });

  it("leaves the main landmark to the root layout", () => {
    render(<Home />);

    expect(screen.queryByRole("main")).toBeNull();
  });

  it("tells one story: hero, outcomes, apps, why, process, values, answers, news, contact", () => {
    const { container } = render(<Home />);

    expect(sectionNames(container)).toEqual([
      "Build smarter. Ship faster. Get IT done.",
      "What can we help you achieve?",
      "One connected school.",
      "Why XionTech.",
      "How we work.",
      "Our core values.",
      "Your questions, answered.",
      "Latest from XionTech.",
      "Have something you want to build?",
    ]);
  });

  it("puts the story sections on one flowing surface, not news or contact", () => {
    render(<Home />);

    const flow = screen
      .getByRole("region", { name: "What can we help you achieve?" })
      .closest(".home-flow");
    expect(flow).not.toBeNull();
    for (const name of [
      "One connected school.",
      "Why XionTech.",
      "How we work.",
      "Our core values.",
      "Your questions, answered.",
    ]) {
      expect(flow?.contains(screen.getByRole("region", { name }))).toBe(true);
    }
    const news = screen.getByRole("region", { name: "Latest from XionTech." });
    expect(flow?.contains(news)).toBe(false);
    expect(news.className).toContain("surface-mist");
  });

  it("drops the app bento and the eight service cards", () => {
    render(<Home />);

    expect(
      screen.queryByRole("heading", { name: "Eight services, one team." }),
    ).toBeNull();
    expect(document.querySelector(".bento, .svc-cards")).toBeNull();
  });

  it("puts everything below the hero on one colour field, with How we work as the navy moment", () => {
    const { container } = render(<Home />);

    const scene = container.querySelector(".page-scene");
    expect(container.firstElementChild?.nextElementSibling).toBe(scene);
    expect(scene?.querySelector("#home-outcomes-h")).not.toBeNull();
    expect(scene?.lastElementChild?.id).toBe("contact");
    const navy = Array.from(
      container.querySelectorAll(".home-flow > .surface-navy"),
    ).map((section) => section.querySelector("h2")?.textContent);
    expect(navy).toEqual(["How we work."]);
  });

  it("ends with the contact section and no capture band", () => {
    const { container } = render(<Home />);

    const contact = screen
      .getByRole("heading", { name: "Have something you want to build?" })
      .closest("section");
    const scene = container.querySelector(".page-scene");
    expect(container.lastElementChild).toBe(scene);
    expect(scene?.lastElementChild).toBe(contact);
    expect(contact?.id).toBe("contact");
    // The hero's Get in touch button lands on this section.
    expect(
      screen.getByRole("link", { name: "Get in touch" }).getAttribute("href"),
    ).toBe(`#${contact?.id}`);
    expect(container.firstElementChild?.getAttribute("aria-labelledby")).toBe(
      "home-hero-title",
    );
    const hrefs = Array.from(contact?.querySelectorAll("a") ?? []).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toEqual(
      expect.arrayContaining([
        "mailto:vinni.tran@newxion.com",
        "tel:+14693229899",
        "tel:+84908107552",
      ]),
    );
    expect(contact?.textContent).toContain("Plano +1 469 322 9899");
    expect(contact?.textContent).toContain("Ho Chi Minh City +84 908 107 552");
    expect(
      screen.getByRole("button", { name: "Start the conversation" }),
    ).toBeDefined();
    expect(
      screen.queryByRole("heading", { name: "See it working at your school." }),
    ).toBeNull();
  });
});
