import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { careersHero, careersHeroVi } from "@/content/careers";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { GrowthRing } from "./growth-ring";
import { heroWords } from "@/components/sections/hero-words";

// Server Component. Light hero beside the Growth Learning Model; no
// breadcrumb (E-A7 CAP-1, prototype careers.html).
export function CareersHero({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  const { title, lede, cta } = pickLocale(locale, {
    en: careersHero,
    vi: careersHeroVi,
  });

  const t = heroWords();
  return (
    <section
      className="hero-light page-hero careers-hero"
      aria-labelledby="careers-h1"
    >
      <div aria-hidden="true" className="aurora" />
      <div className="wrap ch-grid">
        <div>
          <h1 id="careers-h1">
            {t.words(title.first)} <br />
            {t.words(title.second)}
          </h1>
          <p className="lede mt-4.5 mb-8">{lede}</p>
          <a className="btn btn-primary" href={cta.href}>
            {cta.label}
            <ArrowRightIcon aria-hidden="true" />
          </a>
        </div>
        <GrowthRing />
      </div>
    </section>
  );
}
