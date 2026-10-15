import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import { servicesOutcomes, servicesProcess } from "@/content/services";
import ServicesPage, { generateMetadata } from "./page";

function servicesAt(locale: string) {
  return ServicesPage({ params: Promise.resolve({ locale }) });
}

const metadata = await generateMetadata({
  params: Promise.resolve({ locale: "en" }),
});

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
  it("has the prototype title and its own description", async () => {
    expect(metadata.title).toBe("Software Outsourcing Vietnam | XionTech");
    const description = String(metadata.description);
    expect(description).toContain("product engineering");
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("renders a navy hero panel with one H1, a stable name, the rotating word and the lede", async () => {
    const { container } = render(await servicesAt("en"));

    const hero = container.querySelector("section.hero-navy.svc-hero");
    expect(hero?.getAttribute("aria-labelledby")).toBe("services-h1");
    expect(screen.queryByRole("navigation", { name: "Breadcrumb" })).toBeNull();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].id).toBe("services-h1");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "You bring your vision. We get IT done",
      }),
    ).toBe(h1s[0]);
    const lines = h1s[0].querySelectorAll(".svc-h1-line");
    expect(lines[0].textContent?.startsWith("You bring your ")).toBe(true);
    expect(lines[1].textContent).toBe("We get IT done");
    expect(lines[1].querySelector(".hl")?.textContent).toBe("IT");
    const rot = h1s[0].querySelector(".rot-word");
    expect(rot?.getAttribute("aria-hidden")).toBe("true");
    expect(
      rot?.querySelector('[data-state="in"]')?.getAttribute("data-word"),
    ).toBe("vision.");
    expect(h1s[0].textContent?.replace(/\s+/g, " ").trim()).toBe(
      "You bring your vision. We get IT done",
    );
    expect(hero?.querySelector("p.lede")?.textContent).toBe(
      "From digital products to AI integration and technology modernization, we bring the expertise to solve your challenges, accelerate innovation, and drive your business forward.",
    );
  });

  it("has a primary and a secondary call to action and none of the removed parts", async () => {
    const { container } = render(await servicesAt("en"));

    const row = container.querySelector(".cta-row");
    const links = Array.from(row?.querySelectorAll("a") ?? []);
    expect(links).toHaveLength(2);
    expect(links[0].textContent).toBe("Let's build together");
    expect(links[0].getAttribute("href")).toBe("/en#contact");
    expect(links[0].classList.contains("btn-primary")).toBe(true);
    expect(links[1].textContent).toBe("Explore our services");
    expect(links[1].getAttribute("href")).toBe("#services-all");
    expect(
      container.querySelector("section#services-all.svc-panel"),
    ).not.toBeNull();
    expect(screen.queryByText("See our 4-D process")).toBeNull();
    expect(container.querySelector(".clock-strip")).toBeNull();
    expect(screen.queryByRole("group", { name: "Key facts" })).toBeNull();
    expect(container.querySelector(".capture")).toBeNull();
    expect(container.querySelector(".surface-amber")).toBeNull();
  });

  it("defines every class it uses in globals.css", async () => {
    const { container } = render(await servicesAt("en"));
    expect(undefinedClasses(container, /^(mt-5|sr-only)$/)).toEqual([]);
  });

  it("puts the services right below the hero with the heading beside the cards", async () => {
    const { container } = render(await servicesAt("en"));

    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Eight services, one team",
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

  it("renders eight alike non-link cards with ids, icon and title in one row and copy", async () => {
    const { container } = render(await servicesAt("en"));

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

  it("shows no tag lines under the descriptions (round 13)", async () => {
    const { container } = render(await servicesAt("en"));
    expect(container.querySelector(".svc-card-tags")).toBeNull();
    expect(container.textContent).not.toContain("Azure · AWS · GCP");
  });

  it("has the four outcomes, numbered, between the services and the process", async () => {
    const { container } = render(await servicesAt("en"));

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
    expect(items.map((li) => li.querySelector("h3")?.textContent)).toEqual(
      servicesOutcomes.items.map((item) => item.title),
    );
    expect(items.map((li) => li.querySelector("p")?.textContent)).toEqual(
      servicesOutcomes.items.map((item) => item.description),
    );
    expect(section?.previousElementSibling).toBe(
      container.querySelector("section.svc-panel"),
    );
    expect(section?.nextElementSibling?.id).toBe("process");
  });

  it("styles the split, the sticky heading and the breakpoints of the prototype", async () => {
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

  it(".svc-card[id] has a scroll-margin-top that uses --spacing-anchor-offset", async () => {
    const css = globalsCss();
    expect(css).toMatch(
      /\.svc-card\[id\]\s*,\s*#outcomes\s*,\s*#process(\s*,\s*#[\w-]+)*\s*\{[^}]*scroll-margin-top[^}]*--spacing-anchor-offset/,
    );
  });

  it("places the 4-D process on a light band at #process, without a label", async () => {
    const { container } = render(await servicesAt("en"));

    const band = container.querySelector("section#process");
    expect(band?.className).toBe("sec d4");
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Our 4-D process: from your request to launch",
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

  it("passes the Services step copy to the shared 4-D flow", async () => {
    render(await servicesAt("en"));

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
    ).toEqual(servicesProcess.flow.steps.map((step) => step.line));
    expect(steps.map((s) => s.querySelector(".get span")?.textContent)).toEqual(
      servicesProcess.flow.steps.map((step) => step.receive),
    );
    expect(flow.querySelector(".node b")?.textContent).toBe("Your request");
    expect(flow.querySelector(".node.end b")?.textContent).toBe("Launch");
  });

  it("ends on the process inside the page scene, with white step cards", async () => {
    const { container } = render(await servicesAt("en"));

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

  it("#process has a scroll-margin-top that uses --spacing-anchor-offset", async () => {
    const css = globalsCss();
    expect(css).toMatch(
      /#process\s*[,{][^}]*scroll-margin-top[^}]*--spacing-anchor-offset/,
    );
  });
});
