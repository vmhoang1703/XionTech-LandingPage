import { localeMetadata } from "@/i18n/page-metadata";
import { CaptureBand } from "@/components/contact/capture-band";
import { JourneySection } from "@/components/products/journey/journey-section";
import { PageScene } from "@/components/sections/page-scene";
import { productsMeta, productsMetaVi } from "@/content/products";
import { isLocale } from "@/i18n/locales";

export const generateMetadata = localeMetadata({
  en: productsMeta,
  vi: productsMetaVi,
});

// E-A5: on the shared page scene (lead, 2026-10-12) the roadmap of the three
// products (lead, 2026-10-14), then the navy demo capture band (its default
// demo copy is "See it working at your school."). The roadmap's own heading
// sits inside the scene, so the scene does not fade in. Product updates are
// Tier 2.
export default async function ProductsPage({
  params,
}: Readonly<Pick<PageProps<"/[locale]/products">, "params">>) {
  const { locale: param } = await params;
  const locale = isLocale(param) ? param : "en";
  return (
    <PageScene fade={false}>
      <JourneySection locale={locale} />
      <CaptureBand kind="demo" look="navy" />
    </PageScene>
  );
}
