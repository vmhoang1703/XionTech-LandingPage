import { localeMetadata } from "@/i18n/page-metadata";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { LocaleLink } from "@/components/layout/locale-link";
import { PageScene } from "@/components/sections/page-scene";
import { ProcessFlow } from "@/components/sections/process-flow";
import { serviceIcons } from "@/content/service-icons";
import {
  servicesMeta,
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
  title: servicesMeta.title,
  description: servicesMeta.description,
});

// E-S2 (prototype services.html): a navy hero panel, the eight services in a
// sticky heading beside them, the outcomes and the 4-D process at #process.
// Below the hero, the shared page scene (lead, 2026-10-12).
export default async function ServicesPage({
  params,
}: Readonly<Pick<PageProps<"/[locale]/services">, "params">>) {
  const { locale: param } = await params;
  const locale = isLocale(param) ? param : "en";
  const { title, lede, primaryCta } = pickLocale(locale, {
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
        <div className="wrap">
          <h1 id="services-h1">
            {title.lead}
            <span className="hl">{title.highlight}</span>
            {title.tail}
          </h1>
          <p className="lede mt-5">{lede}</p>
          <div className="cta-row">
            <LocaleLink className="btn btn-primary" href={primaryCta.href}>
              {primaryCta.label}
              <ArrowRightIcon aria-hidden="true" />
            </LocaleLink>
          </div>
        </div>
      </section>
      <PageScene>
        <section className="sec svc-panel" aria-labelledby="services-all-h">
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
                    {"tags" in service ? (
                      <p className="svc-card-tags">
                        {service.tags.join(" · ")}
                      </p>
                    ) : null}
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
