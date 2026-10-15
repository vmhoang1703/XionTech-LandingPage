import { categoryLabels, categoryLabelsVi } from "@/content/news";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { postAudience } from "@/lib/news/audience";
import { sanityFetch } from "@/lib/sanity/client";
import { localized, localizedLang } from "@/lib/sanity/localized";

export type LatestPost = {
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt: string;
  category?: string | null;
  app?: string | null;
  image?: string | null;
  alt?: string | null;
  /** Each field's language: "en" when the locale's text is empty. */
  titleLang?: string | null;
  excerptLang?: string | null;
};

const LATEST_POSTS_QUERY = `*[_type == "post" && defined(slug.current) && defined(title.en) && defined(publishedAt)] | order(publishedAt desc)[0...3] {
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

// FR-26: "18 Sep 2026" in English (CSS sets the capitals), "18/09/2026" in Vietnamese.
const DATE_FORMATS: Record<Locale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }),
  vi: new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }),
};

export function getLatestPosts(locale: Locale = "en"): Promise<LatestPost[]> {
  return sanityFetch<LatestPost[]>({
    query: LATEST_POSTS_QUERY,
    params: { locale },
    tags: ["post"],
  });
}

// An unreadable date shows as no date, so one bad post cannot break Home.
export function newsDate(iso: string, locale: Locale = "en"): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const parts = Object.fromEntries(
    DATE_FORMATS[locale]
      .formatToParts(date)
      .map(({ type, value }) => [type, value]),
  );
  return locale === "vi"
    ? `${parts.day}/${parts.month}/${parts.year}`
    : `${parts.day} ${parts.month} ${parts.year}`;
}

export function categoryTag(
  post: LatestPost,
  locale: Locale = "en",
): string | null {
  const audience = postAudience(post);
  if (!audience) return null;
  return pickLocale(locale, { en: categoryLabels, vi: categoryLabelsVi })[
    audience
  ];
}
