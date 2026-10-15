import {
  aboutCta,
  aboutFaq,
  aboutHero,
  aboutMeta,
  aboutOffices,
  aboutStory,
  aboutValuesHeading,
} from "@/content/about";
import { aboutValues } from "@/content/values";
import { describe, expect, it } from "vitest";

describe("About content", () => {
  it("has five FAQ entries and no placeholder answer", () => {
    expect(aboutFaq.items).toHaveLength(5);
    const placeholders = aboutFaq.items.filter((item) =>
      item.answer.startsWith("[Placeholder"),
    );
    expect(placeholders).toEqual([]);
  });

  it("orders the questions so the two columns read 1, 3, 5 and 2, 4", () => {
    expect(aboutFaq.items.map((item) => item.question)).toEqual([
      "What does XionTech do?",
      "Which industries do you work with?",
      "How does a new project begin?",
      "How do your teams work across time zones?",
      "How do you maintain delivery quality?",
    ]);
  });

  it("has the FAQ heading and lede, with no ask-us link", () => {
    expect(aboutFaq.title).toBe("Curious about XionTech?");
    expect(aboutFaq.lede).toBe(
      "A few things you might want to know before working with us.",
    );
    expect("ask" in aboutFaq).toBe(false);
  });

  it("has two location cards, Plano first, with their mailto emails", () => {
    expect(aboutOffices.title).toBe("Two delivery centers. One connected team");
    expect(aboutOffices.locations.map((loc) => loc.timeZone)).toEqual([
      "America/Chicago",
      "Asia/Ho_Chi_Minh",
    ]);
    expect(aboutOffices.locations.map((loc) => loc.email)).toEqual([
      {
        href: "mailto:vinni.tran@newxion.com",
        label: "vinni.tran@newxion.com",
      },
      {
        href: "mailto:vinni.tran@xiontechs.com",
        label: "vinni.tran@xiontechs.com",
      },
    ]);
    for (const loc of aboutOffices.locations) {
      expect(loc.mapHref).toContain(
        "https://www.google.com/maps/search/?api=1&query=",
      );
    }
  });

  it("tells one story in two paragraphs, with no placeholder or old name", () => {
    expect(aboutStory.paragraphs).toHaveLength(2);
    expect(aboutStory.tagName).toBe("XionTech");
    expect(JSON.stringify(aboutStory)).not.toMatch(/Placeholder|newxion/i);
  });

  it("titles the values What drives us, five principles", () => {
    expect(aboutValuesHeading.title).toBe("What drives us");
    expect(aboutValues.items).toHaveLength(5);
  });

  it("sends the call to action to Home's contact section and Products", () => {
    expect(aboutCta.primary.href).toBe("/#contact");
    expect(aboutCta.secondary.href).toBe("/products");
  });

  it("links the intro to the Home contact form and Services", () => {
    expect(aboutHero.links.map((link) => link.href)).toEqual([
      "/#contact",
      "/services",
    ]);
  });

  it("has the new page title", () => {
    expect(aboutMeta.title).toBe("About XionTech | Get IT Done");
  });

  it("says XionTech, never XionTechs", () => {
    const everything = JSON.stringify({
      aboutMeta,
      aboutHero,
      aboutStory,
      aboutFaq,
      aboutOffices,
      aboutValuesHeading,
      aboutCta,
    });
    expect(everything).not.toMatch(/XionTechs/);
  });
});
