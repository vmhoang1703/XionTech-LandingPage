import { FrontDoors } from "@/components/home/front-doors";
import { HomeHero } from "@/components/home/home-hero";
import { HomeProcess } from "@/components/home/home-process";
import { ProductBento } from "@/components/home/product-bento";
import { ServiceCards } from "@/components/home/service-cards";

export default function Home() {
  return (
    <>
      <HomeHero />
      <FrontDoors />
      <ProductBento />
      <ServiceCards />
      <HomeProcess />
    </>
  );
}
