import { ArrowLeftIcon, CheckCircleIcon } from "@phosphor-icons/react/ssr";
import { LocaleLink } from "@/components/layout/locale-link";
import type { ReactNode } from "react";
import { jobDetails as jobDetailsEn, jobDetailsVi } from "@/content/job";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import type { OpenRoleDetail } from "@/lib/careers/open-roles";

function CheckList({
  items,
  lang,
}: Readonly<{ items: readonly string[]; lang?: string }>) {
  return (
    <ul className="list-check" lang={lang}>
      {items.map((item) => (
        <li key={item}>
          <CheckCircleIcon weight="fill" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// Server Component. Role text left, the application form (children) right (CAP-1).
// A section with no content is left out, heading included.
export function JobDetails({
  role,
  children,
  locale = "en",
}: Readonly<{ role: OpenRoleDetail; children: ReactNode; locale?: Locale }>) {
  const jobDetails = pickLocale(locale, { en: jobDetailsEn, vi: jobDetailsVi });
  const paragraphs = (role.about ?? "")
    .split("\n\n")
    .map((text) => text.trim())
    .filter(Boolean);
  const responsibilities = role.responsibilities ?? [];
  const requirements = role.requirements ?? [];
  const lang = role.detailLang ?? undefined;

  return (
    <section className="sec surface-paper" aria-label={jobDetails.sectionLabel}>
      <div className="wrap split items-start">
        <article className="job-body">
          {paragraphs.length > 0 && (
            <>
              <h2>{jobDetails.aboutHeading}</h2>
              {paragraphs.map((text) => (
                <p key={text} lang={lang}>
                  {text}
                </p>
              ))}
            </>
          )}
          {responsibilities.length > 0 && (
            <>
              <h2>{jobDetails.doHeading}</h2>
              <CheckList items={responsibilities} lang={lang} />
            </>
          )}
          {requirements.length > 0 && (
            <>
              <h2>{jobDetails.bringHeading}</h2>
              <CheckList items={requirements} lang={lang} />
            </>
          )}
          <p className="mt-7">
            <LocaleLink className="link-arrow" href={jobDetails.backHref}>
              <ArrowLeftIcon aria-hidden="true" />
              <span>{jobDetails.backLabel}</span>
            </LocaleLink>
          </p>
        </article>
        <div id="apply" className="form-card">
          {children}
        </div>
      </div>
    </section>
  );
}
