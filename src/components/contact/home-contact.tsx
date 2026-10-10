import { EnvelopeSimpleIcon, PhoneIcon } from "@phosphor-icons/react/ssr";
import { hcmc, plano, type Office } from "@/content/offices";
import { CONTACT_STRINGS } from "./contact-strings";
import { HomeContactForm } from "./home-contact-form";

const S = CONTACT_STRINGS.home;

const city = (office: Office) => office.name.split(",")[0];

const byScheme = (office: Office, scheme: "mailto:" | "tel:") =>
  office.contacts.filter((c) => c.href.startsWith(scheme));

/** Home's last section: a short contact form and our direct lines (CAP-1). */
export function HomeContact() {
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
