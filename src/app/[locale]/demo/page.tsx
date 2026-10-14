import type { Metadata } from "next";
import { CheckCircleIcon } from "@phosphor-icons/react/ssr";
import { LocaleLink } from "@/components/layout/locale-link";
import { Fragment } from "react";
import { ContactForm } from "@/components/contact/contact-form";
import {
  CONTACT_STRINGS,
  CONTACT_STRINGS_VI,
} from "@/components/contact/contact-strings";
import { HeroArt } from "@/components/sections/hero-art";
import {
  offices as officesEn,
  officesVi,
  otherLocations as otherLocationsEn,
  otherLocationsVi,
} from "@/content/offices";
import { pickLocale } from "@/i18n/content";
import { isLocale } from "@/i18n/locales";
import { heroWords } from "@/components/sections/hero-words";

// Kept but inactive (lead, 2026-10-13): nothing links here and search engines
// leave it out; every call to action uses the Home Get in touch form.
export async function generateMetadata({
  params,
}: Readonly<Pick<PageProps<"/[locale]/demo">, "params">>): Promise<Metadata> {
  const { locale } = await params;
  const { metaTitle, metaDescription } = pickLocale(
    isLocale(locale) ? locale : "en",
    { en: CONTACT_STRINGS, vi: CONTACT_STRINGS_VI },
  );
  return {
    title: metaTitle,
    description: metaDescription,
    robots: { index: false, follow: false },
  };
}

export default async function DemoPage({
  params,
}: Readonly<Pick<PageProps<"/[locale]/demo">, "params">>) {
  const { locale: param } = await params;
  const locale = isLocale(param) ? param : "en";
  const { hero } = pickLocale(locale, {
    en: CONTACT_STRINGS,
    vi: CONTACT_STRINGS_VI,
  });
  const offices = pickLocale(locale, { en: officesEn, vi: officesVi });
  const otherLocations = pickLocale(locale, {
    en: otherLocationsEn,
    vi: otherLocationsVi,
  });
  const t = heroWords();
  return (
    <section className="hero-navy page-hero" aria-labelledby="demo-h1">
      <HeroArt tone="navy" />
      <div className="wrap split">
        <div>
          <nav className="crumbs" aria-label={hero.breadcrumbLabel}>
            <LocaleLink href="/">{hero.breadcrumbHome}</LocaleLink>
            <span>/</span>
            <span>{hero.breadcrumbCurrent}</span>
          </nav>
          <h1 id="demo-h1">
            {t.words(hero.titleBefore)}
            <span className="hl" {...t.unit()}>
              {hero.titleHighlight}
            </span>
            {hero.titleAfter}
          </h1>
          <ul className="list-check">
            {hero.items.map((item) => (
              <li key={item}>
                <CheckCircleIcon weight="fill" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <fieldset className="offices" aria-label={hero.officesLabel}>
            {offices.map((office) => (
              <address className="office" key={office.id}>
                <b>{office.name}</b>
                {office.tag ? (
                  <small className="office-tag">{office.tag}</small>
                ) : null}
                {office.addressLines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
                {office.contacts.map((contact, index) => (
                  <Fragment key={contact.href}>
                    {index > 0 ? <br /> : null}
                    <a
                      href={contact.href}
                      aria-label={contact.ariaLabel}
                      {...(contact.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {contact.label}
                    </a>
                  </Fragment>
                ))}
              </address>
            ))}
            <p className="office-more">{otherLocations}</p>
          </fieldset>
        </div>
        <div id="form" className="form-card">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
