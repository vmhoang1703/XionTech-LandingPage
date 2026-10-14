import { FaqList } from "@/components/sections/faq-list";
import { homeFaq, homeFaqVi } from "@/content/home";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";

// Home "Your questions, answered.": four About answers and a link to the rest.
export function HomeFaq({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  const { title, lede, items, link } = pickLocale(locale, {
    en: homeFaq,
    vi: homeFaqVi,
  });

  return (
    <section aria-labelledby="home-faq-h" className="sec">
      <div className="wrap faq-head" data-reveal="">
        <h2 id="home-faq-h">{title}</h2>
        <p className="lede">{lede}</p>
      </div>
      <div className="wrap">
        <FaqList items={items} link={link} />
      </div>
    </section>
  );
}
