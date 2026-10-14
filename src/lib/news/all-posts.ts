import type { LatestPost } from "@/lib/news/latest-posts";
import type { Locale } from "@/i18n/locales";
import { sanityFetch } from "@/lib/sanity/client";
import { localized, localizedLang } from "@/lib/sanity/localized";

// Every story for the News page (Story 6.1), newest first, with Home's filter:
// a post without a slug, an English title or a date is never shown. Text is
// in the locale, or English when the locale's field is empty.
const ALL_POSTS_QUERY = `*[_type == "post" && defined(slug.current) && defined(title.en) && defined(publishedAt)] | order(publishedAt desc) {
  "slug": slug.current,
  "title": ${localized("title")},
  "titleLang": ${localizedLang("title")},
  "excerpt": ${localized("excerpt")},
  "excerptLang": ${localizedLang("excerpt")},
  publishedAt,
  category,
  app,
  "image": image.asset->url,
  alt
}`;

export function getAllPosts(locale: Locale = "en"): Promise<LatestPost[]> {
  return sanityFetch<LatestPost[]>({
    query: ALL_POSTS_QUERY,
    params: { locale },
    tags: ["post"],
  });
}
