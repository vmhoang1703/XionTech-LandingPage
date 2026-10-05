import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import AboutPage, { metadata } from "./page";

vi.mock("@/components/sections/hero-art", () => ({ HeroArt: () => null }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AboutPage", () => {
  it("has its own title and description", () => {
    expect(metadata.title).toBe("About | XionTech");
    expect(String(metadata.description)).toContain("Plano");
  });

  it("renders the navy hero with crumbs and one H1 with the highlight", () => {
    const { container } = render(<AboutPage />);

    const hero = container.querySelector("section.hero-navy.page-hero");
    expect(hero?.getAttribute("aria-labelledby")).toBe("about-h1");
    const crumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(crumbs.querySelector('a[href="/"]')?.textContent).toBe("Home");
    expect(crumbs.textContent).toContain("About");
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].id).toBe("about-h1");
    expect(h1s[0].textContent).toBe(
      "Tech made simple. Solutions made powerful.",
    );
    expect(h1s[0].querySelector(".hl")?.textContent).toBe(
      "Solutions made powerful",
    );
    expect(hero?.querySelector("p.lede")?.textContent).toContain(
      "education technology company",
    );
  });

  it("lays the seven sections in order on their surfaces", () => {
    const { container } = render(<AboutPage />);

    const sections = Array.from(container.children);
    expect(sections.map((s) => s.tagName)).toEqual(Array(7).fill("SECTION"));
    expect(sections[0].classList.contains("hero-navy")).toBe(true);
    expect(sections[1].className).toBe("sec surface-paper");
    expect(sections[2].className).toBe("sec surface-mist linen");
    expect(sections[3].id).toBe("values");
    expect(sections[3].className).toBe("sec surface-paper");
    expect(sections[4].id).toBe("faq");
    expect(sections[4].className).toBe("sec surface-paper");
    expect(sections[5].className).toBe("sec surface-navy gridbg");
    expect(sections[6].className).toBe("capture surface-amber");
    expect(container.querySelectorAll(".surface-navy")).toHaveLength(1);
    expect(container.querySelectorAll(".surface-amber")).toHaveLength(1);
  });

  it("shows five figures, the fourth a placeholder, with no visible label", () => {
    render(<AboutPage />);

    const band = screen.getByRole("group", { name: "Key facts" });
    expect(band.querySelector("h2")?.className).toContain("sr-only");
    const items = Array.from(band.querySelectorAll("li"));
    expect(items.map((li) => li.querySelector("p")?.textContent)).toEqual([
      "25+",
      "24/7",
      "20+",
      "4",
      "2",
    ]);
    expect(items[3].textContent).toContain(
      "[Placeholder] School products ready to demo",
    );
  });

  it("tells the story with a photo placeholder and three checks", () => {
    const { container } = render(<AboutPage />);

    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Two strengths, one team.",
    });
    const section = h2.closest("section");
    expect(section?.getAttribute("aria-labelledby")).toBe(h2.id);
    const split = section?.querySelector(".split");
    expect(split?.querySelector(".illo b")?.textContent).toBe(
      "[Placeholder] Photo",
    );
    expect(split?.querySelector("p.lede")?.textContent).toContain("PXP, LXP");
    const checks = Array.from(container.querySelectorAll(".list-check li"));
    expect(checks).toHaveLength(3);
    expect(checks[1].textContent).toBe(
      "Led by more than 25 years of leadership experience in software.",
    );
    for (const li of checks) {
      expect(li.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("lists six values at #values with one featured cell", () => {
    const { container } = render(<AboutPage />);

    const section = container.querySelector("section#values");
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "What guides how we work.",
    });
    expect(section?.getAttribute("aria-labelledby")).toBe(h2.id);
    expect(section?.querySelector(".label")?.textContent).toBe(
      "Our core values",
    );
    const cells = Array.from(
      section?.querySelectorAll(".values > .value") ?? [],
    );
    expect(cells.map((c) => c.querySelector("h3")?.textContent)).toEqual([
      "Startup Spirit",
      "Client Centricity",
      "Integrity First",
      "Innovation Driven",
      '"Get IT Done" Attitude',
      "People-Centered Culture",
    ]);
    for (const cell of cells) {
      expect(cell.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
        "true",
      );
      expect(cell.querySelector("p")?.textContent).toBeTruthy();
    }
    const featured = section?.querySelectorAll(".feat");
    expect(featured).toHaveLength(1);
    expect(featured?.[0]).toBe(cells[4]);
  });

  it("lists nine native questions at #faq, the security answer a placeholder", () => {
    const { container } = render(<AboutPage />);

    const section = container.querySelector("section#faq");
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Frequently asked questions.",
    });
    expect(section?.getAttribute("aria-labelledby")).toBe(h2.id);
    const items = Array.from(section?.querySelectorAll(".faq > details") ?? []);
    expect(items).toHaveLength(9);
    for (const item of items) {
      expect(item.hasAttribute("open")).toBe(false);
      expect(item.querySelector(":scope > summary")?.textContent).toBeTruthy();
    }
    expect(items[0].querySelector("summary")?.textContent).toBe(
      "What does XionTech do?",
    );
    const security = items.find(
      (item) =>
        item.querySelector("summary")?.textContent ===
        "How do you keep our data secure?",
    );
    expect(
      security
        ?.querySelector(":scope > p")
        ?.textContent?.startsWith("[Placeholder]"),
    ).toBe(true);
  });

  it("shows two office cards, Plano first, with zone label, address and phone", () => {
    const { container } = render(<AboutPage />);

    const band = container.querySelector("section.surface-navy");
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Two offices, serving the world.",
    });
    expect(band?.getAttribute("aria-labelledby")).toBe(h2.id);
    const cards = Array.from(
      band?.querySelectorAll(".offices > .office-card") ?? [],
    );
    expect(cards).toHaveLength(2);
    expect(cards[0].querySelector("h3")?.textContent).toBe("Plano, Texas, USA");
    expect(cards[1].querySelector("h3")?.textContent).toBe(
      "Ho Chi Minh City, Vietnam",
    );
    expect(cards[1].querySelector(".office-tag")?.textContent).toBe(
      "Vietnam Delivery Center",
    );
    expect(cards[0].querySelector(".clock")?.textContent).toMatch(
      /^(\d{2}:\d{2}|US Central)$/,
    );
    expect(cards[0].textContent).toContain("7950 Legacy Drive, Suite 400");
    expect(cards[1].textContent).toContain("279 Nguyen Tri Phuong Street");
    for (const card of cards) {
      expect(card.querySelector('a[href^="tel:"]')).not.toBeNull();
    }
    const whatsapp = cards[0].querySelector('a[href^="https://wa.me/"]');
    expect(whatsapp?.getAttribute("target")).toBe("_blank");
    expect(whatsapp?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(cards[0].querySelector('a[href^="mailto:"]')).not.toBeNull();
  });

  it("puts both zone labels in the server HTML, Plano first", () => {
    const html = renderToString(<AboutPage />).replaceAll("<!-- -->", "");

    expect(html).toContain("US Central");
    expect(html).toContain("GMT+7");
    expect(html.indexOf("US Central")).toBeLessThan(html.indexOf("GMT+7"));
  });

  it("ends with the demo capture band in the About wording", () => {
    const { container } = render(<AboutPage />);

    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "See our apps in action.",
    });
    const capture = h2.closest("section");
    expect(capture?.className).toBe("capture surface-amber");
    expect(capture?.textContent).toContain(
      "arrange a walkthrough of PXP, LXP and SXP",
    );
    expect(capture?.querySelector('button[type="submit"]')?.textContent).toBe(
      "Book a demo",
    );
    expect(container.lastElementChild).toBe(capture);
  });

  it("never writes the brand as XionTechs", () => {
    const html = renderToString(<AboutPage />);

    expect(html).not.toContain("XionTechs");
  });

  it("defines every class it uses in globals.css", () => {
    const { container } = render(<AboutPage />);
    // The stats band is Tailwind utilities, covered by its own tests.
    container.querySelector('[role="group"][aria-labelledby]')?.remove();
    expect(undefinedClasses(container, /^(mt-4|mt-5|mt-6|sr-only)$/)).toEqual(
      [],
    );
  });

  it("#values and #faq have a scroll-margin-top that uses --spacing-anchor-offset", () => {
    expect(globalsCss()).toMatch(
      /#values\s*,\s*#faq\s*\{[^}]*scroll-margin-top[^}]*--spacing-anchor-offset/,
    );
  });

  it("puts the two office cards side by side above md, as in the prototype", () => {
    // The shared .offices rule stays one column (its base rule comes after its
    // own md query), so About widens only the grid that holds office cards.
    expect(globalsCss()).toMatch(
      /@media \(width > --theme\(--breakpoint-md\)\)\s*\{\s*\.offices:has\(> \.office-card\)\s*\{[^}]*grid-template-columns:\s*1fr 1fr/,
    );
  });
});
