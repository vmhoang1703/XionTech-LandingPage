import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import AboutPage, { generateMetadata } from "./page";

function aboutAt(locale: string) {
  return AboutPage({ params: Promise.resolve({ locale }) });
}

const metadata = await generateMetadata({
  params: Promise.resolve({ locale: "en" }),
});

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
  it("has its own title and an delivery-centers description", async () => {
    expect(metadata.title).toBe(
      "About XionTech | AI-driven product and engineering company",
    );
    expect(String(metadata.description)).toContain(
      "delivery centers in Plano and Ho Chi Minh City",
    );
    expect(String(metadata.description)).not.toMatch(/newxion|XionTechs/i);
  });

  it("opens with the text-only statement, the amber ownership and no illustration", async () => {
    const { container } = render(await aboutAt("en"));

    const intro = container.querySelector("section#mission.about-hero");
    expect(intro?.getAttribute("aria-labelledby")).toBe("about-h1");
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].id).toBe("about-h1");
    expect(h1s[0].textContent).toBe(
      "We’re XionTech.Technology built with ownership",
    );
    expect(h1s[0].querySelector("br")).not.toBeNull();
    expect(h1s[0].querySelector(".ah-accent")?.textContent).toBe("ownership");
    expect(intro?.querySelector("p.ah-text")?.textContent).toBe(
      "We bring people, ideas, and technology together to build meaningful digital solutions. From developing software products to exploring AI-powered innovation, we combine engineering expertise, experienced leadership, and a strong sense of ownership to help businesses move forward.",
    );
    expect(intro?.querySelector("img, .ah-peaks, :scope > svg")).toBeNull();
    expect(container.querySelector(".crumbs")).toBeNull();
    expect(container.querySelector("nav")).toBeNull();
  });

  it("links the intro to the Home contact form and Services", async () => {
    const { container } = render(await aboutAt("en"));

    const links = Array.from(
      container.querySelectorAll("#mission .ah-links a.btn"),
    );
    expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Talk to our team", "/en#contact"],
      ["Explore our services", "/en/services"],
    ]);
    for (const a of links) {
      expect(a.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("lays the seven sections in order, all but the hero on the page scene", async () => {
    const { container } = render(await aboutAt("en"));

    const scene = container.querySelector(".page-scene");
    // Round 11: one plain wrapper, so client navigation lands at the top.
    const page = container.firstElementChild;
    expect(container.children).toHaveLength(1);
    expect(page?.className).toBe("about-page");
    // The JSON-LD breadcrumb script, the hero, the scene.
    expect(page?.children).toHaveLength(3);
    expect(page?.firstElementChild?.tagName).toBe("SCRIPT");
    expect(page?.lastElementChild).toBe(scene);
    const sections = Array.from(
      container.querySelectorAll("#mission, .page-scene > section"),
    );
    expect(sections.map((s) => s.id)).toEqual([
      "mission",
      "story",
      "values",
      "faq",
      "offices",
      "next",
    ]);
    expect(
      sections.slice(1).map((s) => s.querySelector("h2")?.textContent),
    ).toEqual([
      "Inspired by a mountain.Driven by purpose",
      "What drives us",
      "Curious about XionTech?",
      "Two delivery centers. One connected team",
      "Let’s build what’s next",
    ]);
    expect(container.querySelectorAll(".surface-navy")).toHaveLength(0);
    expect(container.querySelector("form, .capture")).toBeNull();
  });

  it("tells the mountain story as one held story with the summit mark", async () => {
    const { container } = render(await aboutAt("en"));

    const section = container.querySelector("section#story.mtn");
    const h2 = screen.getByRole("heading", { level: 2, name: /Inspired by/ });
    expect(section?.getAttribute("aria-labelledby")).toBe(h2.id);
    expect(h2.querySelector(".hl")?.textContent).toBe("purpose");
    expect(section?.querySelectorAll(".mtn-ch")).toHaveLength(1);
    expect(
      Array.from(section?.querySelectorAll(".mtn-text") ?? []).map(
        (p) => p.textContent,
      ),
    ).toEqual([
      "Our name draws inspiration from a mountain, a symbol of ambition, unity, and the determination to reach new heights.",
      "That spirit shapes who we are today. We bring people and technology together, embrace challenges, and take ownership of what we build, working toward a future where innovation creates meaningful progress.",
    ]);
    expect(section?.querySelector(".mtn-summit-lit")).not.toBeNull();
    expect(section?.querySelector(".mtn-tag")?.textContent).toBe("XionTech");
    expect(section?.textContent).not.toMatch(/Placeholder|newxion/i);
  });

  it("shows What drives us: the five principles shared with Home", async () => {
    const { container } = render(await aboutAt("en"));

    const section = container.querySelector("section#values");
    expect(section?.className).toBe("sec values-drawn");
    expect(
      section?.querySelectorAll(
        ".flip-cards-drawn > button.flip-card svg.flip-ill",
      ),
    ).toHaveLength(5);
    expect(container.querySelector("#habits, .hab-grid")).toBeNull();
    expect(section?.getAttribute("aria-labelledby")).toBe("about-values-h");
    expect(section?.querySelector("p.lede")?.textContent).toBe(
      "Five principles that guide how we collaborate, make decisions, and deliver meaningful results.",
    );
    expect(
      [...(section?.querySelectorAll(".flip-front .flip-title") ?? [])].map(
        (h) => h.textContent,
      ),
    ).toEqual([
      "Adapt with purpose.",
      "Own the outcome.",
      "Make innovation useful.",
      "Better together.",
      "Turn ideas into impact.",
    ]);
  });

  it("lists five closed native questions at #faq, left 1, 3, 5 and right 2, 4", async () => {
    const { container } = render(await aboutAt("en"));

    const section = container.querySelector("section#faq");
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Curious about XionTech?",
    });
    expect(section?.getAttribute("aria-labelledby")).toBe(h2.id);
    expect(section?.querySelector("p.lede")?.textContent).toBe(
      "A few things you might want to know before working with us.",
    );
    const items = Array.from(section?.querySelectorAll(".faq > details") ?? []);
    expect(items).toHaveLength(5);
    for (const item of items) {
      expect(item.hasAttribute("open")).toBe(false);
    }
    const questions = items.map((i) => i.querySelector("summary")?.textContent);
    expect(questions.filter((_, i) => i % 2 === 0)).toEqual([
      "What does XionTech do?",
      "How does a new project begin?",
      "How do you maintain delivery quality?",
    ]);
    expect(questions.filter((_, i) => i % 2 === 1)).toEqual([
      "Which industries do you work with?",
      "How do your teams work across time zones?",
    ]);
    expect(container.querySelector(".faq-ask")).toBeNull();
  });

  it("shows two white location cards with eyebrow, city, local time and icon rows", async () => {
    const { container } = render(await aboutAt("en"));

    const section = container.querySelector("section#offices");
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Two delivery centers. One connected team",
    });
    expect(section?.getAttribute("aria-labelledby")).toBe(h2.id);
    expect(section?.querySelector("p.lede")?.textContent).toBe(
      "From Plano to Ho Chi Minh City, our teams work across time zones to support clients and keep projects moving.",
    );
    const cards = Array.from(
      section?.querySelectorAll(".loc-cards > .loc-card") ?? [],
    );
    expect(cards).toHaveLength(2);
    expect(
      cards.map((c) => c.querySelector(".loc-eyebrow")?.textContent),
    ).toEqual(["US Delivery Center", "Vietnam Delivery Center"]);
    expect(cards.map((c) => c.querySelector("h3")?.textContent)).toEqual([
      "Plano, Texas",
      "Ho Chi Minh City",
    ]);
    for (const card of cards) {
      expect(card.querySelector(".loc-time b")?.textContent).toMatch(
        /^([0-9]{2}:[0-9]{2}|--:--)$/,
      );
      expect(card.querySelector(".loc-time small")?.textContent).toBe(
        "Local time",
      );
      expect(card.querySelectorAll(".loc-row > svg")).toHaveLength(3);
      const map = card.querySelector("a.loc-map");
      expect(map?.getAttribute("href")).toContain(
        "https://www.google.com/maps/",
      );
      expect(map?.getAttribute("target")).toBe("_blank");
      expect(map?.getAttribute("rel")).toBe("noopener noreferrer");
    }
    expect(
      cards.map((c) =>
        c.querySelector('a[href^="mailto:"]')?.getAttribute("href"),
      ),
    ).toEqual([
      "mailto:vinni.tran@newxion.com",
      "mailto:vinni.tran@xiontechs.com",
    ]);
    expect(cards[0].textContent).toContain("7950 Legacy Drive, Suite 400");
    expect(cards[1].textContent).toContain(
      "Floor 15, B1 Building, 279 Nguyen Tri Phuong Street",
    );
    expect(
      cards.map((c) => c.querySelector('a[href^="tel:"]')?.textContent),
    ).toEqual(["+1 (469) 322-9899", "+84 908 107 552"]);
  });

  it("ends with the call to action: the project pill first, then Products", async () => {
    const { container } = render(await aboutAt("en"));

    const section = container.querySelector("section#next");
    expect(container.querySelector(".page-scene")?.lastElementChild).toBe(
      section,
    );
    expect(section?.querySelector("h2")?.textContent).toBe(
      "Let’s build what’s next",
    );
    expect(section?.querySelector("p.lede")?.textContent).toBe(
      "Have a product idea, a technology challenge, or an engineering team to scale? Let’s explore how we can turn your goals into meaningful solutions.",
    );
    const links = Array.from(section?.querySelectorAll("a") ?? []);
    expect(
      links.map((a) => [a.className, a.textContent, a.getAttribute("href")]),
    ).toEqual([
      ["btn btn-primary", "Let’s talk about your project", "/en#contact"],
      ["link-arrow", "Explore our products", "/en/products"],
    ]);
    expect(
      links[0].querySelector(".about-cta-arrow")?.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("links only to anchors and pages that exist", async () => {
    const { container } = render(await aboutAt("en"));
    const ids = new Set(
      Array.from(container.querySelectorAll("[id]")).map((el) => el.id),
    );
    for (const a of container.querySelectorAll('a[href^="#"]')) {
      expect(ids.has(a.getAttribute("href")!.slice(1))).toBe(true);
    }
    const internal = Array.from(container.querySelectorAll('a[href^="/"]')).map(
      (a) => a.getAttribute("href"),
    );
    expect(new Set(internal)).toEqual(
      new Set(["/en/products", "/en/services", "/en#contact"]),
    );
  });

  it("never writes newXion in the copy, only the Plano email address", async () => {
    const { container } = render(await aboutAt("en"));
    const text = (container.textContent ?? "").replaceAll(
      "vinni.tran@newxion.com",
      "",
    );
    expect(text).not.toMatch(/newxion/i);
  });

  it("never writes the brand as XionTechs", async () => {
    const html = renderToString(await aboutAt("en"));

    expect(html).not.toContain("XionTechs");
  });

  it("defines every class it uses in globals.css", async () => {
    const { container } = render(await aboutAt("en"));
    expect(undefinedClasses(container, /^(mt-4|mt-5|mt-6|sr-only)$/)).toEqual(
      [],
    );
  });

  it("the About anchors have a scroll-margin-top that uses --spacing-anchor-offset", async () => {
    expect(globalsCss()).toMatch(
      /#story,\s*#faq,\s*#offices,[^{]*\{[^}]*scroll-margin-top[^}]*--spacing-anchor-offset/,
    );
    expect(globalsCss()).toMatch(
      /#values,\s*#next\s*\{[^}]*scroll-margin-top[^}]*--spacing-anchor-offset/,
    );
  });

  it("lays the FAQ in two columns 96px apart, one column at 760px", async () => {
    const css = globalsCss();

    expect(css).toMatch(
      /\.faq\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)[^}]*column-gap:\s*96px/,
    );
    expect(css).toMatch(
      /@media \(width <= 760px\)\s*\{\s*\.faq\s*\{[^}]*grid-template-columns:\s*1fr/,
    );
  });

  it("stacks the location cards to one column at 760px", async () => {
    expect(globalsCss()).toMatch(
      /@media \(width <= 760px\)\s*\{\s*\.loc-cards\s*\{\s*grid-template-columns:\s*minmax\(0,\s*1fr\)/,
    );
  });

  it("names no people: no leadership section, no photos, no titles", async () => {
    const { container } = render(await aboutAt("en"));

    // The only pictures are the mountain story's decorative art.
    for (const img of container.querySelectorAll("img")) {
      expect(img.closest(".mtn-stage")).not.toBeNull();
      expect(img.getAttribute("alt")).toBe("");
    }
    const headings = Array.from(container.querySelectorAll("h2, h3")).map(
      (h) => h.textContent ?? "",
    );
    for (const heading of headings) {
      expect(heading).not.toMatch(/leadership|our team|founder|management/i);
    }
    expect(container.textContent).not.toMatch(
      /\b(CEO|CTO|COO|Founder|Co-founder|Director)\b|\b(Mr|Ms|Mrs)\./,
    );
    // The only email links are the two location-card contact addresses.
    expect(container.querySelectorAll('a[href^="mailto:"]')).toHaveLength(2);
  });
});

describe("AboutPage in Vietnamese", () => {
  it("has a Vietnamese title and description on vi", async () => {
    const vi = await generateMetadata({
      params: Promise.resolve({ locale: "vi" }),
    });
    expect(vi.title).toBe(
      "Về XionTech | Công ty phát triển sản phẩm và kỹ thuật dựa trên AI",
    );
    expect(String(vi.description)).toMatch(/^Gặp gỡ XionTech: /);
  });

  it("shows the Vietnamese copy and /vi links on vi", async () => {
    const { container } = render(await aboutAt("vi"));

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Chúng tôi là XionTech.Công nghệ xây dựng bằng tinh thần làm chủ",
    );
    expect(container.querySelector("#about-faq-h")?.textContent).toBe(
      "Bạn muốn biết thêm về XionTech?",
    );
    expect(
      container.querySelector(".about-cta-actions a")?.getAttribute("href"),
    ).toBe("/vi#contact");
  });
});
