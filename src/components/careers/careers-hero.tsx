import Image from "next/image";
import { careersHero, careersHeroVi } from "@/content/careers";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { heroWords } from "@/components/sections/hero-words";

// Server Component. H1, lede and a closing prompt line (not a button)
// beside the stacked-cards illustration (Amber's careers hero mock, no
// glow, 2026-10-15). No buttons: the mock's "Explore opportunities" and
// "Meet our culture" are left out. No breadcrumb (E-A7 CAP-1).
export function CareersHero({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  const { title, lede, prompt, artAlt } = pickLocale(locale, {
    en: careersHero,
    vi: careersHeroVi,
  });

  const t = heroWords();
  return (
    <section
      className="hero-light page-hero careers-hero"
      aria-labelledby="careers-h1"
    >
      <div className="wrap ch-grid">
        <div>
          <h1 id="careers-h1">
            {t.words(title.first)}{" "}
            <span className="ch-accent">{t.words(title.second)}</span>
          </h1>
          <p className="lede mt-4.5">{lede}</p>
          <p className="ch-prompt">{prompt}</p>
        </div>
        <div className="ch-art">
          <Image
            src="/careers/careers-hero-cards.webp"
            width={1448}
            height={1086}
            alt={artAlt}
            priority
            sizes="(width <= 640px) 100vw, (width <= 900px) 88vw, 62vw"
          />
        </div>
      </div>
    </section>
  );
}
