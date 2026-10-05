import type { Metadata } from "next";
import { Benefits } from "@/components/careers/benefits";
import { CareersHero } from "@/components/careers/careers-hero";
import { Culture } from "@/components/careers/culture";
import { LifeFrames } from "@/components/careers/life-frames";
import { OpenRoles } from "@/components/careers/open-roles";
import { careersMeta } from "@/content/careers";
import { getLifePhotos } from "@/lib/careers/life-photos";
import { getOpenRoles } from "@/lib/careers/open-roles";

export const metadata: Metadata = {
  title: careersMeta.title,
  description: careersMeta.description,
};

export default async function CareersPage() {
  const [roles, photos] = await Promise.all([getOpenRoles(), getLifePhotos()]);

  return (
    <>
      <CareersHero />
      <Culture />
      <Benefits />
      <OpenRoles roles={roles} />
      <LifeFrames photos={photos} />
    </>
  );
}
