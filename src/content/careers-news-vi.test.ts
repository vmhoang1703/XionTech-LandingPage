import { describe, expect, it } from "vitest";
import { contentMismatches } from "@/i18n/content";
import * as careers from "./careers";
import * as job from "./job";
import * as news from "./news";
import * as privacy from "./privacy";

// Every Vietnamese dictionary has exactly the shape of its English one.
describe("Careers, job, news and privacy in Vietnamese", () => {
  it.each([
    ["careersMeta", careers.careersMeta, careers.careersMetaVi],
    ["careersHero", careers.careersHero, careers.careersHeroVi],
    ["careersGrowth", careers.careersGrowth, careers.careersGrowthVi],
    ["careersInside", careers.careersInside, careers.careersInsideVi],
    ["careersValues", careers.careersValues, careers.careersValuesVi],
    ["careersRoles", careers.careersRoles, careers.careersRolesVi],
    ["careersLife", careers.careersLife, careers.careersLifeVi],
    ["jobMeta", job.jobMeta, job.jobMetaVi],
    ["jobHero", job.jobHero, job.jobHeroVi],
    ["jobDetails", job.jobDetails, job.jobDetailsVi],
    ["jobForm", job.jobForm, job.jobFormVi],
    ["homeNews", news.homeNews, news.homeNewsVi],
    ["categoryLabels", news.categoryLabels, news.categoryLabelsVi],
    ["newsMeta", news.newsMeta, news.newsMetaVi],
    ["newsPage", news.newsPage, news.newsPageVi],
    ["newsStory", news.newsStory, news.newsStoryVi],
    ["PRIVACY", privacy.PRIVACY, privacy.PRIVACY_VI],
  ])("%s has the same keys in vi", (_, en, vi) => {
    expect(contentMismatches(en, vi)).toEqual([]);
  });

  it("keeps [Placeholder] on every vi string whose English has it", () => {
    const placeholders = (value: unknown): string[] =>
      typeof value === "string"
        ? [value]
        : value && typeof value === "object"
          ? Object.values(value).flatMap(placeholders)
          : [];
    const pairs = [
      [careers.careersValues, careers.careersValuesVi],
      [careers.careersInside, careers.careersInsideVi],
      [careers.careersGrowth, careers.careersGrowthVi],
      [careers.careersLife, careers.careersLifeVi],
      [news.newsStory, news.newsStoryVi],
      [privacy.PRIVACY, privacy.PRIVACY_VI],
    ];
    for (const [en, vi] of pairs) {
      const viStrings = placeholders(vi);
      placeholders(en).forEach((text, index) => {
        expect(viStrings[index].startsWith("[Placeholder] ")).toBe(
          text.startsWith("[Placeholder] "),
        );
      });
    }
  });

  it("counts stories in Vietnamese and keeps the story meta title", () => {
    expect(news.storyCount(news.newsPageVi, 3, "vi")).toBe(
      "Đang hiển thị 3 tin",
    );
    expect(news.storyCount(news.newsPageVi, 1, "vi")).toBe(
      "Đang hiển thị 1 tin",
    );
    expect(news.storyCount(news.newsPage, 1, "en")).toBe("Showing 1 story");
    expect(news.storyCount(news.newsPage, 2, "en")).toBe("Showing 2 stories");
    expect(news.storyCount(news.newsPage, 0, "en")).toBe("Showing 0 stories");
    const fr = {
      countOne: "{n} article affiché",
      countMany: "{n} articles affichés",
    };
    expect(news.storyCount(fr, 0, "fr")).toBe("0 article affiché");
    expect(news.storyCount(fr, 1, "fr")).toBe("1 article affiché");
    expect(news.storyCount(fr, 2, "fr")).toBe("2 articles affichés");
    expect(news.newsStoryVi.metaTitle("Tin")).toBe("Tin | XionTech");
  });
});
