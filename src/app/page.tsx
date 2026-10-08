import type { Metadata } from "next";
import { Capabilities } from "@/components/home/capabilities";
import { HomeHero } from "@/components/home/home-hero";
import { HomeProcess } from "@/components/home/home-process";
import { HomeValues } from "@/components/home/home-values";
import { HomeContact } from "@/components/contact/home-contact";
import { HomeNews } from "@/components/news/home-news";

export const metadata: Metadata = {
  title: "XionTech | School Platforms & Software Outsourcing in Vietnam",
};

// Home (E-S1): the hero with its doors, then Capabilities, core values and
// the 4-D process on one flowing light surface. Andy's news row and contact
// section keep their own surfaces and stay last (E-A4 CAP-1).
export default function Home() {
  return (
    <>
      <HomeHero />
      <div className="home-flow">
        <Capabilities />
        <HomeValues />
        <HomeProcess />
      </div>
      <HomeNews />
      <HomeContact />
    </>
  );
}
