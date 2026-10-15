import { localeMetadata } from "@/i18n/page-metadata";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import type { CSSProperties } from "react";
import { LocaleLink } from "@/components/layout/locale-link";
import { PageScene } from "@/components/sections/page-scene";
import { ProcessFlow } from "@/components/sections/process-flow";
import { RotatingWord } from "@/components/sections/rotating-word";
import { ThreeLayerStack } from "@/components/sections/three-layer-stack";
import { serviceIcons } from "@/content/service-icons";
import {
  servicesMeta,
  servicesMetaVi,
  servicesOutcomes as servicesOutcomesEn,
  servicesOutcomesVi,
  servicesPage,
  servicesPageVi,
  servicesProcess as servicesProcessEn,
  servicesProcessVi,
  servicesSection as servicesSectionEn,
  servicesSectionVi,
} from "@/content/services";
import { pickLocale } from "@/i18n/content";
import { isLocale } from "@/i18n/locales";

export const generateMetadata = localeMetadata({
  en: servicesMeta,
  vi: servicesMetaVi,
});

// E-S2 (prototype services.html): a navy hero panel, the eight services in a
// sticky heading beside them, the outcomes and the 4-D process at #process.
// Below the hero, the shared page scene (lead, 2026-10-12).
// The hero copy rises in on load, one item after another (globals.css,
// "Load-in"); the three-layer stack keeps its own play.
const loadAt = (index: number) => ({ "--load-i": index }) as CSSProperties;

export default async function ServicesPage({
  params,
}: Readonly<Pick<PageProps<"/[locale]/services">, "params">>) {
  const { locale: param } = await params;
  const locale = isLocale(param) ? param : "en";
  const { title, lede, primaryCta, secondaryCta, stack } = pickLocale(locale, {
    en: servicesPage,
    vi: servicesPageVi,
  });
  const servicesSection = pickLocale(locale, {
    en: servicesSectionEn,
    vi: servicesSectionVi,
  });
  const servicesOutcomes = pickLocale(locale, {
    en: servicesOutcomesEn,
    vi: servicesOutcomesVi,
  });
  const servicesProcess = pickLocale(locale, {
    en: servicesProcessEn,
    vi: servicesProcessVi,
  });

  return (
    <>
      <section
        className="hero-navy page-hero svc-hero"
        aria-labelledby="services-h1"
      >
        <div className="wrap svc-hero-grid">
          <div className="svc-hero-copy">
            <h1 id="services-h1">
              <span className="svc-h1-line" data-load="" style={loadAt(0)}>
                {title.lead}
                <span className="sr-only">{title.staticWord}</span>
                <RotatingWord words={title.words} suffix={title.suffix} />
              </span>{" "}
              <span className="svc-h1-line" data-load="" style={loadAt(1)}>
                {title.tail[0]}
                <span className="hl">{title.tail[1]}</span>
                {title.tail[2]}
              </span>
            </h1>
            <p
              className="lede svc-hero-lede mt-5"
              data-load=""
              style={loadAt(2)}
            >
              {lede}
            </p>
            <div className="cta-row" data-load="" style={loadAt(3)}>
              <LocaleLink className="btn btn-primary" href={primaryCta.href}>
                {primaryCta.label}
                <ArrowRightIcon aria-hidden="true" />
              </LocaleLink>
              <a className="btn btn-glass" href={secondaryCta.href}>
                {secondaryCta.label}
              </a>
            </div>
          </div>
          <ThreeLayerStack labels={stack} />
        </div>
      </section>
      <PageScene>
        <section
          id="services-all"
          className="sec svc-panel"
          aria-labelledby="services-all-h"
        >
          <div className="wrap svc-split">
            <div className="sec-head svc-stick">
              <h2 id="services-all-h">{servicesSection.title}</h2>
              <p className="lede">{servicesSection.lede}</p>
            </div>
            <div className="svc-cards" data-reveal="">
              {servicesSection.services.map((service, index) => {
                // Ids are shared; the English entry types them for the icons.
                const { icon: ServiceIcon } =
                  serviceIcons[servicesSectionEn.services[index].id];
                return (
                  <article
                    key={service.id}
                    id={service.id}
                    className="svc-card"
                  >
                    <div className="svc-card-h">
                      <ServiceIcon aria-hidden="true" />
                      <h3>{service.name}</h3>
                    </div>
                    <p>{service.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        <section
          id="outcomes"
          className="sec svc-outcomes"
          aria-labelledby="services-outcomes-h"
        >
          <div className="wrap">
            <div className="sec-head" data-reveal="">
              <h2 id="services-outcomes-h">{servicesOutcomes.title}</h2>
            </div>
            <ol className="outcomes" data-reveal="">
              {servicesOutcomes.items.map((item, index) => (
                <li key={item.id} className="outcome">
                  <span className="oc-num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section
          id="process"
          className="sec d4"
          aria-labelledby="services-process-h"
        >
          <div className="wrap">
            <div className="sec-head" data-reveal="">
              <h2 id="services-process-h">{servicesProcess.title}</h2>
              <p className="lede">{servicesProcess.lede}</p>
            </div>
            <ProcessFlow flow={servicesProcess.flow} />
          </div>
        </section>
      </PageScene>
    </>
  );
}
