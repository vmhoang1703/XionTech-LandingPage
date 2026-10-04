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

export type OpenRoleDetail = OpenRole & {
  about?: string | null;
  responsibilities?: string[] | null;
  requirements?: string[] | null;
};

const OPEN_ROLE_QUERY = `*[_type == "job" && closed != true && defined(slug.current) && defined(title.en) && slug.current == $slug][0] {
  "slug": slug.current,
  "title": title.en,
  "team": team.en,
  "location": location.en,
  type,
  "about": pt::text(description.en),
  "responsibilities": responsibilities.en,
  "requirements": requirements.en
}`;

const TYPE_LABELS = new Map<string, string>([
  ["full-time", "Full-time"],
  ["part-time", "Part-time"],
  ["contract", "Contract"],
  ["internship", "Internship"],
]);

export function getOpenRoles(): Promise<OpenRole[]> {
  return sanityFetch<OpenRole[]>({ query: OPEN_ROLES_QUERY, tags: ["job"] });
}

export async function getOpenRole(
  slug: string,
): Promise<OpenRoleDetail | null> {
  const role = await sanityFetch<OpenRoleDetail | OpenRoleDetail[] | null>({
    query: OPEN_ROLE_QUERY,
    params: { slug },
    tags: ["job"],
  });
  return !role || Array.isArray(role) ? null : role;
}

export function roleMeta({ team, location, type }: OpenRole): string {
  const typeLabel = type ? TYPE_LABELS.get(type) : undefined;
  return [team, location, typeLabel].filter(Boolean).join(" · ");
}
