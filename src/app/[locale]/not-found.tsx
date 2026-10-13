import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "@/content/not-found";

export const metadata: Metadata = {
  title: notFound.metaTitle,
  robots: { index: false },
};

// Server Component. Next.js renders it with a 404 status for any unmatched path.
// The trail map matches the footer mountain (ENH-043); it is decorative.
export default function NotFound() {
  const { title, lede, primary, links, map } = notFound;

  return (
    <section
      aria-labelledby="not-found-title"
      className="hero-navy page-hero flex min-h-[70dvh] items-center"
    >
      <div className="wrap">
        <div className="trail-grid">
          <div>
            <h1 id="not-found-title">{title}</h1>
            <p className="lede">{lede}</p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href={primary.href} className="btn btn-primary">
                {primary.label}
                <ArrowRightIcon aria-hidden="true" />
              </Link>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="btn btn-glass"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <figure className="trail-map" aria-hidden="true">
            <svg viewBox="0 0 480 360" focusable="false">
              <path
                className="tm-range"
                d="M0 300 L70 230 L120 260 L200 150 L250 200 L330 70 L400 170 L440 140 L480 190 L480 360 L0 360 Z"
              />
              <path
                className="tm-ridge"
                d="M0 300 L70 230 L120 260 L200 150 L250 200 L330 70 L400 170 L440 140 L480 190"
              />
              <path
                className="tm-contour"
                d="M40 330 C120 300 200 320 280 290 S420 270 470 290"
              />
              <path
                className="tm-contour"
                d="M20 350 C110 330 230 345 330 320 S440 305 480 320"
              />
              <path
                className="tm-trail"
                d="M88 318 C130 300 150 270 190 262 S250 250 262 220 S300 160 318 120 S326 88 330 74"
              />
              <circle className="tm-here" cx="88" cy="318" r="7" />
              <circle className="tm-here-ring" cx="88" cy="318" r="7" />
              <text className="tm-label" x="104" y="344">
                {map.here}
              </text>
              <text className="tm-label" x="362" y="104">
                {map.home}
              </text>
            </svg>
            <Image
              className="tm-x"
              src="/brand/x-mark.webp"
              width={160}
              height={86}
              alt=""
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
