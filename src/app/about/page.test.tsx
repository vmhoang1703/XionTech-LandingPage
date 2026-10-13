import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import AboutPage, { metadata } from "./page";

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
    expect(metadata.title).toBe("About XionTech | Get IT Done");
    expect(String(metadata.description)).toContain("Plano");
  });

  it("opens with the centred statement, the amber ownership and the peaks", () => {
    const { container } = render(<AboutPage />);

    const intro = container.querySelector("section#mission.about-hero");
    expect(intro?.getAttribute("aria-labelledby")).toBe("about-h1");
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].id).toBe("about-h1");
    expect(h1s[0].textContent).toBe(
      "We’re XionTech,technology built with ownership.",
    );
    expect(h1s[0].querySelector("br")).not.toBeNull();
    expect(h1s[0].querySelector(".ah-accent")?.textContent).toBe("ownership");
    expect(h1s[0].querySelector(".hl")).toBeNull();
    expect(intro?.querySelector("p.ah-text")?.textContent).toContain(
      "From Ho Chi Minh City and Plano",
    );
    const peaks = intro?.querySelector("svg.ah-peaks");
    expect(peaks?.getAttribute("aria-hidden")).toBe("true");
    expect(peaks?.getAttribute("viewBox")).toBe("0 0 1440 360");
    expect(peaks?.querySelectorAll("path")).toHaveLength(5);
    expect(container.querySelector(".crumbs")).toBeNull();
    expect(container.querySelector("nav")).toBeNull();
  });

  it("links the intro to Products and Services", () => {
    const { container } = render(<AboutPage />);

    const links = Array.from(
      container.querySelectorAll("#mission .ah-links a.link-arrow"),
    );
    expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Explore our products", "/products"],
      ["Explore our services", "/services"],
    ]);
    for (const a of links) {
      expect(a.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("lays the five sections in order, all but the hero on the page scene, with no navy band", () => {
    const { container } = render(<AboutPage />);

    const scene = container.querySelector(".page-scene");
    expect(container.children).toHaveLength(2);
    expect(container.lastElementChild).toBe(scene);
    const sections = Array.from(
      container.querySelectorAll("#mission, .page-scene > section"),
    );
    expect(sections.map((s) => s.tagName)).toEqual(Array(5).fill("SECTION"));
    expect(sections.map((s) => s.id)).toEqual([
      "mission",
      "story",
      "faq",
      "offices",
      "book",
    ]);
    // The mountain story holds its own spacing (MountainStory).
    expect(sections[1].className).toBe("mtn surface-paper");
    expect(sections[2].className).toBe("sec surface-paper");
    expect(sections[3].className).toBe("sec surface-paper");
    expect(sections[4].className).toBe("capture capture-plain surface-paper");
    expect(container.querySelectorAll(".surface-navy")).toHaveLength(0);
    expect(container.querySelectorAll(".surface-amber")).toHaveLength(0);
  });

  it("drops the stats, Two strengths and the values", () => {
    const { container } = render(<AboutPage />);

    expect(container.querySelector("#values")).toBeNull();
    expect(container.querySelector("fieldset")).toBeNull();
    expect(container.querySelector(".values")).toBeNull();
    expect(container.querySelector(".split")).toBeNull();
    expect(container.textContent).not.toContain("Two strengths");
    expect(container.textContent).not.toContain("Key facts");
  });

  it("tells the mountain story: two chapters beside the mountain picture", () => {
    const { container } = render(<AboutPage />);

    const h2 = screen.getByRole("heading", { level: 2, name: /Inspired by/ });
    const section = h2.closest("section");
    expect(section?.getAttribute("aria-labelledby")).toBe(h2.id);
    expect(h2.textContent).toBe("Inspired by a mountain.United by purpose.");
    expect(h2.querySelector(".hl")?.textContent).toBe("purpose");
    const chapters = Array.from(section?.querySelectorAll("article") ?? []);
    expect(chapters).toHaveLength(2);
    expect(chapters[0].querySelector(".mtn-num")?.textContent).toBe("01");
    expect(chapters[0].querySelector("h3")?.textContent).toBe(
      "01 The inspiration",
    );
    expect(chapters[1].querySelector("h3")?.textContent).toBe("02 The purpose");
    expect(
      chapters[1]
        .querySelector(".mtn-text")
        ?.textContent?.startsWith("[Placeholder] Inspired by this vision"),
    ).toBe(true);
    const close = section?.querySelector(".mtn-close");
    expect(close?.querySelector("strong")?.textContent).toBe(
      "Our inspiration is a mountain. Our purpose is people.",
    );
    expect(close?.textContent).toContain("Vision · Community · Technology");
    // Amber's picture (lead, 2026-10-13: 1B lifts Q5): decorative and hidden
    // from screen readers, with the climb's light, dots and the X mark.
    const stage = section?.querySelector(".mtn-stage");
    expect(stage?.getAttribute("aria-hidden")).toBe("true");
    const pictures = Array.from(stage?.querySelectorAll("img") ?? []);
    expect(pictures.map((img) => img.getAttribute("alt"))).toEqual([
      "",
      "",
      "",
      "",
      "",
    ]);
    expect(
      pictures.some((img) =>
        img.getAttribute("src")?.includes("mountain-clear"),
      ),
    ).toBe(true);
    expect(stage?.querySelectorAll(".mtn-dots span")).toHaveLength(2);
    expect(chapters[0].querySelector(".mtn-cue")?.textContent).toBe("Scroll");
    // The tag names newXion only: the founding line is a placeholder (Q12).
    expect(stage?.querySelector(".mtn-tag")?.textContent).toBe("newXion");
    expect(section?.textContent).not.toContain("Founded in America");
    expect(
      container.querySelectorAll("img:not(#story .mtn-stage img)"),
    ).toHaveLength(0);
  });

  it("lists nine closed native questions at #faq in the new heading", () => {
    const { container } = render(<AboutPage />);

    const section = container.querySelector("section#faq");
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Your question, we answer",
    });
    expect(section?.getAttribute("aria-labelledby")).toBe(h2.id);
    expect(section?.querySelector("p.lede")?.textContent).toBe(
      "Straight answers about our products, our services and how we work.",
    );
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

  it("ends the FAQ grid with the ask-us-directly link to the Home contact", () => {
    const { container } = render(<AboutPage />);

    const faq = container.querySelector(".faq");
    const ask = faq?.lastElementChild;
    expect(ask?.tagName).toBe("A");
    expect(ask?.className).toBe("faq-ask");
    expect(ask?.getAttribute("href")).toBe("/#contact");
    expect(ask?.textContent).toBe("Still have a question? Ask us directly");
    expect(ask?.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(faq?.children).toHaveLength(10);
  });

  it("shows two white office cards, Plano first, with tag, icon rows and bracketed phones", () => {
    const { container } = render(<AboutPage />);

    const section = container.querySelector("section#offices");
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Two headquarters, four locations.",
    });
    expect(section?.getAttribute("aria-labelledby")).toBe(h2.id);
    const cards = Array.from(
      section?.querySelectorAll(".offices > .office-card") ?? [],
    );
    expect(cards).toHaveLength(2);
    expect(cards[0].querySelector("h3")?.textContent).toBe("Plano, Texas, USA");
    expect(cards[1].querySelector("h3")?.textContent).toBe(
      "Ho Chi Minh City, Vietnam",
    );
    expect(
      cards.map((c) => c.querySelector(".office-tag")?.textContent),
    ).toEqual(["US Delivery Center", "Vietnam Delivery Center"]);
    expect(cards[0].querySelector(".clock")?.textContent).toMatch(
      /^(\d{2}:\d{2}|US Central)$/,
    );
    expect(cards[0].textContent).toContain("7950 Legacy Drive, Suite 400");
    expect(cards[1].textContent).toContain("279 Nguyen Tri Phuong Street");
    // Plano: map pin, phone, WhatsApp, envelope. Ho Chi Minh City: map pin, phone.
    expect(cards[0].querySelectorAll(".orow svg")).toHaveLength(4);
    expect(cards[1].querySelectorAll(".orow svg")).toHaveLength(2);
    for (const icon of Array.from(container.querySelectorAll(".orow svg"))) {
      expect(icon.getAttribute("aria-hidden")).toBe("true");
    }
    expect(
      Array.from(cards[0].querySelectorAll(".orow a")).map(
        (a) => a.textContent,
      ),
    ).toEqual([
      "(+1) 469 322 9899",
      "(+1) 469 439 9345",
      "vinni.tran@newxion.com",
    ]);
    expect(
      Array.from(cards[1].querySelectorAll(".orow a")).map(
        (a) => a.textContent,
      ),
    ).toEqual(["(+84) 908 107 552"]);
    const whatsapp = cards[0].querySelector('a[href^="https://wa.me/"]');
    expect(whatsapp?.getAttribute("target")).toBe("_blank");
    expect(whatsapp?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(whatsapp?.getAttribute("aria-label")).toBe(
      "WhatsApp (+1) 469 439 9345 (opens in a new tab)",
    );
    expect(cards[1].querySelector('a[href^="mailto:"]')).toBeNull();
  });

  it("puts both zone labels in the server HTML, Plano first", () => {
    const html = renderToString(<AboutPage />).replaceAll("<!-- -->", "");

    expect(html).toContain("US Central");
    expect(html).toContain("GMT+7");
    expect(html.indexOf("US Central")).toBeLessThan(html.indexOf("GMT+7"));
  });

  it("ends with the demo capture band and the Parent Hub and Staff Hub lede", () => {
    const { container } = render(<AboutPage />);

    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "See our apps in action.",
    });
    const capture = h2.closest("section");
    expect(capture?.className).toBe("capture capture-plain surface-paper");
    expect(capture?.textContent).toContain(
      "arrange a walkthrough of Parent Hub and Staff Hub.",
    );
    expect(capture?.querySelector('button[type="submit"]')?.textContent).toBe(
      "Get in touch",
    );
    expect(container.querySelector(".page-scene")?.lastElementChild).toBe(
      capture,
    );
  });

  it("names the two headquarters and the other two locations", () => {
    const html = renderToString(<AboutPage />);

    expect(html).toContain("Two headquarters, four locations.");
    expect(html).toContain("Also in Ha Noi and Da Nang.");
  });

  it("never writes the brand as XionTechs", () => {
    const html = renderToString(<AboutPage />);

    expect(html).not.toContain("XionTechs");
  });

  it("defines every class it uses in globals.css", () => {
    const { container } = render(<AboutPage />);
    expect(undefinedClasses(container, /^(mt-4|mt-5|mt-6|sr-only)$/)).toEqual(
      [],
    );
  });

  it("the About anchors have a scroll-margin-top that uses --spacing-anchor-offset, #values is gone", () => {
    expect(globalsCss()).toMatch(
      /#story,\s*#faq,\s*#offices,\s*#book\s*\{[^}]*scroll-margin-top[^}]*--spacing-anchor-offset/,
    );
    expect(globalsCss()).not.toMatch(/#values\s*[,{]/);
  });

  it("lays the FAQ in two columns 96px apart, one column at 760px", () => {
    const css = globalsCss();

    expect(css).toMatch(
      /\.faq\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)[^}]*column-gap:\s*96px/,
    );
    expect(css).toMatch(
      /@media \(width <= 760px\)\s*\{\s*\.faq\s*\{[^}]*grid-template-columns:\s*1fr/,
    );
  });

  it("puts the two office cards at opposite edges, max 400px each, above md", () => {
    expect(globalsCss()).toMatch(
      /@media \(width > --theme\(--breakpoint-md\)\)\s*\{\s*\.offices:has\(> \.office-card\)\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*400px\)\)[^}]*justify-content:\s*space-between/,
    );
  });

  it("names no people: no leadership section, no photos, no titles", () => {
    const { container } = render(<AboutPage />);

    // No photos of people: the only pictures are the mountain story's
    // decorative mountain and X mark.
    expect(container.querySelectorAll("img:not(.mtn-stage img)")).toHaveLength(
      0,
    );
    const headings = Array.from(container.querySelectorAll("h2, h3")).map(
      (h) => h.textContent ?? "",
    );
    for (const heading of headings) {
      expect(heading).not.toMatch(/leadership|our team|founder|management/i);
    }
    expect(container.textContent).not.toMatch(
      /\b(CEO|CTO|COO|Founder|Co-founder|Director)\b|\b(Mr|Ms|Mrs)\./,
    );
    // The only address with a person's name is the office email the business supplied.
    const mailtos = Array.from(
      container.querySelectorAll('a[href^="mailto:"]'),
    );
    expect(mailtos.map((a) => a.getAttribute("href"))).toEqual([
      "mailto:vinni.tran@newxion.com",
    ]);
  });
});
