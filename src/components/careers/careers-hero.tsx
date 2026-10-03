import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { HeroArt } from "@/components/sections/hero-art";
import { careersHero } from "@/content/careers";

// Server Component. Amber page hero with two anchor buttons (CAP-1).
export function CareersHero() {
  const { breadcrumbLabel, breadcrumbHome, breadcrumbCurrent } = careersHero;
  const { title, lede, primaryCta, secondaryCta } = careersHero;

  return (
    <section className="hero-amber page-hero" aria-labelledby="careers-h1">
      <HeroArt tone="amber" />
      <div className="wrap">
        <nav className="crumbs" aria-label={breadcrumbLabel}>
          <Link href="/">{breadcrumbHome}</Link>
          <span>/</span>
          <span>{breadcrumbCurrent}</span>
        </nav>
        <h1 id="careers-h1">
          {title.lead}
          <span className="hl">{title.highlight}</span>
          {title.tail}
        </h1>
        <p className="lede mt-4.5 mb-8">{lede}</p>
        <div className="flex flex-wrap gap-3">
          <a className="btn btn-navy" href={primaryCta.href}>
            {primaryCta.label}
            <ArrowRightIcon aria-hidden="true" />
          </a>
          <a className="btn btn-glass" href={secondaryCta.href}>
            {secondaryCta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
