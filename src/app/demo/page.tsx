import { CheckCircleIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { ContactForm } from "@/components/contact/contact-form";
import { CONTACT_STRINGS } from "@/components/contact/contact-strings";
import { HeroArt } from "@/components/sections/hero-art";
import { offices, otherLocations } from "@/content/offices";

// Kept but inactive (lead, 2026-10-13): nothing links here and search engines
// leave it out; every call to action uses the Home Get in touch form.
export const metadata: Metadata = {
  title: CONTACT_STRINGS.metaTitle,
  description: CONTACT_STRINGS.metaDescription,
  robots: { index: false, follow: false },
};

const { hero } = CONTACT_STRINGS;

export default function DemoPage() {
  return (
    <section className="hero-navy page-hero" aria-labelledby="demo-h1">
      <HeroArt tone="navy" />
      <div className="wrap split">
        <div>
          <nav className="crumbs" aria-label={hero.breadcrumbLabel}>
            <Link href="/">{hero.breadcrumbHome}</Link>
            <span>/</span>
            <span>{hero.breadcrumbCurrent}</span>
          </nav>
          <h1 id="demo-h1">
            {hero.titleBefore}
            <span className="hl">{hero.titleHighlight}</span>
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
