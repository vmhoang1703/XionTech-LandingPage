import Image from "next/image";
import Link from "next/link";
import { LABELS } from "./nav-data";
import { SiteNav } from "./site-nav";

export function SiteHeader() {
  return (
    <>
      <a href="#main" className="skip text-ui font-bold">
        {LABELS.skipLink}
      </a>
      <header className="border-border sticky top-0 z-[var(--z-index-header)] h-[var(--spacing-header-height)] border-b bg-[color-mix(in_srgb,var(--color-paper)_78%,transparent)] backdrop-blur-[16px] backdrop-saturate-[170%]">
        <div className="wrap flex h-full items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link href="/" aria-label="XionTechs home" className="flex">
              <Image
                src="/logo.png"
                alt="XionTechs, Get IT Done"
                width={250}
                height={46}
                priority
                className="h-8 w-auto max-[640px]:h-[26px]"
              />
            </Link>
            <SiteNav />
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/demo#form"
              className="btn btn-primary btn-sm max-[640px]:hidden"
            >
              {LABELS.bookDemo}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
