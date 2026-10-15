import { localeMetadata } from "@/i18n/page-metadata";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  PhoneIcon,
} from "@phosphor-icons/react/ssr";
import type { CSSProperties } from "react";
import { MountainStory } from "@/components/about/mountain-story";
import { HomeValues } from "@/components/home/home-values";
import { LocaleLink } from "@/components/layout/locale-link";
import { FaqList } from "@/components/sections/faq-list";
import { LiveClock } from "@/components/sections/live-clock";
import { PageScene } from "@/components/sections/page-scene";
import {
  aboutCta,
  aboutCtaVi,
  aboutFaq,
  aboutFaqVi,
  aboutHero,
  aboutHeroVi,
  aboutMeta,
  aboutMetaVi,
  aboutOffices,
  aboutOfficesVi,
  aboutStory,
  aboutStoryVi,
  aboutValuesHeading,
  aboutValuesHeadingVi,
} from "@/content/about";
import { pickLocale } from "@/i18n/content";
import { isLocale, localeHref } from "@/i18n/locales";
import { breadcrumbLd, JsonLd } from "@/lib/seo/json-ld";
import { SHELL } from "@/i18n/shell";

export const generateMetadata = localeMetadata(
  { en: aboutMeta, vi: aboutMetaVi },
  "/about",
);

// E-S3 (prototype about.html; website copy v3): the text-only hero, the
// mountain story, the core values (the Careers flip-card look), the FAQ at
// #faq, the offices and a closing call to action, on the shared page scene
// below the hero. Only the mountain story slides over the pinned hero; the
// rest is normal flow. The hero items rise in on load, one after another
// (globals.css, "Load-in"); the rest uses the shared scroll reveal.
const loadAt = (index: number) => ({ "--load-i": index }) as CSSProperties;

export default async function AboutPage({
  params,
}: Readonly<Pick<PageProps<"/[locale]/about">, "params">>) {
  const { locale: param } = await params;
  const locale = isLocale(param) ? param : "en";
  const { title, text, links } = pickLocale(locale, {
    en: aboutHero,
    vi: aboutHeroVi,
  });
  const story = pickLocale(locale, { en: aboutStory, vi: aboutStoryVi });
  const values = pickLocale(locale, {
    en: aboutValuesHeading,
    vi: aboutValuesHeadingVi,
  });
  const faq = pickLocale(locale, { en: aboutFaq, vi: aboutFaqVi });
  const offices = pickLocale(locale, { en: aboutOffices, vi: aboutOfficesVi });
  const cta = pickLocale(locale, { en: aboutCta, vi: aboutCtaVi });

  // One plain wrapper. The App Router scrolls the first non-sticky element of
  // a new page into view on client navigation; with the sticky hero first, it
  // skipped to the story card and landed 700px down the page.
  return (
    <div className="about-page">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: SHELL[locale].nav.about, path: "/about" },
        ])}
      />
      <section id="mission" className="about-hero" aria-labelledby="about-h1">
        <div className="wrap ah-inner">
          {/* No load-in on the headline or text: they are the LCP. */}
          <h1 id="about-h1">
            {title.lead}
            <br />
            {title.middle}
            <span className="ah-accent">{title.accent}</span>
            {title.tail}
          </h1>
          <p className="ah-text">{text}</p>
          <div className="ah-links" data-load="" style={loadAt(0)}>
            {links.map(({ href, label }, i) => (
              <LocaleLink
                key={href}
                className={i === 0 ? "btn btn-primary" : "btn btn-glass"}
                href={href}
              >
                {label}
                <ArrowRightIcon aria-hidden="true" />
              </LocaleLink>
            ))}
          </div>
        </div>
      </section>
      <PageScene>
        <MountainStory {...story} />
        <HomeValues
          locale={locale}
          id="values"
          headingId="about-values-h"
          title={values.title}
          lede={values.lede}
          variant="drawing"
        />
        <section
          id="faq"
          className="sec surface-paper"
          aria-labelledby="about-faq-h"
        >
          <div className="wrap faq-head" data-reveal="">
            <h2 id="about-faq-h">{faq.title}</h2>
            <p className="lede">{faq.lede}</p>
          </div>
          <div className="wrap">
            <FaqList items={faq.items} />
          </div>
        </section>
        <section
          id="offices"
          className="sec surface-paper"
          aria-labelledby="about-offices-h"
        >
          <div className="wrap">
            <div className="sec-head" data-reveal="">
              <h2 id="about-offices-h">{offices.title}</h2>
              <p className="lede">{offices.lede}</p>
            </div>
            <div className="loc-cards" data-reveal="">
              {offices.locations.map((loc) => (
                <article key={loc.id} className="loc-card">
                  <div className="loc-top">
                    <div>
                      <p className="loc-eyebrow">{loc.eyebrow}</p>
                      <h3>{loc.city}</h3>
                    </div>
                    <p className="loc-time">
                      <b>
                        <LiveClock timeZone={loc.timeZone} zoneLabel="--:--" />
                      </b>
                      <small>{offices.timeLabel}</small>
                    </p>
                  </div>
                  <address className="loc-rows">
                    <span className="loc-row">
                      <MapPinIcon weight="light" aria-hidden="true" />
                      <span>
                        {loc.addressLines[0]}
                        <br />
                        {loc.addressLines[1]}
                      </span>
                      <a
                        className="loc-map"
                        href={loc.mapHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={offices.mapLabel.replace(
                          "{city}",
                          loc.city,
                        )}
                      >
                        <ArrowUpRightIcon aria-hidden="true" />
                      </a>
                    </span>
                    <span className="loc-row">
                      <PhoneIcon weight="light" aria-hidden="true" />
                      <a href={loc.phone.href}>{loc.phone.label}</a>
                    </span>
                    <span className="loc-row">
                      <EnvelopeSimpleIcon weight="light" aria-hidden="true" />
                      {loc.email.href ? (
                        <a href={loc.email.href}>{loc.email.label}</a>
                      ) : (
                        <span>{loc.email.label}</span>
                      )}
                    </span>
                  </address>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="next"
          className="sec surface-paper about-cta"
          aria-labelledby="about-cta-h"
        >
          <div className="wrap about-cta-inner" data-reveal="">
            <h2 id="about-cta-h">{cta.title}</h2>
            <p className="lede">{cta.text}</p>
            <div className="about-cta-actions">
              {/* A plain anchor to the Home contact section. */}
              <a
                className="btn btn-primary"
                href={localeHref(locale, cta.primary.href)}
              >
                {cta.primary.label}
                <span className="about-cta-arrow" aria-hidden="true">
                  <ArrowRightIcon weight="bold" />
                </span>
              </a>
              <LocaleLink className="link-arrow" href={cta.secondary.href}>
                {cta.secondary.label}
                <ArrowRightIcon aria-hidden="true" />
              </LocaleLink>
            </div>
          </div>
        </section>
      </PageScene>
    </div>
  );
}
