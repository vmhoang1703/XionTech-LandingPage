import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import { servicesOutcomes } from "@/content/services";
import ServicesPage, { metadata } from "./page";

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
  it("has the prototype title and its own description", () => {
    expect(metadata.title).toBe(
      "Software Outsourcing Vietnam | Product Engineering, AI, Low-code & Cloud | XionTech",
    );
    expect(String(metadata.description)).toContain("Ho Chi Minh City");
  });

  it("renders a navy hero panel with one H1, the highlight and the lede, no breadcrumb", () => {
    const { container } = render(<ServicesPage />);

    const hero = container.querySelector("section.hero-navy.svc-hero");
    expect(hero?.getAttribute("aria-labelledby")).toBe("services-h1");
    expect(screen.queryByRole("navigation", { name: "Breadcrumb" })).toBeNull();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].id).toBe("services-h1");
    expect(h1s[0].textContent).toBe("Software teams that get IT done.");
    expect(h1s[0].querySelector(".hl")?.textContent).toBe("get IT done");
    // The shine (lead, 2026-10-13) draws its pale copy from data-text.
    const shine = h1s[0].querySelector(".hl-shine");
    expect(shine?.getAttribute("aria-hidden")).toBe("true");
    expect(shine?.getAttribute("data-text")).toBe("get IT done");
    expect(shine?.textContent).toBe("");
    expect(hero?.querySelector("p.lede")?.textContent).toContain(
      "Product engineering, AI, low-code and cloud delivery",
    );
  });

  it("has one call to action and none of the removed parts", () => {
    const { container } = render(<ServicesPage />);

    const row = container.querySelector(".cta-row");
    const links = Array.from(row?.querySelectorAll("a") ?? []);
    expect(links).toHaveLength(1);
    expect(links[0].textContent).toBe("Start a project");
    expect(links[0].getAttribute("href")).toBe("/#contact");
    expect(links[0].classList.contains("btn-primary")).toBe(true);
    expect(screen.queryByText("See our 4-D process")).toBeNull();
    expect(container.querySelector(".clock-strip")).toBeNull();
    expect(screen.queryByRole("group", { name: "Key facts" })).toBeNull();
    expect(container.querySelector(".capture")).toBeNull();
    expect(container.querySelector(".surface-amber")).toBeNull();
  });

  it("defines every class it uses in globals.css", () => {
    const { container } = render(<ServicesPage />);
    expect(undefinedClasses(container, /^(mt-5)$/)).toEqual([]);
  });

  it("puts the services right below the hero with the heading beside the cards", () => {
    const { container } = render(<ServicesPage />);

    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Eight services, one team.",
    });
    const panel = h2.closest("section");
    expect(panel?.className).toBe("sec svc-panel");
    expect(panel?.getAttribute("aria-labelledby")).toBe(h2.id);
    expect(panel?.parentElement?.previousElementSibling?.classList).toContain(
      "svc-hero",
    );
    const stick = h2.parentElement;
    expect(stick?.className).toBe("sec-head svc-stick");
    expect(stick?.querySelector("p.lede")?.textContent).toContain(
      "Pick one service or combine several",
    );
    expect(container.querySelector(".svc-split > .svc-cards")).not.toBeNull();
  });

  it("renders eight alike non-link cards with ids, icon and title in one row, copy and tags", () => {
    const { container } = render(<ServicesPage />);

    const cards = Array.from(
      container.querySelectorAll(".svc-cards > article"),
    );
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
      expect(card.className).toBe("svc-card");
      const head = card.querySelector(":scope > .svc-card-h");
      expect(head?.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
        "true",
      );
      expect(head?.querySelector("h3")?.textContent).toBeTruthy();
      expect(card.querySelector(":scope > p")?.textContent).toBeTruthy();
      expect(card.querySelectorAll("a, button")).toHaveLength(0);
    }
  });

  it("lists tags only where the prototype has them", () => {
    const { container } = render(<ServicesPage />);

    const tagsOf = (id: string) =>
      Array.from(
        container.querySelector(`#${id}`)?.querySelectorAll(".svc-card-tags") ??
          [],
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

  it("has the four outcomes, numbered, between the services and the process", () => {
    const { container } = render(<ServicesPage />);

    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "What can we help you achieve?",
    });
    const section = h2.closest("section");
    expect(section?.id).toBe("outcomes");
    expect(section?.getAttribute("aria-labelledby")).toBe(h2.id);
    const items = Array.from(
      section?.querySelectorAll("ol.outcomes > li") ?? [],
    );
    expect(within(section as HTMLElement).getByRole("list")).toBe(
      section?.querySelector("ol.outcomes"),
    );
    for (const num of Array.from(section?.querySelectorAll(".oc-num") ?? [])) {
      expect(num.getAttribute("aria-hidden")).toBe("true");
    }
    const ids = servicesOutcomes.items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(items.map((li) => li.querySelector(".oc-num")?.textContent)).toEqual(
      ["01", "02", "03", "04"],
    );
    expect(items.map((li) => li.querySelector("h3")?.textContent)).toEqual([
      "Build a new digital product",
      "Extend your team",
      "Modernise an existing platform",
      "Apply AI where it creates value",
    ]);
    expect(items[0].querySelector("p")?.textContent).toBe(
      "Move from discovery and UX into engineering, testing and launch with one delivery team.",
    );
    expect(items[3].querySelector("p")?.textContent).toBe(
      "Use AI, analytics and automation to improve products, workflows and business decision-making.",
    );
    expect(section?.previousElementSibling).toBe(
      container.querySelector("section.svc-panel"),
    );
    expect(section?.nextElementSibling?.id).toBe("process");
  });

  it("styles the split, the sticky heading and the breakpoints of the prototype", () => {
    const css = globalsCss();
    expect(css).toMatch(
      /\.svc-stick\s*\{[^}]*position:\s*sticky[^}]*top:\s*calc\(var\(--spacing-header-room\) \+ 48px\)/,
    );
    expect(css).toMatch(/@media \(width <= 980px\)\s*\{\s*\.svc-split/);
    expect(css).toMatch(/@media \(width <= 760px\)\s*\{\s*\.outcomes/);
    expect(css).toMatch(
      /@media \(width <= 640px\)\s*\{\s*\.svc-cards\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/,
    );
    expect(css).not.toMatch(/\.clock-strip/);
    expect(css).not.toMatch(/\.svc-grid/);
  });

  it(".svc-card[id] has a scroll-margin-top that uses --spacing-anchor-offset", () => {
    const css = globalsCss();
    expect(css).toMatch(
      /\.svc-card\[id\]\s*,\s*#outcomes\s*,\s*#process(\s*,\s*#[\w-]+)*\s*\{[^}]*scroll-margin-top[^}]*--spacing-anchor-offset/,
    );
  });

  it("places the 4-D process on a light band at #process, without a label", () => {
    const { container } = render(<ServicesPage />);

    const band = container.querySelector("section#process");
    expect(band?.className).toBe("sec d4");
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Our 4-D process: from your request to launch.",
    });
    expect(band?.getAttribute("aria-labelledby")).toBe(h2.id);
    const head = h2.parentElement;
    expect(head?.className).toBe("sec-head");
    expect(head?.querySelector(".label")).toBeNull();
    expect(head?.querySelector("p.lede")?.textContent).toBe(
      "Every step ends with something you can see, test and approve. AI runs through every step, and we keep improving how we use it.",
    );
    expect(container.querySelectorAll("section.surface-navy")).toHaveLength(0);
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

  it("ends on the process inside the page scene, with white step cards", () => {
    const { container } = render(<ServicesPage />);

    const scene = container.querySelector(".page-scene");
    expect(scene?.lastElementChild?.id).toBe("process");
    expect(container.lastElementChild).toBe(scene);
    expect(container.firstElementChild?.classList).toContain("svc-hero");
    expect(container.querySelectorAll(".hero-navy")).toHaveLength(1);
    const css = globalsCss();
    expect(css).toMatch(
      /#process \.step4[^{]*\{[^}]*background:\s*var\(--color-white\)/,
    );
  });

  it("#process has a scroll-margin-top that uses --spacing-anchor-offset", () => {
    const css = globalsCss();
    expect(css).toMatch(
      /#process\s*[,{][^}]*scroll-margin-top[^}]*--spacing-anchor-offset/,
    );
  });
});
