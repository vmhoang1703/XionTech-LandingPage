import {
  aboutCapture,
  aboutFaq,
  aboutHero,
  aboutMeta,
  aboutOffices,
  aboutStory,
} from "@/content/about";
import { describe, expect, it } from "vitest";

describe("About content", () => {
  it("has nine FAQ entries, and the data-security answer starts with [Placeholder]", () => {
    expect(aboutFaq.items).toHaveLength(9);
    const security = aboutFaq.items.find(
      (item) => item.question === "How do you keep our data secure?",
    );
    expect(security?.answer.startsWith("[Placeholder]")).toBe(true);
    const others = aboutFaq.items.filter((item) => item !== security);
    for (const item of others) {
      expect(item.answer.startsWith("[Placeholder]")).toBe(false);
    }
  });

  it("uses the prototype wording for FAQ questions 1, 3 and 5", () => {
    expect(aboutFaq.items[0].question).toBe("What does XionTechs do?");
    expect(aboutFaq.items[0].answer).toContain(
      "(Parent Hub, Staff Hub and IoT Device Management)",
    );
    expect(aboutFaq.items[2].question).toBe(
      "How can our school try Parent Hub or Staff Hub?",
    );
    expect(aboutFaq.items[4].answer).toContain(
      "Discovery, the first of our four steps,",
    );
  });

  it("has the FAQ heading, lede and the ask-us link to the Home contact", () => {
    expect(aboutFaq.title).toBe("Your question, we answer");
    expect(aboutFaq.ask).toEqual({
      label: "Still have a question? Ask us directly",
      href: "/#contact",
    });
  });

  it("has two story chapters, the founding sentence a placeholder", () => {
    expect(aboutStory.chapters.map((chapter) => chapter.number)).toEqual([
      "01",
      "02",
    ]);
    expect(aboutStory.chapters[1].text).toMatch(
      /^\[Placeholder\] Inspired by this vision, a group of pioneers established newXion in America\./,
    );
    expect(aboutStory.chapters[0].text.startsWith("[Placeholder]")).toBe(false);
  });

  it("links the intro to Products and Services", () => {
    expect(aboutHero.links.map((link) => link.href)).toEqual([
      "/products",
      "/services",
    ]);
  });

  it("has the new page title", () => {
    expect(aboutMeta.title).toBe("About XionTechs | Get IT Done");
  });

  it("says XionTechs, never XionTech (lead, 2026-10-12)", () => {
    const everything = JSON.stringify({
      aboutMeta,
      aboutHero,
      aboutStory,
      aboutFaq,
      aboutOffices,
      aboutCapture,
    });
    expect(everything).toMatch(/XionTechs/);
    expect(everything).not.toMatch(/XionTech(?!s)/);
  });
});
