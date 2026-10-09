import type { Metadata } from "next";
import { CaptureBand } from "@/components/contact/capture-band";
import { AudienceFlow } from "@/components/products/flow/audience-flow";
import { ProductShowcase } from "@/components/products/product-showcase";
import { productsMeta } from "@/content/products";

export const metadata: Metadata = {
  title: productsMeta.title,
  description: productsMeta.description,
};

// E-A5: the audience flow through the campus, the four showcase cards, then
// the demo capture band (its default demo copy is "See it working at your
// school."). A day at school and Product updates are Tier 2.
export default function ProductsPage() {
  return (
    <>
      <AudienceFlow />
      <ProductShowcase />
      <CaptureBand kind="demo" look="navy" />
    </>
  );
}
