import { localized } from "./localized";

type AltContext = { document?: { image?: { asset?: unknown } } };
type CustomRule = {
  custom: (fn: (value: unknown, ctx: AltContext) => unknown) => unknown;
};

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
      title: "Audience",
      type: "string",
      options: {
        list: [
          { title: "Schools", value: "schools" },
          { title: "Students", value: "students" },
          { title: "Parents", value: "parents" },
          { title: "Company", value: "company" },
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
          { title: "Parent Hub", value: "parent-hub" },
          { title: "Staff Hub", value: "staff-hub" },
          { title: "AI Tutor", value: "ai-tutor" },
        ],
      },
    },
    {
      name: "image",
      title: "Photo",
      type: "image",
    },
    {
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the photo for people who cannot see it.",
      validation: (rule: CustomRule) =>
        rule.custom((value, ctx) => {
          const hasImage = Boolean(ctx.document?.image?.asset);
          const hasAlt = typeof value === "string" && value.trim() !== "";
          return !hasImage || hasAlt
            ? true
            : "Describe the photo for screen readers.";
        }),
    },
    localized("excerpt", "Excerpt", "text"),
    localized("body", "Body", "array"),
  ],
  // Lists in the Studio show the English title instead of "Untitled".
  preview: { select: { title: "title.en", subtitle: "publishedAt" } },
};
