import { localeMetadata } from "@/i18n/page-metadata";
import { LocaleLink } from "@/components/layout/locale-link";
import { PRIVACY as PRIVACY_EN, PRIVACY_VI } from "@/content/privacy";
import { pickLocale } from "@/i18n/content";
import { isLocale } from "@/i18n/locales";

export const generateMetadata = localeMetadata({
  title: PRIVACY_EN.metaTitle,
  description: PRIVACY_EN.metaDescription,
});

// Plain reading page: no capture band (FR-33 exception). The aurora hero
// background and shared breadcrumbs come with Story 1.6, after demo.
export default async function PrivacyPage({
  params,
}: Readonly<Pick<PageProps<"/[locale]/privacy">, "params">>) {
  const { locale: param } = await params;
  const locale = isLocale(param) ? param : "en";
  const PRIVACY = pickLocale(locale, { en: PRIVACY_EN, vi: PRIVACY_VI });
  return (
    <>
      <section
        className="hero-light page-hero pb-12"
        aria-labelledby="privacy-h1"
      >
        <div className="wrap mx-auto max-w-180">
          <nav className="crumbs" aria-label={PRIVACY.breadcrumbLabel}>
            <LocaleLink href="/">{PRIVACY.breadcrumbHome}</LocaleLink>
            <span>/</span>
            <span>{PRIVACY.breadcrumbCurrent}</span>
          </nav>
          <h1 id="privacy-h1">{PRIVACY.title}</h1>
          <p className="lede mt-5">{PRIVACY.lede}</p>
        </div>
      </section>

      <section
        className="surface-paper sec pt-10"
        aria-label={PRIVACY.bodyLabel}
      >
        <div className="wrap text-body-lg mx-auto max-w-180">
          <p className="sample text-body-sm text-muted italic">
            {PRIVACY.outlineNote}
          </p>
          {PRIVACY.sections.map((section) => (
            <div key={section.id} id={section.id}>
              <h2 className="font-display text-title-lg text-heading mt-10">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
