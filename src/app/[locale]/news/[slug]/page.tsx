import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import { LocaleLink } from "@/components/layout/locale-link";
import { notFound } from "next/navigation";
import { newsMeta, newsMetaVi, newsStory, newsStoryVi } from "@/content/news";
import { fallbackLang, pickLocale } from "@/i18n/content";
import { isLocale } from "@/i18n/locales";
import { categoryTag, newsDate } from "@/lib/news/latest-posts";
import { getPost, type StoryBlock } from "@/lib/news/post";
import { heroWords } from "@/components/sections/hero-words";

type StoryProps = Readonly<PageProps<"/[locale]/news/[slug]">>;

export async function generateMetadata({
  params,
}: StoryProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const story = await getPost(slug, isLocale(locale) ? locale : "en");
  if (!story) return {};
  const page = isLocale(locale) ? locale : "en";
  const { metaTitle } = pickLocale(page, { en: newsStory, vi: newsStoryVi });
  const meta = pickLocale(page, { en: newsMeta, vi: newsMetaVi });
  return {
    title: metaTitle(story.title),
    description: story.excerpt ?? meta.description,
  };
}

/**
 * A block styled as a heading shows as an H2; empty blocks are left out. The
 * excerpt is the summary in the header, so it is not repeated here.
 */
function StoryBody({
  blocks,
  lang,
}: Readonly<{ blocks: StoryBlock[]; lang?: string }>) {
  return blocks
    .filter((block) => block.text?.trim())
    .map((block) =>
      block.style?.startsWith("h") ? (
        <h2 key={block._key} lang={lang}>
          {block.text}
        </h2>
      ) : (
        <p key={block._key} lang={lang}>
          {block.text}
        </p>
      ),
    );
}

// Story 6.2, E-A6 (prototype news-story.html). No loading.tsx here: streaming
// would turn the 404 into a 200. No capture band on a story page (FR-33
// exception), no breadcrumb and no "See {app}" button (lead, 2026-10-08).
export default async function StoryPage({ params }: StoryProps) {
  const { locale: param, slug } = await params;
  const locale = isLocale(param) ? param : "en";
  const story = await getPost(slug, locale);
  if (!story) notFound();

  const tag = categoryTag(story, locale);
  const date = newsDate(story.publishedAt, locale);
  const alt = story.alt?.trim();
  const { backToNews, storyLabel, sampleNote } = pickLocale(locale, {
    en: newsStory,
    vi: newsStoryVi,
  });

  const t = heroWords();
  return (
    <>
      <section
        className="hero-light page-hero art-hero"
        aria-labelledby="story-h1"
      >
        <div className="wrap">
          <LocaleLink className="art-back" href={backToNews.href}>
            <ArrowLeftIcon aria-hidden="true" />
            <span>{backToNews.label}</span>
          </LocaleLink>
          <div className="art-meta">
            {tag ? <span className="art-pill">{tag}</span> : null}
            {date ? (
              <time className="art-date" dateTime={story.publishedAt}>
                {date}
              </time>
            ) : null}
          </div>
          <h1 id="story-h1" lang={fallbackLang(story.titleLang, locale)}>
            {t.words(story.title)}
          </h1>
          {story.excerpt?.trim() ? (
            <p
              className="art-dek"
              lang={fallbackLang(story.excerptLang, locale)}
            >
              {story.excerpt}
            </p>
          ) : null}
          {story.image && alt ? (
            <div className="art-img">
              <Image
                src={`${story.image}?w=1800&auto=format`}
                alt={alt}
                // The alt is one English field in Sanity.
                lang={fallbackLang("en", locale)}
                width={1800}
                height={1200}
                unoptimized
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="sec surface-paper art-sec" aria-label={storyLabel}>
        <div className="wrap">
          <article className="art-body">
            <StoryBody
              blocks={story.body ?? []}
              lang={fallbackLang(story.bodyLang, locale)}
            />
            {story.title.startsWith("[Placeholder]") ? (
              <p className="sample">{sampleNote}</p>
            ) : null}
          </article>
        </div>
      </section>
    </>
  );
}
