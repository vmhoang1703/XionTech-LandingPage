// Field-level translation: one object field with an `en` and a `vi` sub-field.
export const localized = (
  name: string,
  title: string,
  type: "string" | "text" | "array",
) => ({
  name,
  title,
  type: "object",
  fields: [
    {
      name: "en",
      title: "English",
      type,
      ...(type === "array" ? { of: [{ type: "block" }] } : {}),
    },
    {
      name: "vi",
      title: "Tiếng Việt",
      type,
      ...(type === "array" ? { of: [{ type: "block" }] } : {}),
    },
  ],
});
