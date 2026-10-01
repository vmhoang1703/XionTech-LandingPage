import { FrontDoors } from "@/components/home/front-doors";
import { HomeHero } from "@/components/home/home-hero";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <HomeHero />
      <FrontDoors />
    </main>
  );
}
