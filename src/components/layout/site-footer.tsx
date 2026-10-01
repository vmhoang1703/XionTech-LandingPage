import Image from "next/image";
import Link from "next/link";
import { offices } from "@/content/offices";
import { siteFooter } from "@/content/site-footer";

// Colour, font and breakpoint classes come from the Story 1.1 @theme tokens
// (DESIGN.md site-footer: ink background, on-navy-muted text, amber-tint headings).
const headingClass = "font-brand text-label-sm mb-4 text-amber-tint uppercase";
const linkClass = "text-body-sm text-on-navy-muted hover:text-white";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-on-navy-muted pt-18 pb-9">
      <div className="max-w-page px-gutter-mobile sm:px-gutter mx-auto">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 md:grid-cols-[1.3fr_repeat(4,1fr)]">
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
            {offices.map((office) => (
              <address
                key={office.id}
                className="text-body-sm not-italic [&+&]:mt-4"
              >
                <b className="block text-white">{office.name}</b>
                {office.tag ? (
                  <small className="font-brand text-label-sm mt-0.5 mb-1.5 block uppercase opacity-75">
                    {office.tag}
                  </small>
                ) : null}
                {office.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                {office.contacts.map((contact) => (
                  <a
                    key={contact.href}
                    href={contact.href}
                    aria-label={contact.ariaLabel}
                    {...(contact.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="block [overflow-wrap:anywhere] hover:text-white"
                  >
                    {contact.label}
                  </a>
                ))}
              </address>
            ))}
          </div>
        </div>

        <div className="border-on-navy-border text-body-sm mt-13 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
          <span>
            {siteFooter.copyright} ·{" "}
            <Link href={siteFooter.privacy.href} className="hover:text-white">
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
