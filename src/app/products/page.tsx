import type { Metadata } from "next";
import { ProductsHero } from "@/components/products/products-hero";
import { PxpSection } from "@/components/products/pxp-section";
import { ProductsSubnav } from "@/components/products/products-subnav";
import {
  IotSection,
  SxpSection,
} from "@/components/products/products-web-apps";
import { productsMeta } from "@/content/products";

export const metadata: Metadata = {
  title: productsMeta.title,
  description: productsMeta.description,
};

export default function ProductsPage() {
  return (
    <>
      <ProductsHero />
      <ProductsSubnav />
      <PxpSection />
      <SxpSection />
      <IotSection />
    </>
  );
}
