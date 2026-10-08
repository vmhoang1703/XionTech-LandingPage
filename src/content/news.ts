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
  count: (n: number) => (n === 1 ? "Showing 1 story" : `Showing ${n} stories`),
};

// Story page copy (Story 6.2, E-A6).
export const newsStory = {
  storyLabel: "Story",
  sampleNote:
    "[Placeholder] Sample story to show the layout. Replace with a real story before launch.",
  backToNews: { href: "/news", label: "Back to News" },
  metaTitle: (title: string) => `${title} | XionTech`,
};
