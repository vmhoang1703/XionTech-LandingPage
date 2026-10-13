import type { Locale } from "@/i18n/locales";
import { sanityFetch } from "@/lib/sanity/client";

export type OpenRole = {
  slug: string;
  title: string;
  team?: string | null;
  location?: string | null;
  type?: string | null;
  /** The language of title, team and location: "en" when the locale's title is empty. */
  lang?: string | null;
};

const OPEN_ROLES_QUERY = `*[_type == "job" && closed != true && defined(slug.current) && defined(title.en)] | order(title.en asc) {
  "slug": slug.current,
  "title": coalesce(title[$locale], title.en),
  "team": coalesce(team[$locale], team.en),
  "location": coalesce(location[$locale], location.en),
  "lang": select(defined(title[$locale]) => $locale, "en"),
  type
}`;

export type OpenRoleDetail = OpenRole & {
  about?: string | null;
  responsibilities?: string[] | null;
  requirements?: string[] | null;
  /** The language of about and the lists: "en" when the locale's description is empty. */
  detailLang?: string | null;
};

const OPEN_ROLE_QUERY = `*[_type == "job" && closed != true && defined(slug.current) && defined(title.en) && slug.current == $slug][0] {
  "slug": slug.current,
  "title": coalesce(title[$locale], title.en),
  "team": coalesce(team[$locale], team.en),
  "location": coalesce(location[$locale], location.en),
  "lang": select(defined(title[$locale]) => $locale, "en"),
  type,
  "about": pt::text(coalesce(description[$locale], description.en)),
  "responsibilities": coalesce(responsibilities[$locale], responsibilities.en),
  "requirements": coalesce(requirements[$locale], requirements.en),
  "detailLang": select(defined(description[$locale]) => $locale, "en")
}`;

const TYPE_LABELS: Record<Locale, Map<string, string>> = {
  en: new Map([
    ["full-time", "Full-time"],
    ["part-time", "Part-time"],
    ["contract", "Contract"],
    ["internship", "Internship"],
  ]),
  vi: new Map([
    ["full-time", "Toàn thời gian"],
    ["part-time", "Bán thời gian"],
    ["contract", "Hợp đồng"],
    ["internship", "Thực tập"],
  ]),
};

export function getOpenRoles(locale: Locale = "en"): Promise<OpenRole[]> {
  return sanityFetch<OpenRole[]>({
    query: OPEN_ROLES_QUERY,
    params: { locale },
    tags: ["job"],
  });
}

export async function getOpenRole(
  slug: string,
  locale: Locale = "en",
): Promise<OpenRoleDetail | null> {
  const role = await sanityFetch<OpenRoleDetail | OpenRoleDetail[] | null>({
    query: OPEN_ROLE_QUERY,
    params: { slug, locale },
    tags: ["job"],
  });
  return !role || Array.isArray(role) ? null : role;
}

export function roleTypeLabel(
  type?: string | null,
  locale: Locale = "en",
): string | undefined {
  return type ? TYPE_LABELS[locale].get(type) : undefined;
}

export function roleMeta(
  { team, location, type }: OpenRole,
  locale: Locale = "en",
): string {
  return [team, location, roleTypeLabel(type, locale)]
    .filter(Boolean)
    .join(" · ");
}
