import { localeMetadata } from "@/i18n/page-metadata";
import { isLocale } from "@/i18n/locales";
import { Capabilities } from "@/components/home/capabilities";
import { HomeApps } from "@/components/home/home-apps";
import { HomeFaq } from "@/components/home/home-faq";
import { HomeHero } from "@/components/home/home-hero";
import { HomeOutcomes } from "@/components/home/home-outcomes";
import { HomeProcess } from "@/components/home/home-process";
import { HomeValues } from "@/components/home/home-values";
import { HomeContact } from "@/components/contact/home-contact";
import { HomeNews } from "@/components/news/home-news";
import { PageScene } from "@/components/sections/page-scene";

export const generateMetadata = localeMetadata({
  title: "XionTech | School Platforms & Software Outsourcing in Vietnam",
});

// Home (E-S1): the hero with its doors, then one story on one flowing light
// surface: what we help you achieve, the apps, why XionTech, how we work, our
// values and four answers (lead, 2026-10-11). Andy's news row and contact
// section stay last (E-A4 CAP-1). Below the hero, PageScene gives the page
// one light colour with a moving amber and blue colour field; How we work is
// the one navy moment, and Contact warms the end into amber above the footer.
export default async function Home({
  params,
}: Readonly<Pick<PageProps<"/[locale]">, "params">>) {
  const { locale: param } = await params;
  const locale = isLocale(param) ? param : "en";
  return (
    <>
      <HomeHero locale={locale} />
      <PageScene>
        <div className="home-flow">
          <HomeOutcomes locale={locale} />
          <HomeApps locale={locale} />
          <Capabilities locale={locale} />
          <HomeProcess locale={locale} />
          <HomeValues locale={locale} />
          <HomeFaq locale={locale} />
        </div>
        <HomeNews locale={locale} />
        <HomeContact />
      </PageScene>
    </>
  );
}
