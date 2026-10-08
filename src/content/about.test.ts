import {
  aboutCapture,
  aboutFaq,
  aboutHero,
  aboutMeta,
  aboutOffices,
  aboutStats,
  aboutStory,
} from "@/content/about";
import { aboutValues } from "@/content/values";
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

  it("has six values in order, and only Get IT Done is featured", () => {
    expect(aboutValues.items.map((value) => value.title)).toEqual([
      "Startup Spirit",
      "Client Centricity",
      "Integrity First",
      "Innovation Driven",
      '"Get IT Done" Attitude',
      "People-Centered Culture",
    ]);
    const featured = aboutValues.items.filter((value) => value.featured);
    expect(featured.map((value) => value.title)).toEqual([
      '"Get IT Done" Attitude',
    ]);
    for (const value of aboutValues.items) expect(value.icon).toBeDefined();
  });

  it("has five stats, the fourth is 4 and a placeholder", () => {
    expect(aboutStats.stats).toHaveLength(5);
    expect(aboutStats.stats[3]).toMatchObject({
      value: "4",
      caption: "School products ready to demo",
      placeholder: true,
    });
    expect(aboutStats.stats.filter((stat) => stat.placeholder)).toHaveLength(1);
  });

  it("has three story check items", () => {
    expect(aboutStory.checks).toHaveLength(3);
  });

  it("says XionTech, never XionTechs", () => {
    const everything = JSON.stringify({
      aboutMeta,
      aboutHero,
      aboutStats,
      aboutStory,
      aboutValues: aboutValues.items.map(({ title, text }) => ({
        title,
        text,
      })),
      aboutFaq,
      aboutOffices,
      aboutCapture,
    });
    expect(everything).not.toMatch(/XionTechs/);
    expect(aboutFaq.items[0].question).toBe("What does XionTech do?");
  });
});
