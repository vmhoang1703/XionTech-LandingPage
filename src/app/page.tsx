import type { Metadata } from "next";
import { Capabilities } from "@/components/home/capabilities";
import { HomeApps } from "@/components/home/home-apps";
import { HomeFaq } from "@/components/home/home-faq";
import { HomeHero } from "@/components/home/home-hero";
import { HomeOutcomes } from "@/components/home/home-outcomes";
import { HomeProcess } from "@/components/home/home-process";
import { HomeValues } from "@/components/home/home-values";
import { HomeContact } from "@/components/contact/home-contact";
import { HomeNews } from "@/components/news/home-news";

export const metadata: Metadata = {
  title: "XionTech | School Platforms & Software Outsourcing in Vietnam",
};

// Home (E-S1): the hero with its doors, then one story on one flowing light
// surface: what we help you achieve, the apps, why XionTech, how we work, our
// values and four answers (lead, 2026-10-11). Andy's news row and contact
// section keep their own surfaces and stay last (E-A4 CAP-1).
export default function Home() {
  return (
    <>
      <HomeHero />
      <div className="home-flow">
        <HomeOutcomes />
        <HomeApps />
        <Capabilities />
        <HomeProcess />
        <HomeValues />
        <HomeFaq />
      </div>
      <HomeNews />
      <HomeContact />
    </>
  );
}
