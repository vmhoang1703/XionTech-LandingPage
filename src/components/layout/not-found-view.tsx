import { LocaleLink } from "@/components/layout/locale-link";
import { notFound } from "@/content/not-found";
import type { Locale } from "@/i18n/locales";
import { SHELL } from "@/i18n/shell";

// The Not found page. A Server Component, so its text is in the HTML Next.js
// sends with the 404 status; the title comes from the not-found metadata and
// Next.js adds noindex itself. Kept simple (website copy v3): a large 404, the
// message and one link home.
export function NotFoundView({ locale }: Readonly<{ locale: Locale }>) {
  const { title, primary } = SHELL[locale].notFound;

  return (
    <section
      lang={locale}
      aria-labelledby="not-found-title"
      className="hero-navy page-hero nf-simple"
    >
      <div className="wrap">
        <p className="nf-code" aria-hidden="true">
          {notFound.code}
        </p>
        <h1 id="not-found-title">{title}</h1>
        <LocaleLink href={notFound.homeHref} className="nf-home">
          {primary}
        </LocaleLink>
      </div>
    </section>
  );
}
