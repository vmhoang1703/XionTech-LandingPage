import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "@/content/not-found";

export const metadata: Metadata = {
  title: notFound.metaTitle,
  robots: { index: false },
};

// Server Component. Next.js renders it with a 404 status for any unmatched path.
export default function NotFound() {
  const { label, title, lede, primary, links } = notFound;

  return (
    <section
      aria-labelledby="not-found-title"
      className="hero-navy page-hero flex min-h-[70dvh] items-center"
    >
      <div className="wrap">
        <span className="label">{label}</span>
        <h1 id="not-found-title">
          {title.lead}
          <span className="hl">{title.highlight}</span>
          {title.tail}
        </h1>
        <p className="lede">{lede}</p>
        <div className="mt-8 flex flex-wrap gap-3.5">
          <Link href={primary.href} className="btn btn-primary">
            {primary.label}
            <ArrowRightIcon aria-hidden="true" />
          </Link>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="btn btn-glass">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
