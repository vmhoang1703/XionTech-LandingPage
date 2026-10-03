import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { StatsBand } from "@/components/sections/stats-band";
import { homeHero, homeStats } from "@/content/home";
import { HeroSilk } from "./hero-silk";

// Server Component: text and CTA render without JavaScript. The static navy
// and amber glow (.silk-fallback) is always painted; HeroSilk (Story 3.2)
// draws the silk canvas above it and adds the motion toggle as a client
// island, so the glow is what shows without JavaScript or WebGL.
export function HomeHero() {
  const { label, title, sub, cta, devices } = homeHero;

  return (
    <section
      aria-labelledby="home-hero-title"
      className="hero-silk relative isolate flex min-h-[calc(100dvh-var(--spacing-header-height))] flex-col items-center justify-center"
    >
      <div aria-hidden="true" className="silk-fallback" />
      <HeroSilk />
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
      <div className="wrap w-full pb-30 sm:pb-37.5">
        <StatsBand
          label={homeStats.label}
          stats={homeStats.stats}
          tone="navy"
        />
      </div>
    </section>
  );
}
