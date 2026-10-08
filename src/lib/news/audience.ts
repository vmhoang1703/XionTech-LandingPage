import { postApp } from "@/lib/news/post-app";

export type Audience = "schools" | "students" | "parents" | "company";

const AUDIENCES: ReadonlySet<string> = new Set([
  "schools",
  "students",
  "parents",
  "company",
]);

/**
 * The one audience of a post, or null when its category is unknown (the post
 * then shows only under All). Old categories are mapped at read time: `team`
 * is Company, and `product` follows its app.
 */
export function postAudience({
  category,
  app,
}: {
  category?: string | null;
  app?: string | null;
}): Audience | null {
  if (!category) return null;
  if (AUDIENCES.has(category)) return category as Audience;
  if (category === "team") return "company";
  if (category !== "product") return null;
  const id = postApp(app)?.id;
  if (id === "parent-hub") return "parents";
  if (id === "ai-tutor") return "students";
  return "schools";
}
