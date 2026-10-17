import { postAudience } from "@/lib/news/audience";
import type { LatestPost } from "@/lib/news/latest-posts";

export const MORE_STORIES = 3;

/**
 * The stories under a story (audit 2026-10-16, #9): up to `count` other posts,
 * those for the same audience first, then the rest, each part newest first.
 */
export function moreStories(
  posts: readonly LatestPost[],
  current: Pick<LatestPost, "slug" | "category" | "app">,
  count = MORE_STORIES,
): LatestPost[] {
  const audience = postAudience(current);
  const time = (post: LatestPost) => {
    const t = new Date(post.publishedAt).getTime();
    return Number.isNaN(t) ? 0 : t;
  };
  const others = posts
    .filter((post) => post.slug !== current.slug)
    .sort((a, b) => time(b) - time(a));
  const same = audience
    ? others.filter((post) => postAudience(post) === audience)
    : [];
  const rest = others.filter((post) => !same.includes(post));
  return [...same, ...rest].slice(0, count);
}
