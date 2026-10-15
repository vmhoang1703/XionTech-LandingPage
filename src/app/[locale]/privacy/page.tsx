import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { LocaleLink } from "@/components/layout/locale-link";
import { PRIVACY as PRIVACY_EN, PRIVACY_VI } from "@/content/privacy";
import {
  POLICY_CLOSING,
  POLICY_META,
  POLICY_SECTIONS,
  type PolicyBlock,
} from "@/content/privacy-policy";
import { pickLocale } from "@/i18n/content";
import { isLocale } from "@/i18n/locales";
import { seoMetadata } from "@/lib/seo/site";
import { heroWords } from "@/components/sections/hero-words";
import { breadcrumbLd, JsonLd } from "@/lib/seo/json-ld";
import { SHELL } from "@/i18n/shell";

export async function generateMetadata({
  params,
}: Readonly<
  Pick<PageProps<"/[locale]/privacy">, "params">
>): Promise<Metadata> {
  const { locale: param } = await params;
  const locale = isLocale(param) ? param : "en";
  const { metaTitle, metaDescription } = pickLocale(locale, {
    en: PRIVACY_EN,
    vi: PRIVACY_VI,
  });
  return seoMetadata(locale, "/privacy", {
    title: metaTitle,
    description: metaDescription,
  });
}

// Emails and the phone number in the policy, made into mailto:/tel: links.
const CONTACT =
  /(contact@xiontechs\.com|itsupport@xiontechs\.com|\+084-908-107552)/g;

function linkify(text: string): ReactNode {
  const parts = text.split(CONTACT).map((part, i) => {
    const href = part.includes("@")
      ? `mailto:${part}`
      : `tel:+${part.replace(/\D/g, "").replace(/^0/, "")}`;
    return i % 2 === 0 ? (
      <Fragment key={`t-${i}`}>{part}</Fragment>
    ) : (
      <a key={`${part}-${i}`} href={href}>
        {part}
      </a>
    );
  });
  return <>{parts}</>;
}

// "Label: text" lines show the label in bold, as in the source.
function labelled(text: string): ReactNode {
  const match = /^([^:]{2,60}):\s(.+)$/.exec(text);
  return match ? (
    <>
      <strong>{match[1]}:</strong> {linkify(match[2])}
    </>
  ) : (
    linkify(text)
  );
}

function Block({ block }: Readonly<{ block: PolicyBlock }>) {
  switch (block.kind) {
    case "heading":
      return block.level === 3 ? <h3>{block.text}</h3> : <h4>{block.text}</h4>;
    case "p":
      return <p>{labelled(block.text)}</p>;
    case "list":
      return (
        <ul>
          {block.items.map((text) => (
            <li key={text}>{labelled(text)}</li>
          ))}
        </ul>
      );
    case "facts":
      return <Facts items={block.items} />;
  }
}

function Facts({
  items,
  className = "policy-facts",
}: Readonly<{
  items: readonly (readonly [string, string])[];
  className?: string;
}>) {
  return (
    <dl className={className}>
      {items.map(([term, value]) => (
        <Fragment key={term}>
          <dt>{term}</dt>
          <dd>{linkify(value)}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

// The XionTech Privacy Policy (privacy-policy.ts): legal text, in English on
// every locale, with a localized note on the others. A plain reading page: no
// capture band (FR-33 exception).
export default async function PrivacyPage({
  params,
}: Readonly<Pick<PageProps<"/[locale]/privacy">, "params">>) {
  const { locale: param } = await params;
  const locale = isLocale(param) ? param : "en";
  const PRIVACY = pickLocale(locale, { en: PRIVACY_EN, vi: PRIVACY_VI });
  const t = heroWords();
  const dates = POLICY_META.slice(0, 3)
    .map(([label, value]) => `${label}: ${value}`)
    .join(" · ");
  return (
    <>
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: SHELL[locale].footer.privacy, path: "/privacy" },
        ])}
      />
      <section
        className="hero-light page-hero pb-12"
        aria-labelledby="privacy-h1"
      >
        <div className="wrap">
          <nav className="crumbs" aria-label={PRIVACY.breadcrumbLabel}>
            <LocaleLink href="/">{PRIVACY.breadcrumbHome}</LocaleLink>
            <span>/</span>
            <span>{PRIVACY.breadcrumbCurrent}</span>
          </nav>
          <h1 id="privacy-h1">{t.words(PRIVACY.title)}</h1>
          <p className="policy-dates" lang="en">
            {dates}
          </p>
          {locale === "en" ? null : (
            <p className="policy-lang-note">{PRIVACY.languageNote}</p>
          )}
        </div>
      </section>

      <section
        className="surface-paper sec pt-10"
        aria-label={PRIVACY.bodyLabel}
      >
        <div className="wrap policy-layout">
          <nav className="policy-toc" aria-label={PRIVACY.tocLabel}>
            <p className="policy-toc-title">{PRIVACY.tocLabel}</p>
            <ol lang="en">
              {POLICY_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="policy" lang="en">
            {POLICY_SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-h`}
              >
                <h2 id={`${section.id}-h`}>{section.title}</h2>
                {section.blocks.map((block, i) => (
                  <Block key={`${section.id}-${i}`} block={block} />
                ))}
              </section>
            ))}
            <Facts items={POLICY_META} className="policy-facts policy-meta" />
            <p>{POLICY_CLOSING}</p>
          </article>
        </div>
      </section>
    </>
  );
}
