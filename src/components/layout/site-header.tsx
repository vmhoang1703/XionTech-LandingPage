import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { localeHref, type Locale } from "@/i18n/locales";
import { SHELL } from "@/i18n/shell";
import { LanguageMenu } from "./language-menu";
import { HeaderScroll } from "./header-scroll";
import { CONTACT_HREF } from "./nav-data";
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
      <header
        data-autohide=""
        className="pointer-events-none sticky top-0 z-[var(--z-index-header)] mb-[calc(var(--spacing-header-room)*-1)] h-[var(--spacing-header-room)] px-3 pt-3"
      >
        <div className="nav-pill pointer-events-auto relative mx-auto flex h-[var(--spacing-header-height)] max-w-[1180px] items-center gap-[22px] rounded-full border border-white/80 bg-white/95 pr-3 pl-4 shadow-[0_14px_34px_-16px_rgb(11_23_48/0.32),0_1px_2px_rgb(11_23_48/0.06)] backdrop-blur-[18px] backdrop-saturate-[170%] max-[1080px]:h-14 max-[1080px]:gap-2 max-[1080px]:pr-1.5 max-[1080px]:pl-2.5 max-[479px]:gap-1 min-[1081px]:max-[1279.98px]:gap-3">
          <Link
            href={localeHref(locale, "/")}
            aria-label={t.homeLink}
            className="flex min-h-11 shrink-0 items-center px-2 max-[1080px]:mr-auto max-[1080px]:px-1"
          >
            <Image
              src="/brand/xiontech-logo.svg"
              alt={t.logoAlt}
              width={250}
              height={46}
              loading="eager"
              unoptimized
              className="h-8 w-auto max-[641px]:h-[26px] max-[374px]:h-[22px] max-[339px]:h-5"
            />
          </Link>
          <SiteNav locale={locale} t={t} />
          <Link
            href={localeHref(locale, CONTACT_HREF)}
            className="btn btn-primary btn-sm nav-talk max-[479px]:px-3.5 max-[411px]:hidden min-[1081px]:max-[1199.98px]:px-3.5"
          >
            {t.contactShort}
            <ArrowRightIcon
              aria-hidden="true"
              className="max-[479px]:hidden min-[1081px]:max-[1199.98px]:hidden"
            />
          </Link>
          <LanguageMenu label={SHELL[locale].language.label} />
          {/* Phones and tablets (2026-10-15): logo left, then language and the
              menu button on the right edge, so the menu opens and closes from
              one spot. Above 1080px the menu is hidden and language is last. */}
          <MobileMenu locale={locale} t={t} />
        </div>
        <HeaderScroll />
      </header>
    </>
  );
}
