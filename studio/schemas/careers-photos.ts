type AltContext = { parent?: { photo?: { asset?: unknown } } };
type CustomRule = {
  custom: (fn: (value: unknown, ctx: AltContext) => unknown) => unknown;
};

// One slot of the Careers "Life at XionTech" section: a photo, its alt text
// and a caption. A slot without a photo keeps its [Placeholder] frame on the site.
const slot = (name: string, title: string) => ({
  name,
  title,
  type: "object",
  fields: [
    { name: "photo", title: "Photo", type: "image" },
    {
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the photo for people who cannot see it.",
      validation: (rule: CustomRule) =>
        rule.custom((value, ctx) => {
          const hasPhoto = Boolean(ctx.parent?.photo?.asset);
          const hasAlt = typeof value === "string" && value.trim() !== "";
          return !hasPhoto || hasAlt
            ? true
            : "Describe the photo for screen readers.";
        }),
    },
    { name: "caption", title: "Caption", type: "string" },
  ],
});

export const careersPhotos = {
  name: "careersPhotos",
  title: "Careers photos",
  type: "document",
  description:
    "The three photos in the Life at XionTech section on the Careers page. Use only photos the people in them agreed to share.",
  fields: [
    slot("team", "Team photo"),
    slot("office", "Office photo"),
    slot("event", "Event photo"),
  ],
};
