import type { Locale } from "@/i18n/locales";

// Home "latest news" copy. Kept out of the components so it can be translated later.

export const homeNews = {
  heading: "Latest from XionTech.",
  lede: "Catch up with what our team is building and shipping.",
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
  title: "News | XionTech",
  description:
    "Short stories about XionTech's products, schools, team and client work.",
};

// News page copy (Story 6.1, E-A6). The count strings stay here so they can be
// translated later (Story 1.2).
export const newsPage = {
  title: "Catch up with us",
  sub: "Stay informed with the latest news and announcements, fresh off the press.",
  storiesHeading: "All stories",
  filtersLabel: "Filter stories by audience",
  sampleNote:
    "Stories from the newXion newsroom; those marked [Placeholder] are samples.",
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
  sampleNote:
    "[Placeholder] Sample story to show the layout. Replace with a real story before launch.",
  backToNews: { href: "/news", label: "Back to News" },
  metaTitle: (title: string) => `${title} | XionTech`,
};

// Vietnamese. Prototype `data-vi` text where the English still matches, the
// rest AI-translated for native review (docs/translations/vi-review.md).
export const homeNewsVi: typeof homeNews = {
  heading: "Tin mới từ XionTech.",
  lede: "Cập nhật những gì đội ngũ chúng tôi đang xây dựng và phát hành.",
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
  title: "Tin tức | XionTech",
  description:
    "Những câu chuyện ngắn về sản phẩm, trường học, đội ngũ và các dự án khách hàng của XionTech.",
};

export const newsPageVi: typeof newsPage = {
  title: "Cập nhật cùng chúng tôi",
  sub: "Luôn nắm bắt những tin tức và thông báo mới nhất, nóng hổi vừa ra lò.",
  storiesHeading: "Tất cả tin",
  filtersLabel: "Lọc tin theo đối tượng",
  sampleNote:
    "Tin từ phòng tin tức newXion; những tin có dấu [Placeholder] là tin mẫu.",
  allFilter: { id: newsPage.allFilter.id, label: "Tất cả" },
  empty: "Chưa có tin nào trong mục này.",
  showAll: "Xem tất cả",
  countOne: "Đang hiển thị 1 tin",
  countMany: "Đang hiển thị {n} tin",
};

export const newsStoryVi: typeof newsStory = {
  storyLabel: "Nội dung tin",
  sampleNote:
    "[Placeholder] Tin mẫu để minh họa bố cục. Thay bằng tin thật trước khi ra mắt.",
  backToNews: { href: newsStory.backToNews.href, label: "Quay lại Tin tức" },
  metaTitle: newsStory.metaTitle,
};
