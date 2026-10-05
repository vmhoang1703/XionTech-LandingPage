import { getAllPosts } from "@/lib/news/all-posts";
import type { LatestPost } from "@/lib/news/latest-posts";
import { sanityFetch } from "@/lib/sanity/client";

export type StoryBlock = { style?: string | null; text?: string | null };

export type NewsStory = LatestPost & { body?: StoryBlock[] | null };

// One story for its page (Story 6.2), with Home's filter. The body comes as
// plain text per block (no links or images yet).
const POST_QUERY = `*[_type == "post" && defined(slug.current) && defined(title.en) && defined(publishedAt) && slug.current == $slug][0] {
  "slug": slug.current,
  "title": title.en,
  "excerpt": excerpt.en,
  publishedAt,
  category,
  app,
  "body": body.en[_type == "block"] { style, "text": pt::text(@) }
}`;

/**
 * The story with this slug, or null. The slug is checked against the cached
 * post list first, so an unknown slug costs no Sanity request of its own
 * (reads skip the CDN, decision A11).
 */
export async function getPost(slug: string): Promise<NewsStory | null> {
  const listed = await getAllPosts();
  if (!listed.some((post) => post.slug === slug)) return null;
  return sanityFetch<NewsStory | null>({
    query: POST_QUERY,
    params: { slug },
    tags: ["post"],
  });
}

const PRODUCT_ANCHORS = new Map([
  ["PXP", "/products#pxp"],
  ["LXP", "/products#lxp"],
  ["SXP", "/products#sxp"],
  ["IoT", "/products#iot"],
]);

/** The Products section of a story's app, or null when it has none. */
export function productAnchor(app?: string | null): string | null {
  return (app && PRODUCT_ANCHORS.get(app)) ?? null;
}
