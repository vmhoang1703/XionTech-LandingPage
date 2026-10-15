import type { MetadataRoute } from "next";
import { LOCALES, type Locale } from "@/i18n/locales";
import { getOpenRoles } from "@/lib/careers/open-roles";
import { getAllPosts } from "@/lib/news/all-posts";
import { languageAlternates, localePath, SITE_URL } from "@/lib/seo/site";

const STATIC_PATHS = [
  "/",
  "/services",
  "/products",
  "/about",
  "/news",
  "/careers",
  "/privacy",
];

const absolute = (path: string) => `${SITE_URL}${path}`;

function withAlternates(path: string) {
  const languages = Object.fromEntries(
    Object.entries(languageAlternates(path)).map(([lang, href]) => [
      lang,
      absolute(href),
    ]),
  );
  return LOCALES.map((locale) => ({
    url: absolute(localePath(locale, path)),
    alternates: { languages },
  }));
}

/** Sanity data, or nothing when it cannot be read (the static pages still list). */
async function orEmpty<T>(load: Promise<T[]>): Promise<T[]> {
  try {
    return await load;
  } catch {
    return [];
  }
}

/**
 * Every static page in every locale, the open roles in every locale, and the
 * news stories: English always, another locale only where the story is
 * translated (an untranslated one shows English text and is canonical to /en).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = STATIC_PATHS.flatMap(withAlternates);
  const roles = (await orEmpty(getOpenRoles("en"))).flatMap((role) =>
    withAlternates(`/careers/${role.slug}`),
  );
  const stories = (
    await Promise.all(
      LOCALES.map(async (locale: Locale) =>
        (await orEmpty(getAllPosts(locale)))
          .filter((post) => locale === "en" || post.titleLang === locale)
          .map((post) => ({
            url: absolute(localePath(locale, `/news/${post.slug}`)),
            lastModified: post.publishedAt,
          })),
      ),
    )
  ).flat();
  return [...pages, ...roles, ...stories];
}
