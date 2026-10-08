import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { homeNews } from "@/content/news";
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
export function NewsCard({ post }: Readonly<{ post: LatestPost }>) {
  const tag = categoryTag(post);
  const id = `story-${encodeURIComponent(post.slug)}`;
  const date = newsDate(post.publishedAt);
  const labelledBy = [`${id}-t`, date ? `${id}-d` : "", tag ? `${id}-a` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={`/news/${encodeURIComponent(post.slug)}`}
      className="scard"
      aria-labelledby={labelledBy}
    >
      {post.image ? (
        <Image
          src={`${post.image}?w=1400&auto=format`}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 560px) 100vw, 50vw"
        />
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
      <span className="scard-content">
        <span id={`${id}-t`} className="scard-title">
          {post.title}
        </span>
      </span>
      <span className="scard-read" aria-hidden="true">
        <span>{homeNews.readStory}</span>
        <ArrowRightIcon aria-hidden="true" />
      </span>
    </Link>
  );
}
