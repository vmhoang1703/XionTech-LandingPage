import type { Metadata } from "next";
import { ProductsHero } from "@/components/products/products-hero";
import { PxpSection } from "@/components/products/pxp-section";
import { ProductsSubnav } from "@/components/products/products-subnav";
import { productsMeta, productsSections } from "@/content/products";

export const metadata: Metadata = {
  title: productsMeta.title,
  description: productsMeta.description,
};

export default function ProductsPage() {
  return (
    <>
      <ProductsHero />
      <ProductsSubnav />
      {productsSections.map((section) =>
        section.id === "pxp" ? (
          <PxpSection key={section.id} />
        ) : (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-h`}
            className="products-anchor"
          >
            <div className="wrap">
              <h2 id={`${section.id}-h`}>{section.heading}</h2>
            </div>
          </section>
        ),
      )}
    </>
  );
}
