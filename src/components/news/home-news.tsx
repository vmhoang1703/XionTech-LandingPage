import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { LocaleLink } from "@/components/layout/locale-link";
import { homeNews } from "@/content/news";
import { getLatestPosts, type LatestPost } from "@/lib/news/latest-posts";
import { NewsCard } from "./news-card";

// Server Component. Fetches its own stories so Home only renders it (CAP-1..3).
// With no stories the grid is left out. A failed fetch is
// logged and shown as "no stories", so Sanity can never take Home (or the build
// that prerenders it) down with it (lead, 2026-10-04).
async function loadPosts(): Promise<LatestPost[]> {
  try {
    return await getLatestPosts();
  } catch (error) {
    console.error(
      "Home news: could not load the latest posts from Sanity",
      error,
    );
    return [];
  }
}

export async function HomeNews() {
  const posts = await loadPosts();
  const { heading, lede, seeAll } = homeNews;

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
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
