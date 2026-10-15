import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { LocaleLink } from "@/components/layout/locale-link";
import { ProcessFlow } from "@/components/sections/process-flow";
import { homeProcess, homeProcessVi } from "@/content/home";
import { processFlow, processFlowVi } from "@/content/process";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";

// Home "How we work" section: the page's one navy moment, a rounded navy
// panel (surface-navy) with a moving amber light, the shared 4-D process
// flow and the link to Services on the heading row (lead, 2026-10-11).
export function HomeProcess({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  const { title, lede, link } = pickLocale(locale, {
    en: homeProcess,
    vi: homeProcessVi,
  });

  return (
    <section
      aria-labelledby="process-title"
      className="sec home-process surface-navy"
    >
      <div className="wrap">
        <div className="sec-head-row" data-reveal="">
          <div className="sec-head">
            <h2 id="process-title">{title}</h2>
            <p className="lede">{lede}</p>
          </div>
          <LocaleLink href={link.href} className="link-arrow">
            <span>{link.label}</span>
            <ArrowRightIcon aria-hidden="true" />
          </LocaleLink>
        </div>
        <ProcessFlow
          flow={pickLocale(locale, { en: processFlow, vi: processFlowVi })}
        />
      </div>
    </section>
  );
}
