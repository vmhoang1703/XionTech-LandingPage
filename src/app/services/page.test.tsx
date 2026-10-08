import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import ServicesPage, { metadata } from "./page";

vi.mock("@/components/sections/hero-art", () => ({ HeroArt: () => null }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// The 4-D reveal reads matchMedia and IntersectionObserver, which jsdom lacks.
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

describe("ServicesPage", () => {
  it("has its own title and description", () => {
    expect(metadata.title).toBe("Services | XionTech");
    expect(String(metadata.description)).toContain("Ho Chi Minh City");
  });

  it("renders the navy hero with crumbs, one H1 with the highlight, and the lede", () => {
    const { container } = render(<ServicesPage />);

    const hero = container.querySelector("section.hero-navy.page-hero");
    expect(hero?.getAttribute("aria-labelledby")).toBe("services-h1");
    const crumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(crumbs.querySelector('a[href="/"]')?.textContent).toBe("Home");
    expect(crumbs.textContent).toContain("Services");
    expect(crumbs.querySelectorAll("a")).toHaveLength(1);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].id).toBe("services-h1");
    expect(h1s[0].textContent).toBe("Software teams that get IT done.");
    expect(h1s[0].querySelector(".hl")?.textContent).toBe("get IT done");
    expect(container.querySelector("p.lede")?.textContent).toContain(
      "Product engineering, AI, low-code and cloud delivery",
    );
  });

  it("links the two calls to action", () => {
    const { container } = render(<ServicesPage />);

    const row = container.querySelector(".cta-row");
    const primary = screen.getByRole("link", { name: "Start a project" });
    expect(primary.getAttribute("href")).toBe("/demo#project");
    expect(primary.classList.contains("btn-primary")).toBe(true);
    expect(row?.contains(primary)).toBe(true);
    const glass = screen.getByRole("link", { name: "See our 4-D process" });
    expect(glass.getAttribute("href")).toBe("#process");
    expect(glass.classList.contains("btn-glass")).toBe(true);
    expect(row?.contains(glass)).toBe(true);
  });

  it("puts both zone labels in the server HTML, Ho Chi Minh City first", () => {
    const html = renderToString(<ServicesPage />).replaceAll("<!-- -->", "");

    expect(html).toContain("Ho Chi Minh City <b><span>GMT+7</span></b>");
    expect(html).toContain("Plano <b><span>US Central</span></b>");
    expect(html.indexOf("GMT+7")).toBeLessThan(html.indexOf("US Central"));
  });

  it("names the strip and gives each pill an icon and a clock", () => {
    const { container } = render(<ServicesPage />);

    const strip = screen.getByRole("group", { name: "Office local times" });
    expect(strip.classList.contains("clock-strip")).toBe(true);
    const pills = Array.from(strip.querySelectorAll(":scope > span"));
    expect(pills).toHaveLength(2);
    expect(pills[0].textContent).toContain("Ho Chi Minh City");
    expect(pills[1].textContent).toContain("Plano");
    for (const pill of pills) {
      expect(pill.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
        "true",
      );
      expect(pill.querySelector("b")?.textContent).toMatch(/^\d{2}:\d{2}$/);
    }
    expect(container.querySelectorAll(".clock-strip b")).toHaveLength(2);
  });

  it("defines every class it uses in globals.css", () => {
    const { container } = render(<ServicesPage />);
    // The stats band is Tailwind utilities, covered by its own tests.
    container.querySelector('[role="group"][aria-labelledby]')?.remove();
    // The capture band's honeypot label uses the Tailwind sr-only utility.
    expect(undefinedClasses(container, /^(mt-5|pt-10|sr-only)$/)).toEqual([]);
  });

  it("shows the five confirmed figures with amber-text suffixes", () => {
    render(<ServicesPage />);

    const band = screen.getByRole("group", { name: "Key facts" });
    const statsSection = band.closest("section");
    expect(statsSection?.className).toBe("sec surface-paper");
    expect(statsSection?.hasAttribute("aria-label")).toBe(false);
    expect(band.querySelector("h2")?.className).toContain("sr-only");
    const items = Array.from(band.querySelectorAll("li"));
    expect(items.map((li) => li.querySelector("p")?.textContent)).toEqual([
      "25+",
      "24/7",
      "20+",
      "8",
      "2",
    ]);
    const suffixes = Array.from(band.querySelectorAll("li p span"));
    expect(suffixes.map((s) => s.textContent)).toEqual(["+", "/7", "+"]);
    for (const s of suffixes) expect(s.className).toBe("text-amber-text");
  });

  it("titles the services section and lays it on mist with linen", () => {
    render(<ServicesPage />);

    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Eight services, one team.",
    });
    const section = h2.closest("section");
    expect(section?.className).toBe("sec surface-mist linen pt-10");
    expect(section?.getAttribute("aria-labelledby")).toBe(h2.id);
    expect(h2.parentElement?.className).toBe("sec-head");
    expect(h2.parentElement?.querySelector("p.lede")?.textContent).toContain(
      "Pick one service or combine several",
    );
  });

  it("renders eight non-link cards with ids, headings, copy and tags", () => {
    const { container } = render(<ServicesPage />);

    const cards = Array.from(container.querySelectorAll(".svc-grid > article"));
    expect(cards.map((c) => c.id)).toEqual([
      "product-engineering",
      "ai-analytics",
      "co-creation",
      "staffing",
      "custom-apps",
      "low-code",
      "ai-solutions",
      "cloud",
    ]);
    for (const card of cards) {
      expect(card.classList.contains("spot")).toBe(true);
      expect(card.classList.contains("svc")).toBe(true);
      expect(card.querySelector(".ic svg")?.getAttribute("aria-hidden")).toBe(
        "true",
      );
      expect(card.querySelector("h3")?.textContent).toBeTruthy();
      expect(card.querySelector("p")?.textContent).toBeTruthy();
      expect(card.querySelectorAll("a, button")).toHaveLength(0);
    }
    expect(cards[0].classList.contains("feature")).toBe(true);
    expect(cards[6].classList.contains("navy")).toBe(true);
    expect(cards[7].classList.contains("feature")).toBe(true);
    expect(cards[1].classList.contains("feature")).toBe(false);
  });

  it("lists mono tags only where the prototype has them", () => {
    const { container } = render(<ServicesPage />);

    const tagsOf = (id: string) =>
      Array.from(
        container.querySelector(`#${id}`)?.querySelectorAll(".tags") ?? [],
      ).map((t) => t.textContent);
    expect(tagsOf("product-engineering")).toEqual(["Web · Mobile"]);
    expect(tagsOf("ai-analytics")).toEqual(["AI/ML · Dashboards"]);
    expect(tagsOf("ai-solutions")).toEqual(["Generative AI · AI/ML"]);
    expect(tagsOf("low-code")).toEqual([
      "Power Platform · Make · n8n · Retool · Bubble",
    ]);
    expect(tagsOf("cloud")).toEqual(["Azure · AWS · GCP"]);
    for (const id of ["co-creation", "staffing", "custom-apps"]) {
      expect(tagsOf(id)).toEqual([]);
    }
  });

  it("styles only the clock pills, not the span LiveClock renders inside them", () => {
    const css = globalsCss();
    expect(css).toMatch(/\.clock-strip > span\s*\{/);
    expect(css).not.toMatch(/\.clock-strip span\s*\{/);
  });

  it(".svc[id] has a scroll-margin-top that uses --spacing-anchor-offset", () => {
    const css = globalsCss();
    expect(css).toMatch(
      /\.svc\[id\]\s*,\s*#process(\s*,\s*#[\w-]+)*\s*\{[^}]*scroll-margin-top[^}]*--spacing-anchor-offset/,
    );
  });

  it("places the 4-D process on a navy band at #process, after the services", () => {
    const { container } = render(<ServicesPage />);

    const band = container.querySelector("section#process");
    expect(band?.className).toBe("sec surface-navy gridbg");
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "From your request to launch, in four steps.",
    });
    expect(band?.getAttribute("aria-labelledby")).toBe(h2.id);
    const head = h2.parentElement;
    expect(head?.className).toBe("sec-head");
    expect(head?.querySelector(".label")?.textContent).toBe("Our 4-D process");
    expect(head?.querySelector("p.lede")?.textContent).toBe(
      "Every step ends with something you can see, test and approve.",
    );
    const services = container.querySelector("section.surface-mist");
    expect(services?.nextElementSibling).toBe(band);
  });

  it("passes the Services step copy to the shared 4-D flow", () => {
    render(<ServicesPage />);

    const flow = screen.getByRole("list", { name: "4-D process" });
    const steps = Array.from(flow.querySelectorAll("li.step4"));
    expect(steps.map((s) => s.querySelector("h3")?.textContent)).toEqual([
      "Discovery",
      "Design",
      "Development",
      "Deployment",
    ]);
    expect(
      steps.map((s) => s.querySelector(":scope > p")?.textContent),
    ).toEqual([
      "Workshops to understand your goals, users, risks and scope.",
      "User flows, interfaces and architecture agreed before code is written.",
      "Agile sprints with regular demos. Testing and quality assurance (QA) run inside every sprint, not at the end.",
      "A safe release, monitoring and improvement after launch.",
    ]);
    expect(steps.map((s) => s.querySelector(".get span")?.textContent)).toEqual(
      [
        "A clear scope, estimate and delivery plan.",
        "A clickable prototype and technical design.",
        "Tested, working software every sprint.",
        "A live release with ongoing support.",
      ],
    );
    expect(flow.querySelector(".node b")?.textContent).toBe("Your request");
    expect(flow.querySelector(".node.end b")?.textContent).toBe("Launch");
  });

  it("ends with the project capture band", () => {
    const { container } = render(<ServicesPage />);

    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Tell us what you're building.",
    });
    const capture = h2.closest("section");
    expect(capture?.className).toBe("capture surface-amber");
    expect(capture?.querySelector('button[type="submit"]')?.textContent).toBe(
      "Start a project",
    );
    expect(container.lastElementChild).toBe(capture);
  });

  it("keeps the colour rhythm: navy hero, navy 4-D band, one amber band", () => {
    const { container } = render(<ServicesPage />);

    expect(container.querySelectorAll(".hero-navy")).toHaveLength(1);
    expect(container.querySelectorAll(".surface-navy")).toHaveLength(1);
    expect(container.querySelectorAll(".surface-amber")).toHaveLength(1);
  });

  it("#process has a scroll-margin-top that uses --spacing-anchor-offset", () => {
    const css = globalsCss();
    expect(css).toMatch(
      /#process\s*[,{][^}]*scroll-margin-top[^}]*--spacing-anchor-offset/,
    );
  });
});
