import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { LanguageMenu } from "./language-menu";
import { LABELS } from "./nav-data";
import { MobileMenu } from "./mobile-menu";
import { SiteNav } from "./site-nav";

export function SiteHeader() {
  return (
    <>
      <a href="#main" className="skip">
        {LABELS.skipLink}
      </a>
      {/* The header pill (lead, 2026-10-12, in the style of busplanner.com; replaces
          prototype ENH-002's full-width bar): a white pill with rounded ends floats over the
          top of each page, which runs under it (each first section adds --spacing-header-room
          to its top padding). The strip around the pill lets clicks through. */}
      <header className="pointer-events-none sticky top-0 z-[var(--z-index-header)] mb-[calc(var(--spacing-header-room)*-1)] h-[var(--spacing-header-room)] px-3 pt-3">
        <div className="pointer-events-auto mx-auto flex h-[var(--spacing-header-height)] max-w-[1180px] items-center gap-[22px] rounded-full border border-white/80 bg-white/95 pr-3 pl-4 shadow-[0_14px_34px_-16px_rgb(11_23_48/0.32),0_1px_2px_rgb(11_23_48/0.06)] backdrop-blur-[18px] backdrop-saturate-[170%] max-[1080px]:h-14 max-[1080px]:gap-2 max-[1080px]:pr-1.5 max-[1080px]:pl-2.5 max-[339px]:gap-1">
          <Link
            href="/"
            aria-label={LABELS.homeLink}
            className="flex shrink-0 px-2 max-[1080px]:px-1"
          >
            <Image
              src="/logo.png"
              alt={LABELS.logoAlt}
              width={250}
              height={46}
              loading="eager"
              className="h-8 w-auto max-[641px]:h-[26px] max-[374px]:h-[22px] max-[339px]:h-5"
            />
          </Link>
          <SiteNav />
          <Link
            href="/demo"
            className="btn btn-primary btn-sm max-[1080px]:ml-auto max-[420px]:px-3.5"
          >
            {LABELS.demo}
            <ArrowRightIcon aria-hidden="true" className="max-[420px]:hidden" />
          </Link>
          <MobileMenu />
          <LanguageMenu />
        </div>
      </header>
    </>
  );
}
