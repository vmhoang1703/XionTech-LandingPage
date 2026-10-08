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
      <header className="sticky top-0 z-[var(--z-index-header)] h-[var(--spacing-header-height)] bg-[color-mix(in_srgb,var(--color-page)_78%,transparent)] backdrop-blur-[16px] backdrop-saturate-[170%]">
        {/* Prototype ENH-002: logo on the left, links on the right, no bottom border. */}
        <div className="wrap flex h-full items-center gap-[22px] max-[641px]:gap-3">
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
          <MobileMenu />
        </div>
      </header>
    </>
  );
}
