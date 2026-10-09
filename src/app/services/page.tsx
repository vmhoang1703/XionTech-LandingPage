import { ArrowRightIcon, ClockIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { CaptureBand } from "@/components/contact/capture-band";
import { HeroArt } from "@/components/sections/hero-art";
import { LiveClock } from "@/components/sections/live-clock";
import { ProcessFlow } from "@/components/sections/process-flow";
import { StatsBand } from "@/components/sections/stats-band";
import { serviceIcons } from "@/content/service-icons";
import {
  servicesMeta,
  servicesPage,
  servicesProcess,
  servicesSection,
  servicesStats,
} from "@/content/services";

export const metadata: Metadata = {
  title: servicesMeta.title,
  description: servicesMeta.description,
};

// Stories 5.1, 5.2 and 5.4: hero, stats, service cards, the 4-D process at
// #process and the project capture. The clocks, the 4-D reveal and the
// capture form are the client parts.
export default function ServicesPage() {
  const { breadcrumbLabel, breadcrumbHome, breadcrumbCurrent } = servicesPage;
  const { title, lede, primaryCta, secondaryCta } = servicesPage;

  return (
    <>
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
          <p className="lede mt-5">{lede}</p>
          <div className="cta-row">
            <Link className="btn btn-primary" href={primaryCta.href}>
              {primaryCta.label}
              <ArrowRightIcon aria-hidden="true" />
            </Link>
            {/* A plain anchor: next/link does not scroll again when the
                hash is already #process, so a second click did nothing. */}
            <a className="btn btn-glass" href={secondaryCta.href}>
              {secondaryCta.label}
            </a>
          </div>
          <fieldset
            className="clock-strip"
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
          </fieldset>
        </div>
      </section>
      <section className="sec surface-paper">
        <div className="wrap">
          <StatsBand
            label={servicesStats.ariaLabel}
            stats={servicesStats.stats}
            tone="light"
            hideLabel
          />
        </div>
      </section>
      <section
        className="sec surface-mist linen pt-10"
        aria-labelledby="services-all-h"
      >
        <div className="wrap">
          <div className="sec-head">
            <h2 id="services-all-h">{servicesSection.title}</h2>
            <p className="lede">{servicesSection.lede}</p>
          </div>
          <div className="svc-grid">
            {servicesSection.services.map((service) => {
              const { icon: ServiceIcon, variant } = serviceIcons[service.id];
              return (
                <article
                  key={service.id}
                  id={service.id}
                  className={["spot", "svc", variant].filter(Boolean).join(" ")}
                >
                  <span className="ic">
                    <ServiceIcon aria-hidden="true" />
                  </span>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  {"tags" in service ? (
                    <span className="tags">{service.tags.join(" · ")}</span>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section
        id="process"
        className="sec surface-navy gridbg"
        aria-labelledby="services-process-h"
      >
        <div className="wrap">
          <div className="sec-head">
            <span className="label">{servicesProcess.label}</span>
            <h2 id="services-process-h">{servicesProcess.title}</h2>
            <p className="lede">{servicesProcess.lede}</p>
          </div>
          <ProcessFlow flow={servicesProcess.flow} />
        </div>
      </section>
      <CaptureBand kind="project" />
    </>
  );
}
