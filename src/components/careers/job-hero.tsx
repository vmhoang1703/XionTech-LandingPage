import { LocaleLink } from "@/components/layout/locale-link";
import { HeroArt } from "@/components/sections/hero-art";
import { jobHero, jobHeroVi } from "@/content/job";
import { fallbackLang, pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { type OpenRoleDetail, roleTypeLabel } from "@/lib/careers/open-roles";

// Server Component. Amber page hero with crumbs, the role title and chips (CAP-1).
export function JobHero({
  role,
  locale = "en",
}: Readonly<{ role: OpenRoleDetail; locale?: Locale }>) {
  const { breadcrumbLabel, breadcrumbHome, breadcrumbCareers, chipsLabel } =
    pickLocale(locale, { en: jobHero, vi: jobHeroVi });
  const lang = fallbackLang(role.titleLang, locale);
  const chips = [
    { text: role.team, lang: fallbackLang(role.teamLang, locale) },
    { text: role.location, lang: fallbackLang(role.locationLang, locale) },
    { text: roleTypeLabel(role.type, locale) },
  ].filter((chip): chip is { text: string; lang?: string } =>
    Boolean(chip.text),
  );

  return (
    <section className="hero-amber page-hero" aria-labelledby="job-h1">
      <HeroArt tone="amber" />
      <div className="wrap">
        <nav className="crumbs" aria-label={breadcrumbLabel}>
          <LocaleLink href="/">{breadcrumbHome}</LocaleLink>
          <span>/</span>
          <LocaleLink href="/careers">{breadcrumbCareers}</LocaleLink>
          <span>/</span>
          <span aria-current="page" lang={lang}>
            {role.title}
          </span>
        </nav>
        <h1 id="job-h1" lang={lang}>
          {role.title}
        </h1>
        {chips.length > 0 && (
          <ul className="chips mt-4.5" aria-label={chipsLabel}>
            {chips.map((chip) => (
              <li key={chip.text} className="chip" lang={chip.lang}>
                {chip.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
