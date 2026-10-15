import type { Locale } from "@/i18n/locales";
import { ROLE_TYPE_LABELS, ROLE_TYPES } from "@/content/job";
import { pickLocale } from "@/i18n/content";
import { sanityFetch } from "@/lib/sanity/client";
import { localized, localizedLang } from "@/lib/sanity/localized";

export type OpenRole = {
  slug: string;
  title: string;
  team?: string | null;
  location?: string | null;
  type?: string | null;
  /** Each field's language: "en" when the locale's value is empty. */
  titleLang?: string | null;
  teamLang?: string | null;
  locationLang?: string | null;
};

export const OPEN_ROLES_QUERY = `*[_type == "job" && closed != true && defined(slug.current) && defined(title.en)] | order(title.en asc) {
  "slug": slug.current,
  "title": ${localized("title")},
  "titleLang": ${localizedLang("title")},
  "team": ${localized("team")},
  "teamLang": ${localizedLang("team")},
  "location": ${localized("location")},
  "locationLang": ${localizedLang("location")},
  type
}`;

export type OpenRoleDetail = OpenRole & {
  about?: string | null;
  /** When the job document was created in Sanity (JSON-LD datePosted). */
  createdAt?: string | null;
  responsibilities?: string[] | null;
  requirements?: string[] | null;
  aboutLang?: string | null;
  responsibilitiesLang?: string | null;
  requirementsLang?: string | null;
};

export const OPEN_ROLE_QUERY = `*[_type == "job" && closed != true && defined(slug.current) && defined(title.en) && slug.current == $slug][0] {
  "slug": slug.current,
  "title": ${localized("title")},
  "titleLang": ${localizedLang("title")},
  "team": ${localized("team")},
  "teamLang": ${localizedLang("team")},
  "location": ${localized("location")},
  "locationLang": ${localizedLang("location")},
  type,
  "createdAt": _createdAt,
  "about": pt::text(${localized("description")}),
  "aboutLang": ${localizedLang("description")},
  "responsibilities": ${localized("responsibilities")},
  "responsibilitiesLang": ${localizedLang("responsibilities")},
  "requirements": ${localized("requirements")},
  "requirementsLang": ${localizedLang("requirements")}
}`;

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
  if (!type) return undefined;
  if (locale === "vi") return ROLE_TYPE_LABELS.vi.get(type);
  const labels = pickLocale(locale, { en: ROLE_TYPES });
  return Object.hasOwn(labels, type) ? labels[type] : undefined;
}

export function roleMeta(
  { team, location, type }: OpenRole,
  locale: Locale = "en",
): string {
  return [team, location, roleTypeLabel(type, locale)]
    .filter(Boolean)
    .join(" · ");
}
