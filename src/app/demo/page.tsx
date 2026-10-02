import { CheckCircleIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { CONTACT_STRINGS } from "@/components/contact/contact-strings";
import { OFFICES } from "@/components/layout/office-data";

export const metadata: Metadata = {
  title: CONTACT_STRINGS.metaTitle,
  description: CONTACT_STRINGS.metaDescription,
};

const { hero } = CONTACT_STRINGS;

export default function DemoPage() {
  return (
    <section className="hero-navy page-hero" aria-labelledby="demo-h1">
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
          <div className="offices" role="group" aria-label={hero.officesLabel}>
            {OFFICES.map((office) => (
              <address className="office" key={office.city}>
                <b>{office.city}</b>
                {office.tag ? (
                  <small className="office-tag">{office.tag}</small>
                ) : null}
                {office.addressLines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
                <a href={office.phoneHref}>{office.phone}</a>
                {office.whatsapp ? (
                  <>
                    <br />
                    <a
                      href={office.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${hero.whatsappPrefix} ${office.whatsappLabel} ${hero.whatsappNewTab}`}
                    >
                      {hero.whatsappPrefix} {office.whatsappLabel}
                    </a>
                  </>
                ) : null}
                {office.email ? (
                  <>
                    <br />
                    <a href={office.emailHref}>{office.email}</a>
                  </>
                ) : null}
              </address>
            ))}
          </div>
        </div>
        <div id="form" className="form-card">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
