import Link from "next/link";
import { StatsBand } from "@/components/sections/stats-band";
import { homeHero, homeStats } from "@/content/home";
import { HeroSilk } from "./hero-silk";

// Server Component: text and CTA render without JavaScript. The hero-silk
// surface (Story 1.1) paints the static navy and amber glow; HeroSilk adds
// the silk canvas and the motion toggle as a client island.
export function HomeHero() {
  const { label, title, sub, cta, devices } = homeHero;

  return (
    <section
      aria-labelledby="home-hero-title"
      className="hero-silk relative isolate flex min-h-[calc(100dvh-var(--spacing-header-height))] flex-col items-center justify-center"
    >
      <HeroSilk />
      <div className="max-w-page px-gutter-mobile sm:px-gutter mx-auto grid w-full grid-cols-1 items-center gap-8 py-10 md:grid-cols-[0.92fr_1.08fr]">
        <div>
          <span className="font-brand text-label uppercase">{label}</span>
          <h1 id="home-hero-title" className="mt-4.5">
            {title.lead}
            <mark className="highlight-mark">{title.highlight}</mark>
            {title.tail}
          </h1>
          <p className="text-body-lg mt-5.5 mb-8.5">{sub}</p>
          <Link href={cta.href} className="button-primary">
            {cta.label}
          </Link>
        </div>

        <div className="relative mx-auto aspect-[1.18/1] w-full max-w-140 md:max-w-none">
          <div className="device-frame device-tablet absolute top-[6%] left-0 w-[84%]">
            <div className="media-frame">
              <span className="font-brand text-label-sm uppercase">
                {devices.tablet}
              </span>
            </div>
          </div>
          <div className="device-frame device-phone absolute right-0 bottom-0 w-[31%]">
            <div className="media-frame">
              <span className="font-brand text-label-sm uppercase">
                {devices.phone}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-page px-gutter-mobile sm:px-gutter mx-auto w-full pb-30 sm:pb-37.5">
        <StatsBand
          label={homeStats.label}
          stats={homeStats.stats}
          tone="navy"
        />
      </div>
    </section>
  );
}
