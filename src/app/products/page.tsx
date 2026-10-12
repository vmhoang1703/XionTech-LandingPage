import type { Metadata } from "next";
import { CaptureBand } from "@/components/contact/capture-band";
import { DayRoadmap } from "@/components/products/roadmap/day-roadmap";
import { ProductShowcase } from "@/components/products/product-showcase";
import { productsMeta } from "@/content/products";

export const metadata: Metadata = {
  title: productsMeta.title,
  description: productsMeta.description,
};

// E-A5: the school-day roadmap, the four showcase cards, then
// the demo capture band (its default demo copy is "See it working at your
// school."). A day at school and Product updates are Tier 2.
export default function ProductsPage() {
  return (
    <>
      <DayRoadmap />
      <ProductShowcase />
      <CaptureBand kind="demo" look="navy" />
    </>
  );
}
