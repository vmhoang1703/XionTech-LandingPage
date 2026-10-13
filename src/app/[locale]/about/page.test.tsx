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
  it("has its own title and description", () => {
    expect(metadata.title).toBe("About XionTech | Get IT Done");
    expect(String(metadata.description)).toContain("Plano");
  });

  it("marks the vi title and description as placeholder English", async () => {
    const vi = await generateMetadata({
      params: Promise.resolve({ locale: "vi" }),
    });
    expect(vi.title).toBe("[Placeholder] About XionTech | Get IT Done");
    expect(String(vi.description)).toMatch(/^\[Placeholder\] .*Plano/);
  });

  it("opens with the centred statement, the amber ownership and the peaks", async () => {
    const { container } = render(await aboutAt("en"));

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

  it("links the intro to Products and Services", async () => {
    const { container } = render(await aboutAt("en"));

    const links = Array.from(
      container.querySelectorAll("#mission .ah-links a.link-arrow"),
    );
    expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Explore our products", "/en/products"],
      ["Explore our services", "/en/services"],
    ]);
    for (const a of links) {
      expect(a.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("lays the five sections in order, all but the hero on the page scene, with no navy band", async () => {
    const { container } = render(await aboutAt("en"));

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
    expect(sections[1].className).toBe("sec surface-paper");
    expect(sections[2].className).toBe("sec surface-paper");
    expect(sections[3].className).toBe("sec surface-paper");
    expect(sections[4].className).toBe("capture capture-plain surface-paper");
    expect(container.querySelectorAll(".surface-navy")).toHaveLength(0);
    expect(container.querySelectorAll(".surface-amber")).toHaveLength(0);
  });

  it("drops the stats, Two strengths and the values", async () => {
    const { container } = render(await aboutAt("en"));

    expect(container.querySelector("#values")).toBeNull();
    expect(container.querySelector("fieldset")).toBeNull();
    expect(container.querySelector(".values")).toBeNull();
    expect(container.querySelector(".split")).toBeNull();
    expect(container.textContent).not.toContain("Two strengths");
    expect(container.textContent).not.toContain("Key facts");
  });

  it("tells the mountain story as two stacked chapters with no picture", async () => {
    const { container } = render(await aboutAt("en"));

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
    expect(section?.querySelector("img, .mtn-cue, .mtn-dots")).toBeNull();
    expect(container.querySelectorAll("#story img")).toHaveLength(0);
  });

  it("lists nine closed native questions at #faq in the new heading", async () => {
    const { container } = render(await aboutAt("en"));

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

  it("ends the FAQ grid with the ask-us-directly link to the Home contact", async () => {
    const { container } = render(await aboutAt("en"));

    const faq = container.querySelector(".faq");
    const ask = faq?.lastElementChild;
    expect(ask?.tagName).toBe("A");
    expect(ask?.className).toBe("faq-ask");
    expect(ask?.getAttribute("href")).toBe("/en#contact");
    expect(ask?.textContent).toBe("Still have a question? Ask us directly");
    expect(ask?.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(faq?.children).toHaveLength(10);
  });

  it("shows two white office cards, Plano first, with tag, icon rows and bracketed phones", async () => {
    const { container } = render(await aboutAt("en"));

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

  it("puts both zone labels in the server HTML, Plano first", async () => {
    const html = renderToString(await aboutAt("en")).replaceAll("<!-- -->", "");

    expect(html).toContain("US Central");
    expect(html).toContain("GMT+7");
    expect(html.indexOf("US Central")).toBeLessThan(html.indexOf("GMT+7"));
  });

  it("ends with the demo capture band and the Parent Hub and Staff Hub lede", async () => {
    const { container } = render(await aboutAt("en"));

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
      "Book a demo",
    );
    expect(container.querySelector(".page-scene")?.lastElementChild).toBe(
      capture,
    );
  });

  it("names the two headquarters and the other two locations", async () => {
    const html = renderToString(await aboutAt("en"));

    expect(html).toContain("Two headquarters, four locations.");
    expect(html).toContain("Also in Ha Noi and Da Nang.");
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

  it("names no people: no leadership section, no photos, no titles", async () => {
    const { container } = render(await aboutAt("en"));

    expect(container.querySelectorAll("img")).toHaveLength(0);
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

  it("renders Vietnamese copy, offices and FAQ on vi, product names in English", async () => {
    const { container } = render(await aboutAt("vi"));

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Chúng tôi là XionTech,công nghệ của tinh thần làm chủ.",
    );
    expect(
      screen.getByRole("heading", { name: "Bạn hỏi, chúng tôi trả lời" }),
    ).toBeTruthy();
    expect(container.textContent).toContain("Parent Hub");
    expect(container.textContent).toContain("Trung tâm Phát triển Hoa Kỳ");
    expect(container.textContent).toContain(
      "Ngoài ra còn có mặt tại Hà Nội và Đà Nẵng.",
    );
    expect(
      container
        .querySelector('a[href^="https://wa.me/"]')
        ?.getAttribute("aria-label"),
    ).toBe("WhatsApp (+1) 469 439 9345 (mở trong thẻ mới)");
    expect(container.textContent).not.toContain("Your question, we answer");
  });

  it("falls back to English for an unknown locale", async () => {
    render(await aboutAt("xx"));

    expect(
      screen.getByRole("heading", { name: "Your question, we answer" }),
    ).toBeTruthy();
  });
});
