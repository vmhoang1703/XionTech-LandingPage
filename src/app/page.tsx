import { FrontDoors } from "@/components/home/front-doors";
import { HomeHero } from "@/components/home/home-hero";
import { ProductBento } from "@/components/home/product-bento";
import { ServiceCards } from "@/components/home/service-cards";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <HomeHero />
      <FrontDoors />
      <ProductBento />
      <ServiceCards />
    </main>
  );
}
