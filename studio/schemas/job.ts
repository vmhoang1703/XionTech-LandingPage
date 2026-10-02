import { localized } from "./localized";

export const job = {
  name: "job",
  title: "Job opening",
  type: "document",
  fields: [
    localized("title", "Title", "string"),
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
    localized("description", "Description", "array"),
  ],
};
