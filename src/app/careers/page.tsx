import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
import { FlipCards } from "@/components/careers/flip-cards";
import { Inside } from "@/components/careers/inside";
import { OpenRoles } from "@/components/careers/open-roles";
import { careersMeta } from "@/content/careers";
import { getOpenRoles } from "@/lib/careers/open-roles";

export const metadata: Metadata = {
  title: careersMeta.title,
  description: careersMeta.description,
};

// E-A7: the hero's light blue runs on into `.careers-flow` (white, then light
// amber), and the roles come last. The Life photo frames are off the page;
// their Sanity code stays for later (Q15, deferred-work.md).
export default async function CareersPage() {
  const roles = await getOpenRoles();

  return (
    <>
      <CareersHero />
      <div className="careers-flow">
        <Inside />
        <FlipCards />
        <OpenRoles roles={roles} />
      </div>
    </>
  );
}
