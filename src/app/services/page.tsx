import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { ProcessFlow } from "@/components/sections/process-flow";
import { serviceIcons } from "@/content/service-icons";
import {
  servicesMeta,
  servicesOutcomes,
  servicesPage,
  servicesProcess,
  servicesSection,
} from "@/content/services";

export const metadata: Metadata = {
  title: servicesMeta.title,
  description: servicesMeta.description,
};

// E-S2 (prototype services.html): a navy hero panel, the eight services in a
// light panel with a sticky heading, the outcomes and the 4-D process at
// #process, all on one flowing light background.
export default function ServicesPage() {
  const { title, lede, primaryCta } = servicesPage;

  return (
    <div className="svc-flow">
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
            <Link className="btn btn-primary" href={primaryCta.href}>
              {primaryCta.label}
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="sec svc-panel" aria-labelledby="services-all-h">
        <div className="wrap svc-split">
          <div className="sec-head svc-stick">
            <h2 id="services-all-h">{servicesSection.title}</h2>
            <p className="lede">{servicesSection.lede}</p>
          </div>
          <div className="svc-cards" data-reveal="">
            {servicesSection.services.map((service) => {
              const { icon: ServiceIcon } = serviceIcons[service.id];
              return (
                <article key={service.id} id={service.id} className="svc-card">
                  <div className="svc-card-h">
                    <ServiceIcon aria-hidden="true" />
                    <h3>{service.name}</h3>
                  </div>
                  <p>{service.description}</p>
                  {"tags" in service ? (
                    <p className="svc-card-tags">{service.tags.join(" · ")}</p>
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
    </div>
  );
}
