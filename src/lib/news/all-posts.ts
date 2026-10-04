import type { LatestPost } from "@/lib/news/latest-posts";
import { sanityFetch } from "@/lib/sanity/client";

// Every story for the News page (Story 6.1), newest first, with Home's filter:
// a post without a slug, an English title or a date is never shown.
const ALL_POSTS_QUERY = `*[_type == "post" && defined(slug.current) && defined(title.en) && defined(publishedAt)] | order(publishedAt desc) {
  "slug": slug.current,
  "title": title.en,
  "excerpt": excerpt.en,
  publishedAt,
  category,
  app
}`;

export function getAllPosts(): Promise<LatestPost[]> {
  return sanityFetch<LatestPost[]>({ query: ALL_POSTS_QUERY, tags: ["post"] });
}
