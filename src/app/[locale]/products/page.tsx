import { localeMetadata } from "@/i18n/page-metadata";
import { CaptureBand } from "@/components/contact/capture-band";
import { JourneySection } from "@/components/products/journey/journey-section";
import { PageScene } from "@/components/sections/page-scene";
import { productsMeta } from "@/content/products";

export const generateMetadata = localeMetadata({
  title: productsMeta.title,
  description: productsMeta.description,
});

// E-A5: on the shared page scene (lead, 2026-10-12) the school-day journey
// map, then the navy demo capture band (its default demo copy is "See it
// working at your school."). The journey's own heading sits inside the scene,
// so the scene does not fade in. A day at school and Product updates are
// Tier 2.
export default function ProductsPage() {
  return (
    <PageScene fade={false}>
      <JourneySection />
      <CaptureBand kind="demo" look="navy" />
    </PageScene>
  );
}
