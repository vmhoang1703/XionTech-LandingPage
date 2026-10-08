import { FrontDoors } from "@/components/home/front-doors";
import { HomeHero } from "@/components/home/home-hero";
import { HomeProcess } from "@/components/home/home-process";
import { ProductBento } from "@/components/home/product-bento";
import { ServiceCards } from "@/components/home/service-cards";
import { HomeContact } from "@/components/contact/home-contact";
import { HomeNews } from "@/components/news/home-news";

// Home sections from Sammy's stories above; Andy's contact section stays
// last (E-A4 CAP-1).
export default function Home() {
  return (
    <>
      <HomeHero />
      <FrontDoors />
      <ProductBento />
      <ServiceCards />
      <HomeProcess />
      <HomeNews />
      <HomeContact />
    </>
  );
}
