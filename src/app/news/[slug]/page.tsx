import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroArt } from "@/components/sections/hero-art";
import { newsMeta, newsStory } from "@/content/news";
import { categoryTag, newsDate } from "@/lib/news/latest-posts";
import { getPost, productAnchor, type StoryBlock } from "@/lib/news/post";

type StoryProps = Readonly<PageProps<"/news/[slug]">>;

export async function generateMetadata({
  params,
}: StoryProps): Promise<Metadata> {
  const story = await getPost((await params).slug);
  if (!story) return {};
  return {
    title: newsStory.metaTitle(story.title),
    description: story.excerpt ?? newsMeta.description,
  };
}

/**
 * A block styled as a heading shows as an H2; empty blocks are left out. With
 * no body text at all the excerpt stands in; only a story with neither is blank.
 */
function StoryBody({
  blocks,
  excerpt,
}: Readonly<{ blocks: StoryBlock[]; excerpt?: string | null }>) {
  const filled = blocks.filter((block) => block.text?.trim());
  if (filled.length === 0) {
    return excerpt?.trim() ? [<p key="excerpt">{excerpt}</p>] : [];
  }
  return filled.map((block, index) =>
    block.style?.startsWith("h") ? (
      <h2 key={index}>{block.text}</h2>
    ) : (
      <p key={index}>{block.text}</p>
    ),
  );
}

// Story 6.2. No loading.tsx here: streaming would turn the 404 into a 200.
// No capture band on a story page (FR-33 exception).
export default async function StoryPage({ params }: StoryProps) {
  const story = await getPost((await params).slug);
  if (!story) notFound();

  const tag = categoryTag(story);
  // Only a Product story links to an app: Sanity keeps a hidden app value
  // when the editor changes the category (the tag ignores it too).
  const product =
    story.category === "product" ? productAnchor(story.app) : null;
  const { breadcrumbLabel, breadcrumbHome, breadcrumbNews, backToNews } =
    newsStory;

  return (
    <>
      <section
        className="hero-light page-hero pb-12"
        aria-labelledby="story-h1"
      >
        <HeroArt tone="light" />
        <div className="wrap story-body">
          <nav className="crumbs" aria-label={breadcrumbLabel}>
            <Link href="/">{breadcrumbHome}</Link>
            <span>/</span>
            <Link href={backToNews.href}>{breadcrumbNews}</Link>
            <span>/</span>
            <span aria-current="page">{story.title}</span>
          </nav>
          <h1 id="story-h1">{story.title}</h1>
          <div className="meta mt-4.5">
            <time dateTime={story.publishedAt}>
              {newsDate(story.publishedAt)}
            </time>
            {tag ? (
              <span
                className={story.category === "product" ? "cat product" : "cat"}
              >
                {tag}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section
        className="sec surface-paper pt-10"
        aria-label={newsStory.storyLabel}
      >
        <div className="wrap story-body">
          <div className="home-media story-media" aria-hidden="true" />
          <StoryBody blocks={story.body ?? []} excerpt={story.excerpt} />
          <div className="mt-9 flex flex-wrap gap-3">
            {product && story.app ? (
              <Link className="btn btn-glass" href={product}>
                <span>{newsStory.seeApp(story.app)}</span>
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            ) : null}
            <Link className="btn btn-glass" href={backToNews.href}>
              <ArrowLeftIcon aria-hidden="true" />
              <span>{backToNews.label}</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
