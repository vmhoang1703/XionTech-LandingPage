import { categoryLabels } from "@/content/news";
import { postAudience } from "@/lib/news/audience";
import { sanityFetch } from "@/lib/sanity/client";

export type LatestPost = {
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt: string;
  category?: string | null;
  app?: string | null;
  image?: string | null;
  alt?: string | null;
};

const LATEST_POSTS_QUERY = `*[_type == "post" && defined(slug.current) && defined(title.en) && defined(publishedAt)] | order(publishedAt desc)[0...3] {
  "slug": slug.current,
  "title": title.en,
  "excerpt": excerpt.en,
  publishedAt,
  category,
  app,
  "image": image.asset->url,
  alt
}`;

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
});

export function getLatestPosts(): Promise<LatestPost[]> {
  return sanityFetch<LatestPost[]>({
    query: LATEST_POSTS_QUERY,
    tags: ["post"],
  });
}

// An unreadable date shows as no date, so one bad post cannot break Home.
export function newsDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const parts = Object.fromEntries(
    DATE_FORMAT.formatToParts(date).map(({ type, value }) => [type, value]),
  );
  return `${parts.day} ${parts.month} ${parts.year}`;
}

export function categoryTag(post: LatestPost): string | null {
  const audience = postAudience(post);
  return audience ? categoryLabels[audience] : null;
}
