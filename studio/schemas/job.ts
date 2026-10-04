import { localized } from "./localized";

export const job = {
  name: "job",
  title: "Job opening",
  type: "document",
  fields: [
    localized("title", "Title", "string"),
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    localized("team", "Team", "string"),
    localized("location", "Location", "string"),
    {
      name: "type",
      title: "Employment type",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "full-time" },
          { title: "Part-time", value: "part-time" },
          { title: "Contract", value: "contract" },
          { title: "Internship", value: "internship" },
        ],
      },
    },
    {
      name: "closed",
      title: "Closed",
      type: "boolean",
      initialValue: false,
    },
    localized("description", "Description", "array"),
  ],
  // Lists in the Studio show the English title instead of "Untitled".
  preview: { select: { title: "title.en", subtitle: "team.en" } },
};
