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
      // Home and News list only posts with a slug and a date (decision A9).
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Product", value: "product" },
          { title: "Company", value: "company" },
          { title: "Schools", value: "schools" },
          { title: "Team", value: "team" },
        ],
      },
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "app",
      title: "App",
      type: "string",
      options: {
        list: [
          { title: "PXP", value: "PXP" },
          { title: "LXP", value: "LXP" },
          { title: "SXP", value: "SXP" },
          { title: "IoT", value: "IoT" },
        ],
      },
      hidden: ({ document }: { document?: { category?: string } }) =>
        document?.category !== "product",
    },
    localized("excerpt", "Excerpt", "text"),
    localized("body", "Body", "array"),
  ],
  // Lists in the Studio show the English title instead of "Untitled".
  preview: { select: { title: "title.en", subtitle: "publishedAt" } },
};
