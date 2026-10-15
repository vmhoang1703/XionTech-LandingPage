import { localeMetadata } from "@/i18n/page-metadata";
import { CareersHero } from "@/components/careers/careers-hero";
import { GainCards } from "@/components/careers/gain-cards";
import { LifeAtXionTech } from "@/components/careers/life-at-xiontech";
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
import { listLifePhotos } from "@/lib/careers/life-photo-folder";
import { getOpenRoles } from "@/lib/careers/open-roles";
import { breadcrumbLd, JsonLd } from "@/lib/seo/json-ld";
import { SHELL } from "@/i18n/shell";

export const generateMetadata = localeMetadata(
  { en: careersMeta, vi: careersMetaVi },
  "/careers",
);

// E-A7: the hero's light blue fades into the shared page scene, which ends
// warm above the footer (lead, 2026-10-12). "Principles we value" comes
// first, "Meet the team at XionTech" right below it, and the roles last. The Sanity
// Life photo frames are off the page; their code stays for later (Q15,
// deferred-work.md).
export default async function CareersPage({
  params,
}: Readonly<Pick<PageProps<"/[locale]/careers">, "params">>) {
  const { locale: param } = await params;
  const locale = isLocale(param) ? param : "en";
  const roles = await getOpenRoles(locale);
  const life = pickLocale(locale, { en: careersLife, vi: careersLifeVi });
  // Any image files in public/careers/life/ (read at build; see the helper).
  const photos = listLifePhotos();

  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: SHELL[locale].nav.careers, path: "/careers" },
        ])}
      />
      <CareersHero locale={locale} />
      <PageScene>
        <GainCards locale={locale} />
        <LifeAtXionTech copy={life} photos={photos} />
        <OpenRoles roles={roles} locale={locale} />
      </PageScene>
    </>
  );
}
