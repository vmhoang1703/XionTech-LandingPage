// Home "latest news" copy. Kept out of the components so it can be translated later.

export const homeNews = {
  heading: "Latest from XionTech.",
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

// News page copy (Story 6.1). The count strings stay here so they can be
// translated later (Story 1.2).
export const newsPage = {
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbCurrent: "News",
  title: { lead: "What we've been ", highlight: "up to", tail: "." },
  lede: "Short stories about our products, schools, team and client work.",
  storiesHeading: "All stories",
  filtersLabel: "Filter stories",
  allFilter: { id: "all", label: "All" },
  empty: "No stories in this category yet.",
  showAll: "Show all",
  count: (n: number) => (n === 1 ? "Showing 1 story" : `Showing ${n} stories`),
};

// Story page copy (Story 6.2).
export const newsStory = {
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbNews: "News",
  storyLabel: "Story",
  backToNews: { href: "/news", label: "Back to News" },
  metaTitle: (title: string) => `${title} | XionTech`,
};
