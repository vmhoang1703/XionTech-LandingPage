import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { StatsBand } from "@/components/sections/stats-band";
import { homeHero, homeStats } from "@/content/home";
import { FrontDoors } from "./front-doors";
import { HeroSilk } from "./hero-silk";

// Server Component: text and CTA render without JavaScript. The static navy
// and amber glow (.silk-fallback) is always painted; HeroSilk (Story 3.2)
// draws the silk canvas above it and adds the motion toggle as a client
// island, so the glow is what shows without JavaScript or WebGL. The two
// front doors sit inside the hero and straddle its lower edge (E-S1 Home).
export function HomeHero() {
  const { title, sub, cta } = homeHero;

  return (
    <section
      aria-labelledby="home-hero-title"
      className="hero-silk home-hero relative isolate flex flex-col items-center"
    >
      <div aria-hidden="true" className="silk-fallback" />
      <HeroSilk />
      {/* Wide screens: copy on the left, the globe and XT mark on the right
          in .hero-stage (a box HeroSilk measures and draws into, and puts
          the scene's progress dots in). */}
      <div className="wrap w-full pt-24 md:pt-36 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12 lg:pt-20">
        <div>
          <h1
            id="home-hero-title"
            className="font-display text-display-hero-fluid max-w-[20ch]"
          >
            {title.lead}
            <span className="hl">{title.highlight}</span>
            {title.tail}
          </h1>
          <p className="text-body-lg mt-5.5 mb-8.5 max-w-[62ch] text-pretty">
            {sub}
          </p>
          {/* A plain anchor: next/link does not scroll again when the hash
              is already #contact, so a second click would do nothing. */}
          <a href={cta.href} className="btn btn-primary">
            {cta.label}
            <ArrowRightIcon aria-hidden="true" />
          </a>
        </div>
        <div className="hero-stage relative hidden aspect-[6/5] w-full lg:block" />
      </div>
      <div className="wrap home-stats mt-14 w-full md:mt-22 lg:mt-14">
        <StatsBand
          label={homeStats.label}
          stats={homeStats.stats}
          tone="navy"
        />
      </div>
      <FrontDoors />
    </section>
  );
}
