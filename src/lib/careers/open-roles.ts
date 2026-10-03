import { sanityFetch } from "@/lib/sanity/client";

export type OpenRole = {
  slug: string;
  title: string;
  team?: string | null;
  location?: string | null;
  type?: string | null;
};

const OPEN_ROLES_QUERY = `*[_type == "job" && closed != true && defined(slug.current) && defined(title.en)] | order(title.en asc) {
  "slug": slug.current,
  "title": title.en,
  "team": team.en,
  "location": location.en,
  type
}`;

const TYPE_LABELS: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

export function getOpenRoles(): Promise<OpenRole[]> {
  return sanityFetch<OpenRole[]>({ query: OPEN_ROLES_QUERY, tags: ["job"] });
}

export function roleMeta({ team, location, type }: OpenRole): string {
  const typeLabel = type ? TYPE_LABELS[type] : undefined;
  return [team, location, typeLabel].filter(Boolean).join(" · ");
}
