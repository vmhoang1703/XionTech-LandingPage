import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { LocaleLink } from "@/components/layout/locale-link";
import { SanityImage } from "@/components/sections/sanity-image";
import { homeNews, homeNewsVi } from "@/content/news";
import { fallbackLang, pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { postAudience } from "@/lib/news/audience";
import {
  categoryTag,
  type LatestPost,
  newsDate,
} from "@/lib/news/latest-posts";

// Server Component. The full-photo story card (E-A6 CAP-4, prototype site.js
// `scard`): the whole card is one link, named by its title, date and audience.
// The photo is decorative (the title names the link); with no photo the empty
// frame shows instead. "Read story" shows on hover and focus, always on touch.
// `sizes`: the card's width in its grid, so the Sanity srcset sends a phone a
// phone-sized photo. The default is the News page grid (two columns, one
// below 900px; the lead card spans both).
export const NEWS_CARD_SIZES = "(width <= 900px) 100vw, 50vw";

export function NewsCard({
  post,
  locale = "en",
  sizes = NEWS_CARD_SIZES,
}: Readonly<{ post: LatestPost; locale?: Locale; sizes?: string }>) {
  const tag = categoryTag(post, locale);
  const id = `story-${encodeURIComponent(post.slug)}`;
  const date = newsDate(post.publishedAt, locale);
  const labelledBy = [`${id}-t`, date ? `${id}-d` : "", tag ? `${id}-a` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <LocaleLink
      href={`/news/${encodeURIComponent(post.slug)}`}
      className="scard"
      aria-labelledby={labelledBy}
    >
      {post.image ? (
        <SanityImage src={post.image} alt="" fill sizes={sizes} />
      ) : (
        <span className="home-media" aria-hidden="true" />
      )}
      <span className="scard-meta">
        {tag ? (
          <span
            id={`${id}-a`}
            className={
              postAudience(post) === "company"
                ? "scard-pill company"
                : "scard-pill"
            }
          >
            {tag}
          </span>
        ) : null}
        {date ? (
          <time
            id={`${id}-d`}
            className="scard-date"
            dateTime={post.publishedAt}
          >
            {date}
          </time>
        ) : null}
      </span>
      <div className="scard-content">
        <h3
          id={`${id}-t`}
          className="scard-title"
          lang={fallbackLang(post.titleLang, locale)}
        >
          {post.title}
        </h3>
      </div>
      <span className="scard-read" aria-hidden="true">
        <span>
          {pickLocale(locale, { en: homeNews, vi: homeNewsVi }).readStory}
        </span>
        <ArrowRightIcon aria-hidden="true" />
      </span>
    </LocaleLink>
  );
}
