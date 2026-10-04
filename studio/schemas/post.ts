import { localized } from "./localized";

export const post = {
  name: "post",
  title: "News post",
  type: "document",
  fields: [
    localized("title", "Title", "string"),
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
    },
    { name: "publishedAt", title: "Published at", type: "datetime" },
    localized("excerpt", "Excerpt", "text"),
    localized("body", "Body", "array"),
  ],
  // Lists in the Studio show the English title instead of "Untitled".
  preview: { select: { title: "title.en", subtitle: "publishedAt" } },
};
