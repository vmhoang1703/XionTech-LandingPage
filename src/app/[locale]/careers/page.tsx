import { localeMetadata } from "@/i18n/page-metadata";
import { CareersHero } from "@/components/careers/careers-hero";
import { GainCards } from "@/components/careers/gain-cards";
import { LifeCarousel } from "@/components/careers/life-carousel";
import { OpenRoles } from "@/components/careers/open-roles";
import { PageScene } from "@/components/sections/page-scene";
import {
  careersLife,
  careersLifeVi,
  careersMeta,
  careersMetaVi,
} from "@/content/careers";
import { pickLocale } from "@/i18n/content";
import { isLocale } from "@/i18n/locales";
import { LIFE_SLIDES } from "@/lib/careers/life-photos";
import { getOpenRoles } from "@/lib/careers/open-roles";

export const generateMetadata = localeMetadata({
  en: careersMeta,
  vi: careersMetaVi,
});

// E-A7: the hero's light blue fades into the shared page scene, which ends
// warm above the footer (lead, 2026-10-12), and the roles come last. The
// Life photo carousel shows once photos are listed in LIFE_SLIDES; the Life
// photo frames are off the page;
// their Sanity code stays for later (Q15, deferred-work.md).
export default async function CareersPage({
  params,
}: Readonly<Pick<PageProps<"/[locale]/careers">, "params">>) {
  const { locale: param } = await params;
  const locale = isLocale(param) ? param : "en";
  const roles = await getOpenRoles(locale);

  return (
    <>
      <CareersHero locale={locale} />
      <PageScene>
        <LifeCarousel
          slides={LIFE_SLIDES}
          copy={pickLocale(locale, { en: careersLife, vi: careersLifeVi })}
        />
        {/* Inside XionTech and the five values are off the page (website copy v3). */}
        <GainCards locale={locale} />
        <OpenRoles roles={roles} locale={locale} />
      </PageScene>
    </>
  );
}
