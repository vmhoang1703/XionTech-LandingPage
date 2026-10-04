import type { Metadata } from "next";
import Link from "next/link";
import { CaptureBand } from "@/components/contact/capture-band";
import { NewsCard } from "@/components/news/news-card";
import { NewsFilters } from "@/components/news/news-filters";
import { HeroArt } from "@/components/sections/hero-art";
import { newsMeta, newsPage } from "@/content/news";
import { getAllPosts } from "@/lib/news/all-posts";
import type { LatestPost } from "@/lib/news/latest-posts";

export const metadata: Metadata = {
  title: newsMeta.title,
  description: newsMeta.description,
};

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

// Story 6.1. Server-rendered list; the chip filter is the only client part.
export default async function NewsPage() {
  const posts = await loadPosts();
  const { breadcrumbLabel, breadcrumbHome, breadcrumbCurrent } = newsPage;
  const { title, lede, storiesHeading } = newsPage;

  return (
    <>
      <section className="hero-light page-hero" aria-labelledby="news-h1">
        <HeroArt tone="light" />
        <div className="wrap">
          <nav className="crumbs" aria-label={breadcrumbLabel}>
            <Link href="/">{breadcrumbHome}</Link>
            <span>/</span>
            <span>{breadcrumbCurrent}</span>
          </nav>
          <h1 id="news-h1">
            {title.lead}
            <span className="hl">{title.highlight}</span>
            {title.tail}
          </h1>
          <p className="lede mt-4.5">{lede}</p>
        </div>
      </section>

      <section className="sec surface-paper pt-14" aria-labelledby="stories-h">
        <div className="wrap">
          <h2 id="stories-h" className="sr-only">
            {storiesHeading}
          </h2>
          <NewsFilters
            items={posts.map((post, index) => ({
              key: post.slug,
              category: post.category,
              node: <NewsCard post={post} feature={index === 0} />,
            }))}
          />
        </div>
      </section>

      <CaptureBand kind="demo" />
    </>
  );
}
