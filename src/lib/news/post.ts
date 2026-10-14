import { getAllPosts } from "@/lib/news/all-posts";
import type { LatestPost } from "@/lib/news/latest-posts";
import type { Locale } from "@/i18n/locales";
import { sanityFetch } from "@/lib/sanity/client";
import { localized, localizedLang } from "@/lib/sanity/localized";

export type StoryBlock = {
  _key: string;
  style?: string | null;
  text?: string | null;
};

export type NewsStory = LatestPost & {
  body?: StoryBlock[] | null;
  /** The body's language: "en" when the locale's body is empty. */
  bodyLang?: string | null;
};

// One story for its page (Story 6.2), with Home's filter. The body comes as
// plain text per block (no links or images yet).
const POST_QUERY = `*[_type == "post" && defined(slug.current) && defined(title.en) && defined(publishedAt) && slug.current == $slug][0] {
  "slug": slug.current,
  "title": ${localized("title")},
  "titleLang": ${localizedLang("title")},
  "excerpt": ${localized("excerpt")},
  "excerptLang": ${localizedLang("excerpt")},
  publishedAt,
  category,
  app,
  "image": image.asset->url,
  alt,
  "body": ${localized("body")}[_type == "block"] { _key, style, "text": pt::text(@) },
  "bodyLang": ${localizedLang("body")}
}`;

/**
 * The story with this slug, or null. The slug is checked against the cached
 * post list first, so an unknown slug costs no Sanity request of its own
 * (reads skip the CDN, decision A11).
 */
export async function getPost(
  slug: string,
  locale: Locale = "en",
): Promise<NewsStory | null> {
  const listed = await getAllPosts(locale);
  if (!listed.some((post) => post.slug === slug)) return null;
  return sanityFetch<NewsStory | null>({
    query: POST_QUERY,
    params: { slug, locale },
    tags: ["post"],
  });
}
