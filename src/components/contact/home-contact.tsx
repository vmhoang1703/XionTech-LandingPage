import { EnvelopeSimpleIcon, PhoneIcon } from "@phosphor-icons/react/ssr";
import {
  hcmc as hcmcEn,
  hcmcVi,
  plano as planoEn,
  planoVi,
  type Office,
} from "@/content/offices";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { CONTACT_STRINGS, CONTACT_STRINGS_VI } from "./contact-strings";
import { HomeContactForm } from "./home-contact-form";

const city = (office: Office) => office.name.split(",")[0];

const byScheme = (office: Office, scheme: "mailto:" | "tel:") =>
  office.contacts.filter((c) => c.href.startsWith(scheme));

/** Home's last section: a short contact form and our direct lines (CAP-1). */
export function HomeContact({ locale }: Readonly<{ locale: Locale }>) {
  const S = pickLocale(locale, {
    en: CONTACT_STRINGS,
    vi: CONTACT_STRINGS_VI,
  }).home;
  const plano = pickLocale(locale, { en: planoEn, vi: planoVi });
  const hcmc = pickLocale(locale, { en: hcmcEn, vi: hcmcVi });
  const emails = byScheme(plano, "mailto:");
  const phones = [plano, hcmc].flatMap((office) =>
    byScheme(office, "tel:").map((c) => ({ city: city(office), ...c })),
  );
  return (
    <section
      className="sec surface-amber contact"
      id="contact"
      aria-labelledby="contact-h"
    >
      <div className="wrap contact-grid" data-reveal="">
        <div className="contact-intro">
          <h2 id="contact-h">{S.heading}</h2>
          <p className="lede">{S.lede}</p>
          <ul className="contact-direct">
            {emails.map((email) => (
              <li key={email.href}>
                <EnvelopeSimpleIcon aria-hidden="true" />
                <a href={email.href}>{email.label}</a>
              </li>
            ))}
            {phones.map((phone) => (
              <li key={phone.href}>
                <PhoneIcon aria-hidden="true" />
                <span>
                  {phone.city} <a href={phone.href}>{phone.label}</a>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="form-card contact-card">
          <HomeContactForm />
        </div>
      </div>
    </section>
  );
}
