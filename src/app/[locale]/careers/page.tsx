import { localeMetadata } from "@/i18n/page-metadata";
import { CareersHero } from "@/components/careers/careers-hero";
import { FlipCards } from "@/components/careers/flip-cards";
import { Inside } from "@/components/careers/inside";
import { OpenRoles } from "@/components/careers/open-roles";
import { PageScene } from "@/components/sections/page-scene";
import { careersMeta } from "@/content/careers";
import { getOpenRoles } from "@/lib/careers/open-roles";

export const generateMetadata = localeMetadata({
  title: careersMeta.title,
  description: careersMeta.description,
});

// E-A7: the hero's light blue fades into the shared page scene, which ends
// warm above the footer (lead, 2026-10-12), and the roles come last. The Life photo frames are off the page;
// their Sanity code stays for later (Q15, deferred-work.md).
export default async function CareersPage() {
  const roles = await getOpenRoles();

  return (
    <>
      <CareersHero />
      <PageScene>
        <Inside />
        <FlipCards />
        <OpenRoles roles={roles} />
      </PageScene>
    </>
  );
}
