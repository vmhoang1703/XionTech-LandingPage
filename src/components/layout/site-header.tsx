import Image from "next/image";
import Link from "next/link";
import { LABELS } from "./nav-data";
import { MobileMenu } from "./mobile-menu";
import { SiteNav } from "./site-nav";

export function SiteHeader() {
  return (
    <>
      <a href="#main" className="skip">
        {LABELS.skipLink}
      </a>
      <header className="border-border sticky top-0 z-[var(--z-index-header)] h-[var(--spacing-header-height)] border-b bg-[color-mix(in_srgb,var(--color-page)_78%,transparent)] backdrop-blur-[16px] backdrop-saturate-[170%]">
        <div className="wrap flex h-full items-center justify-between gap-[22px]">
          <div className="flex items-center gap-[22px]">
            <Link href="/" aria-label={LABELS.homeLink} className="flex">
              <Image
                src="/logo.png"
                alt={LABELS.logoAlt}
                width={250}
                height={46}
                loading="eager"
                className="h-8 w-auto max-[641px]:h-[26px]"
              />
            </Link>
            <SiteNav />
          </div>
          <div className="flex items-center gap-2">
            {/* max-[641px] is Tailwind v4 for (width < 641px): 640px and below. */}
            <Link
              href="/demo#form"
              className="btn btn-primary btn-sm max-[641px]:hidden"
            >
              {LABELS.bookDemo}
            </Link>
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}
