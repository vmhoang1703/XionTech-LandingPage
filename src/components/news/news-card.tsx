import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { homeNews } from "@/content/news";
import {
  categoryTag,
  type LatestPost,
  newsDate,
} from "@/lib/news/latest-posts";

// Server Component. A static card: the frame is decorative (no image field yet)
// and "Read story" is the only link (CAP-1).
export function NewsCard({ post }: Readonly<{ post: LatestPost }>) {
  const tag = categoryTag(post);

  return (
    <article className="spot ncard">
      <div className="frame home-media" aria-hidden="true" />
      <div className="meta">
        <time dateTime={post.publishedAt}>{newsDate(post.publishedAt)}</time>
        {tag ? (
          <span className={post.category === "product" ? "cat product" : "cat"}>
            {tag}
          </span>
        ) : null}
      </div>
      <h3>{post.title}</h3>
      {post.excerpt ? <p>{post.excerpt}</p> : null}
      <Link href={`/news/${post.slug}`} className="link-arrow">
        <span>
          {homeNews.readStory} <span className="sr-only">{post.title}</span>
        </span>
        <ArrowRightIcon aria-hidden="true" />
      </Link>
    </article>
  );
}
