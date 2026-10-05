import { ArrowRightIcon, ClockIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { HeroArt } from "@/components/sections/hero-art";
import { LiveClock } from "@/components/sections/live-clock";
import { servicesMeta, servicesPage } from "@/content/services";

export const metadata: Metadata = {
  title: servicesMeta.title,
  description: servicesMeta.description,
};

// Story 5.1. Server-rendered hero; LiveClock is the only client part.
export default function ServicesPage() {
  const { breadcrumbLabel, breadcrumbHome, breadcrumbCurrent } = servicesPage;
  const { title, lede, primaryCta, secondaryCta } = servicesPage;

  return (
    <section className="hero-navy page-hero" aria-labelledby="services-h1">
      <HeroArt tone="navy" />
      <div className="wrap">
        <nav className="crumbs" aria-label={breadcrumbLabel}>
          <Link href="/">{breadcrumbHome}</Link>
          <span>/</span>
          <span>{breadcrumbCurrent}</span>
        </nav>
        <h1 id="services-h1">
          {title.lead}
          <span className="hl">{title.highlight}</span>
          {title.tail}
        </h1>
        <p className="lede mt-4.5">{lede}</p>
        <div className="cta-row">
          <Link className="btn btn-primary" href={primaryCta.href}>
            {primaryCta.label}
            <ArrowRightIcon aria-hidden="true" />
          </Link>
          <Link className="btn btn-glass" href={secondaryCta.href}>
            {secondaryCta.label}
          </Link>
        </div>
        <div
          className="clock-strip"
          role="group"
          aria-label={servicesPage.clockStripLabel}
        >
          {servicesPage.clockCities.map(({ office, city }) => (
            <span key={office.id}>
              <ClockIcon aria-hidden="true" />
              {city}{" "}
              <b>
                <LiveClock
                  timeZone={office.timeZone}
                  zoneLabel={office.zoneLabel}
                />
              </b>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
