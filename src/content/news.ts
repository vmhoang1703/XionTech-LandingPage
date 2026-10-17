import type { Locale } from "@/i18n/locales";

// Home "latest news" copy. Kept out of the components so it can be translated later.

export const homeNews = {
  heading: "Latest from XionTech",
  lede: "Explore what we’re building, the ideas we’re exploring, and the people behind our work.",
  seeAll: { href: "/news", label: "See all news" },
  readStory: "Read story",
};

export const categoryLabels: Record<string, string> = {
  schools: "Schools",
  students: "Students",
  parents: "Parents",
  company: "Company",
};

export const newsMeta = {
  title: "Technology news and stories | AI and school technology | XionTech",
  description:
    "Company news, client visits and stories on AI and school technology from the XionTech team.",
};

// News page copy (Story 6.1, E-A6). The count strings stay here so they can be
// translated later (Story 1.2).
export const newsPage = {
  title: "Catch up with us",
  sub: "Stay informed with the latest news and announcements, fresh off the press.",
  storiesHeading: "All stories",
  filtersLabel: "Filter stories by audience",
  allFilter: { id: "all", label: "All" },
  empty: "No stories are available in this category yet.",
  showAll: "Show all",
  // Plain strings, since a client component receives them: "{n}" is the number.
  countOne: "Showing 1 story",
  countMany: "Showing {n} stories",
};

/**
 * "Showing 3 stories" in the page's language. The locale's plural rules pick the
 * form (French uses the singular for 0 as well as 1).
 */
export function storyCount(
  page: { countOne: string; countMany: string },
  n: number,
  locale: Locale,
): string {
  const one = new Intl.PluralRules(locale).select(n) === "one";
  return (one ? page.countOne : page.countMany).replace("{n}", String(n));
}

// Story page copy (Story 6.2, E-A6).
export const newsStory = {
  storyLabel: "Story",
  backToNews: { href: "/news", label: "Back to News" },
  metaTitle: (title: string) => `${title} | XionTech`,
  share: {
    heading: "Share this story",
    linkedin: "Share on LinkedIn",
    facebook: "Share on Facebook",
    newTab: "(opens in a new tab)",
    copy: "Copy link",
    copied: "Link copied",
    copyFailed: "Could not copy the link. Copy it from the address bar.",
  },
  moreStories: "More stories",
};

// Vietnamese. Prototype `data-vi` text where the English still matches, the
// rest AI-translated for native review (docs/translations/vi-review.md).
export const homeNewsVi: typeof homeNews = {
  heading: "Tin mới từ XionTech",
  lede: "Khám phá những gì chúng tôi đang xây dựng, những ý tưởng chúng tôi đang theo đuổi và những con người đứng sau công việc của chúng tôi.",
  seeAll: { href: homeNews.seeAll.href, label: "Xem tất cả tin tức" },
  readStory: "Đọc tiếp",
};

export const categoryLabelsVi: typeof categoryLabels = {
  schools: "Trường học",
  students: "Học sinh",
  parents: "Phụ huynh",
  company: "Công ty",
};

export const newsMetaVi: typeof newsMeta = {
  title:
    "Tin tức và câu chuyện công nghệ | AI và công nghệ trường học | XionTech",
  description:
    "Tin tức công ty, các chuyến thăm khách hàng và câu chuyện về AI và công nghệ trường học từ đội ngũ XionTech.",
};

export const newsPageVi: typeof newsPage = {
  title: "Cập nhật cùng chúng tôi",
  sub: "Luôn nắm bắt những tin tức và thông báo mới nhất, nóng hổi vừa ra lò.",
  storiesHeading: "Tất cả tin",
  filtersLabel: "Lọc tin theo đối tượng",
  allFilter: { id: newsPage.allFilter.id, label: "Tất cả" },
  empty: "Chưa có tin nào trong mục này.",
  showAll: "Xem tất cả",
  countOne: "Đang hiển thị 1 tin",
  countMany: "Đang hiển thị {n} tin",
};

export const newsStoryVi: typeof newsStory = {
  storyLabel: "Nội dung tin",
  backToNews: { href: newsStory.backToNews.href, label: "Quay lại Tin tức" },
  metaTitle: newsStory.metaTitle,
  share: {
    heading: "Chia sẻ tin này",
    linkedin: "Chia sẻ lên LinkedIn",
    facebook: "Chia sẻ lên Facebook",
    newTab: "(mở trong thẻ mới)",
    copy: "Sao chép liên kết",
    copied: "Đã sao chép liên kết",
    copyFailed: "Không sao chép được liên kết. Hãy sao chép từ thanh địa chỉ.",
  },
  moreStories: "Tin khác",
};
