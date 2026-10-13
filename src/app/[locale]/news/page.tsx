import { localeMetadata } from "@/i18n/page-metadata";
import { CaptureBand } from "@/components/contact/capture-band";
import { NewsCard } from "@/components/news/news-card";
import { NewsFilters } from "@/components/news/news-filters";
import { PageScene } from "@/components/sections/page-scene";
import { newsMeta, newsPage } from "@/content/news";
import { getAllPosts } from "@/lib/news/all-posts";
import { postAudience } from "@/lib/news/audience";
import type { LatestPost } from "@/lib/news/latest-posts";

export const generateMetadata = localeMetadata({
  title: newsMeta.title,
  description: newsMeta.description,
});

// A failed fetch is logged and shown as "no stories", as on Home, so Sanity
// can never take the page (or the build that prerenders it) down.
async function loadPosts(): Promise<LatestPost[]> {
  try {
    return await getAllPosts();
  } catch (error) {
    console.error("News page: could not load the posts from Sanity", error);
    return [];
  }
}

// Story 6.1, E-A6. Server-rendered list; the audience filter is the only client
// part. The hero, the stories and the demo band (Q4: no newsletter) share the
// page scene from the top (lead, 2026-10-12); the heading sits inside it, so
// the scene does not fade in.
export default async function NewsPage() {
  const posts = await loadPosts();
  const { title, sub, storiesHeading } = newsPage;

  return (
    <PageScene fade={false}>
      <section
        className="hero-light page-hero nhead-sec"
        aria-labelledby="news-h1"
      >
        <div className="wrap nhead">
          <h1 id="news-h1">{title}</h1>
          <p>{sub}</p>
        </div>
      </section>

      <section className="sec nlist" aria-labelledby="stories-h">
        <div className="wrap">
          <h2 id="stories-h" className="sr-only">
            {storiesHeading}
          </h2>
          <NewsFilters
            items={posts.map((post) => ({
              key: post.slug,
              category: postAudience(post),
              node: <NewsCard post={post} />,
            }))}
          />
        </div>
      </section>
      <CaptureBand kind="demo" look="page" />
    </PageScene>
  );
}
