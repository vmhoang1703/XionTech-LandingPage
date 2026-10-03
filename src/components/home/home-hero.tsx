import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { homeHero } from "@/content/home";

// Server Component: text and CTA render without JavaScript. The static navy
// and amber glow (.silk-fallback) is always painted; Story 3.2's silk canvas
// draws above it, so it is what shows without JavaScript or WebGL.
export function HomeHero() {
  const { label, title, sub, cta, devices } = homeHero;

  return (
    <section
      aria-labelledby="home-hero-title"
      className="hero-silk relative isolate flex min-h-[calc(100dvh-var(--spacing-header-height))] items-center"
    >
      <div aria-hidden="true" className="silk-fallback" />
      <div className="wrap grid w-full grid-cols-1 items-center gap-8 py-10 md:grid-cols-[0.92fr_1.08fr]">
        <div>
          <span className="label">{label}</span>
          <h1
            id="home-hero-title"
            className="font-display text-display-hero-fluid mt-4.5"
          >
            {title.lead}
            <span className="hl">{title.highlight}</span>
            {title.tail}
          </h1>
          <p className="text-body-lg mt-5.5 mb-8.5 max-w-[46ch]">{sub}</p>
          <Link href={cta.href} className="btn btn-primary">
            {cta.label}
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </div>

        <div className="home-devices">
          <div className="home-device-tablet">
            <div className="home-media">
              <span>{devices.tablet}</span>
            </div>
          </div>
          <div className="home-device-phone">
            <span className="home-notch" aria-hidden="true" />
            <div className="home-media">
              <span>{devices.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
