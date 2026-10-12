import { MapPinIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { contactIcon } from "@/components/sections/contact-icon";
import { footerOffices } from "@/content/offices";
import { siteFooter } from "@/content/site-footer";

// Colour, font and breakpoint classes come from the Story 1.1 @theme tokens
// (DESIGN.md site-footer: ink background, on-navy-muted text, amber-tint headings).
const headingClass = "font-brand text-label-sm mb-4 text-amber-tint uppercase";
const linkClass =
  "text-body-sm text-on-navy-muted inline-flex min-h-6 items-center hover:text-white";

const iconClass = "text-amber-tint shrink-0";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-on-navy-muted relative pt-18 pb-9 [--color-focus:var(--color-focus-on-navy)]">
      <div className="footer-ridge" data-ridge="" aria-hidden="true">
        <span className="ridge-sun" />
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          focusable="false"
        >
          <path
            className="footer-ridge-fill"
            d="M0 120 L0 94 L110 82 L200 90 L300 72 L380 84 L470 66 L560 80 L650 60 L730 74 L800 52 L860 6 L920 56 L1000 46 L1090 68 L1180 58 L1270 78 L1360 64 L1440 74 L1440 120 Z"
          />
          <path
            className="footer-ridge-line"
            d="M0 94 L110 82 L200 90 L300 72 L380 84 L470 66 L560 80 L650 60 L730 74 L800 52 L860 6 L920 56 L1000 46 L1090 68 L1180 58 L1270 78 L1360 64 L1440 74"
          />
        </svg>
      </div>
      <div className="max-w-page px-gutter-mobile sm:px-gutter mx-auto">
        <div className="footer-grid" data-reveal="">
          <div>
            <Link
              href="/"
              className="bg-paper inline-block rounded-sm px-3 py-2"
            >
              <Image
                src="/brand/xiontechs-logo.png"
                alt={siteFooter.logoAlt}
                width={250}
                height={46}
                className="h-7.5 w-auto"
              />
            </Link>
            <p className="text-body-sm mt-4.5">{siteFooter.blurb}</p>
          </div>

          {siteFooter.columns.map((column) => (
            <div key={column.heading}>
              <h2 className={headingClass}>{column.heading}</h2>
              <ul className="grid gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className={headingClass}>{siteFooter.officesHeading}</h2>
            {footerOffices.map((office) => (
              <address
                key={office.id}
                className="text-body-sm not-italic [&+&]:mt-5"
              >
                <b className="mb-1.5 block text-white">{office.name}</b>
                <span className="mt-1.5 flex items-start gap-2.5">
                  <MapPinIcon
                    aria-hidden="true"
                    className={`${iconClass} mt-0.75`}
                    size={16}
                  />
                  <span>
                    {office.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </span>
                {office.contacts.map((contact) => {
                  const ContactIcon = contactIcon(contact.href);
                  return (
                    <span
                      key={contact.href}
                      className="flex items-center gap-2.5"
                    >
                      <ContactIcon
                        aria-hidden="true"
                        className={iconClass}
                        size={16}
                      />
                      <a
                        href={contact.href}
                        aria-label={contact.ariaLabel}
                        {...(contact.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="inline-flex min-h-6 items-center [overflow-wrap:anywhere] hover:text-white"
                      >
                        {contact.label}
                      </a>
                    </span>
                  );
                })}
              </address>
            ))}
          </div>
        </div>

        <div className="border-on-navy-border text-body-sm mt-13 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
          <span>
            {siteFooter.copyright} ·{" "}
            <Link
              href={siteFooter.privacy.href}
              className="inline-flex min-h-6 items-center hover:text-white"
            >
              {siteFooter.privacy.label}
            </Link>
          </span>
          <span className="font-brand text-label text-white">
            {siteFooter.tag.lead}{" "}
            <b className="text-amber">{siteFooter.tag.accent}</b>
          </span>
        </div>
      </div>
    </footer>
  );
}
