// Field-level translation: one object field with an `en` and a `vi` sub-field.
// "array" is rich text (blocks); "stringList" is a list of short plain strings.
const listOf = (type: string) => {
  if (type === "array") return { of: [{ type: "block" }] };
  if (type === "stringList") return { of: [{ type: "string" }] };
  return {};
};

export const localized = (
  name: string,
  title: string,
  type: "string" | "text" | "array" | "stringList",
) => ({
  name,
  title,
  type: "object",
  fields: [
    {
      name: "en",
      title: "English",
      type: type === "stringList" ? "array" : type,
      ...listOf(type),
    },
    {
      name: "vi",
      title: "Tiếng Việt",
      type: type === "stringList" ? "array" : type,
      ...listOf(type),
    },
  ],
});
