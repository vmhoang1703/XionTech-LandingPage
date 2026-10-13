import type { LatestPost } from "@/lib/news/latest-posts";
import type { Locale } from "@/i18n/locales";
import { sanityFetch } from "@/lib/sanity/client";

// Every story for the News page (Story 6.1), newest first, with Home's filter:
// a post without a slug, an English title or a date is never shown. Text is
// in the locale, or English when the locale's field is empty.
const ALL_POSTS_QUERY = `*[_type == "post" && defined(slug.current) && defined(title.en) && defined(publishedAt)] | order(publishedAt desc) {
  "slug": slug.current,
  "title": coalesce(title[$locale], title.en),
  "excerpt": coalesce(excerpt[$locale], excerpt.en),
  "lang": select(defined(title[$locale]) => $locale, "en"),
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
