import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { LocaleLink } from "@/components/layout/locale-link";
import { homeNews, homeNewsVi } from "@/content/news";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { getLatestPosts, type LatestPost } from "@/lib/news/latest-posts";
import { NewsCard } from "./news-card";

// Server Component. Fetches its own stories so Home only renders it (CAP-1..3).
// With no stories the grid is left out. A failed fetch is
// logged and shown as "no stories", so Sanity can never take Home (or the build
// that prerenders it) down with it (lead, 2026-10-04).
async function loadPosts(locale: Locale): Promise<LatestPost[]> {
  try {
    return await getLatestPosts(locale);
  } catch (error) {
    console.error(
      "Home news: could not load the latest posts from Sanity",
      error,
    );
    return [];
  }
}

// Home's row: a swipe row of wide cards on phones, three across from 900px.
const HOME_NEWS_SIZES = "(width <= 640px) 88vw, (width <= 900px) 50vw, 400px";

export async function HomeNews({
  locale = "en",
}: Readonly<{ locale?: Locale }>) {
  const posts = await loadPosts(locale);
  const { heading, lede, seeAll } = pickLocale(locale, {
    en: homeNews,
    vi: homeNewsVi,
  });

  // E-A6 (prototype index.html news row): "See all news" sits on the heading
  // row (under it at 640px and below), then up to three photo cards.
  return (
    <section className="sec surface-mist" aria-labelledby="news-h">
      <div className="wrap">
        <div className="sec-head-row" data-reveal="">
          <div className="sec-head">
            <h2 id="news-h">{heading}</h2>
            <p className="lede">{lede}</p>
          </div>
          <LocaleLink href={seeAll.href} className="link-arrow">
            <span>{seeAll.label}</span>
            <ArrowRightIcon aria-hidden="true" />
          </LocaleLink>
        </div>
        {posts.length > 0 ? (
          <div className="sgrid sgrid-row" data-reveal="">
            {posts.map((post) => (
              <NewsCard
                key={post.slug}
                post={post}
                locale={locale}
                sizes={HOME_NEWS_SIZES}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
