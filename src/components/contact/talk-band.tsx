import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { CONTACT_HREF } from "@/components/layout/nav-data";
import { talkBand, talkBandVi } from "@/content/talk-band";
import { localeHref, type Locale } from "@/i18n/locales";
import { SHELL } from "@/i18n/shell";

// A heading, one line and a single "Let's talk" pill to Home's contact form
// (/{locale}#contact), centred like About's closing call to action and set on
// the page's own background. Server-rendered: no form and no script.
export function TalkBand({
  locale,
  page,
}: Readonly<{
  locale: Locale;
  page: keyof typeof talkBand;
}>) {
  // English and Vietnamese only for now: other locales show the English.
  const { heading, body } = (locale === "vi" ? talkBandVi : talkBand)[page];
  return (
    <section
      className={`sec about-cta talk-band${page === "news" ? " talk-band-news" : ""}`}
      aria-labelledby="talk-h"
    >
      <div className="wrap about-cta-inner" data-reveal="">
        <h2 id="talk-h">{heading}</h2>
        <p className="lede">{body}</p>
        <div className="about-cta-actions talk-action">
          {/* A plain anchor to the Home contact section, as on About. */}
          <a
            className="btn btn-primary"
            href={localeHref(locale, CONTACT_HREF)}
          >
            {SHELL[locale].nav.contact}
            <span className="about-cta-arrow" aria-hidden="true">
              <ArrowRightIcon weight="bold" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
