import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { type CSSProperties, Fragment } from "react";
import { StatsBand } from "@/components/sections/stats-band";
import { homeHero, homeHeroVi, homeStats, homeStatsVi } from "@/content/home";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { FrontDoors } from "./front-doors";
import { HeroSilkLazy } from "./hero-silk-lazy";

// Server Component: text and CTA render without JavaScript. The static navy
// and amber glow (.silk-fallback) is always painted; HeroSilk (Story 3.2)
// draws the silk canvas above it and adds the motion toggle as a client
// island, so the glow is what shows without JavaScript or WebGL. The two
// front doors sit inside the hero and straddle its lower edge (E-S1 Home).
// [data-load] items rise in one after another on load (globals.css,
// "Load-in"), CSS only so they paint at once and show without JavaScript.
// The headline and the lede are left out: the lede is the page's largest
// paint (LCP), so it shows on the first frame with no fade or offset.
const loadAt = (index: number) => ({ "--load-i": index }) as CSSProperties;

export function HomeHero({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  const { title, sub, cta } = pickLocale(locale, {
    en: homeHero,
    vi: homeHeroVi,
  });
  const stats = pickLocale(locale, { en: homeStats, vi: homeStatsVi });

  return (
    <section
      aria-labelledby="home-hero-title"
      className="hero-silk home-hero relative isolate flex flex-col items-center"
    >
      <div aria-hidden="true" className="silk-fallback" />
      <HeroSilkLazy />
      {/* Above the fold (lead, 2026-10-12): from 1080px the copy, the
          animation and the stats fill the first screen, with the stats at
          its bottom (.hero-fold in globals.css). Wide screens: copy on the
          left, the globe and XT mark on the right in .hero-stage (a box
          HeroSilk measures and draws into); below 1080px the stage sits
          above the headline and shows the XT mark only. */}
      <div className="hero-fold flex w-full flex-col items-center">
        <div className="wrap w-full pt-24 md:pt-36 lg:grid lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12 lg:py-6">
          <div>
            <h1
              id="home-hero-title"
              className="font-display text-display-hero-fluid max-w-[20ch]"
            >
              {/* The space sits between the lines, so the heading's name
                  reads "Build smarter. Ship faster. Get IT done" */}
              {title.lines.map((line, index) => (
                <Fragment key={line}>
                  <span className="block">{line}</span>{" "}
                </Fragment>
              ))}
              <span className="block">
                <span className="hl">{title.highlight}</span>
                {title.tail}
              </span>
            </h1>
            <p className="text-body-lg mt-5.5 mb-8.5 max-w-[62ch] text-pretty">
              {sub}
            </p>
            {/* A plain anchor: next/link does not scroll again when the hash
              is already #contact, so a second click would do nothing. */}
            <a
              href={cta.href}
              className="btn btn-primary"
              data-load=""
              style={loadAt(0)}
            >
              {cta.label}
              <ArrowRightIcon aria-hidden="true" />
            </a>
          </div>
          <div className="hero-stage relative aspect-[6/5] w-full" />
        </div>
        <div
          className="wrap home-stats mt-14 w-full md:mt-22 lg:mt-0 lg:pb-6"
          data-load=""
          style={loadAt(1)}
        >
          <StatsBand label={stats.label} stats={stats.stats} tone="navy" />
        </div>
      </div>
      <FrontDoors locale={locale} />
    </section>
  );
}
