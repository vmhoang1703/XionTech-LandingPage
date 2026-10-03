import { FrontDoors } from "@/components/home/front-doors";
import { HomeHero } from "@/components/home/home-hero";
import { HomeProcess } from "@/components/home/home-process";
import { ProductBento } from "@/components/home/product-bento";
import { ServiceCards } from "@/components/home/service-cards";
import { CaptureBand } from "@/components/contact/capture-band";

// Home sections from Sammy's stories above; Andy's demo capture band stays
// last (FR-14, Story 3.7 CAP-4).
export default function Home() {
  return (
    <>
      <HomeHero />
      <FrontDoors />
      <ProductBento />
      <ServiceCards />
      <HomeProcess />
      <CaptureBand kind="demo" />
    </>
  );
}
