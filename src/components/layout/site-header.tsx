import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { localeHref, type Locale } from "@/i18n/locales";
import { SHELL } from "@/i18n/shell";
import { LanguageMenu } from "./language-menu";
import { MobileMenu } from "./mobile-menu";
import { SiteNav } from "./site-nav";

export function SiteHeader({ locale }: Readonly<{ locale: Locale }>) {
  const t = SHELL[locale].nav;
  return (
    <>
      <a href="#main" className="skip">
        {t.skipLink}
      </a>
      {/* The header pill (lead, 2026-10-12, in the style of busplanner.com; replaces
          prototype ENH-002's full-width bar): a white pill with rounded ends floats over the
          top of each page, which runs under it (each first section adds --spacing-header-room
          to its top padding). The strip around the pill lets clicks through. */}
      <header className="pointer-events-none sticky top-0 z-[var(--z-index-header)] mb-[calc(var(--spacing-header-room)*-1)] h-[var(--spacing-header-room)] px-3 pt-3">
        <div className="pointer-events-auto mx-auto flex h-[var(--spacing-header-height)] max-w-[1180px] items-center gap-[22px] rounded-full border border-white/80 bg-white/95 pr-3 pl-4 shadow-[0_14px_34px_-16px_rgb(11_23_48/0.32),0_1px_2px_rgb(11_23_48/0.06)] backdrop-blur-[18px] backdrop-saturate-[170%] max-[1080px]:h-14 max-[1080px]:gap-2 max-[1080px]:pr-1.5 max-[1080px]:pl-2.5 max-[339px]:gap-1">
          <Link
            href={localeHref(locale, "/")}
            aria-label={t.homeLink}
            className="flex min-h-11 shrink-0 items-center px-2 max-[1080px]:px-1"
          >
            <Image
              src="/logo.png"
              alt={t.logoAlt}
              width={250}
              height={46}
              loading="eager"
              className="h-8 w-auto max-[641px]:h-[26px] max-[374px]:h-[22px] max-[339px]:h-5"
            />
          </Link>
          <SiteNav locale={locale} />
          <Link
            href={localeHref(locale, "/demo")}
            className="btn btn-primary btn-sm max-[1080px]:ml-auto max-[443px]:px-3.5 max-[411px]:hidden"
          >
            {t.demo}
            <ArrowRightIcon aria-hidden="true" className="max-[443px]:hidden" />
          </Link>
          <MobileMenu locale={locale} />
          <LanguageMenu />
        </div>
      </header>
    </>
  );
}
