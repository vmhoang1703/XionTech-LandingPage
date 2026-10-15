import { careersHero, careersHeroVi } from "@/content/careers";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { heroWords } from "@/components/sections/hero-words";

// Server Component. Copy only (website copy v3: the growth learning model and
// the "Explore open roles" button are gone). No breadcrumb (E-A7 CAP-1).
export function CareersHero({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  const { title, lede } = pickLocale(locale, {
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
      <div className="wrap ch-stack">
        <div className="ch-copy">
          <h1 id="careers-h1">
            {t.words(title.first)} <br />
            {t.words(title.second)}
          </h1>
          <p className="lede mt-4.5">{lede}</p>
        </div>
      </div>
    </section>
  );
}
