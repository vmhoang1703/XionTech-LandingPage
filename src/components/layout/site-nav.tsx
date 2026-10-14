"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeHref, type Locale } from "@/i18n/locales";
import type { ShellDictionary } from "@/i18n/shell";
import { currentSection, NAV_LINKS } from "./nav-data";

// The header pill (lead, 2026-10-12, in the style of busplanner.com): each link is a
// small pill of its own, light blue on hover and soft amber when it is the current page.
// The mobile menu uses the same links. In the bar each label stays on one line;
// the padding tightens below 1280px so long Vietnamese labels still fit.
export const itemClass =
  "inline-flex h-11 items-center rounded-full px-4 text-ui leading-none font-semibold text-navy transition-[background-color] duration-[250ms] ease-[var(--ease-brand)] hover:bg-[color-mix(in_srgb,var(--color-ice)_70%,transparent)] aria-[current=page]:bg-[color-mix(in_srgb,var(--color-amber-light)_38%,white)]";

export function SiteNav({
  locale,
  t,
}: Readonly<{ locale: Locale; t: ShellDictionary["nav"] }>) {
  const section = currentSection(usePathname());

  return (
    <nav
      aria-label={t.mainNav}
      className="mx-auto hidden items-center gap-1 min-[1081px]:flex"
    >
      {NAV_LINKS.map((item) => (
        <Link
          key={item.section}
          href={localeHref(locale, item.href)}
          className={`${itemClass} whitespace-nowrap min-[1081px]:max-[1119px]:px-1.5 min-[1120px]:max-[1279px]:px-2 min-[1280px]:px-3`}
          aria-current={section === item.section ? "page" : undefined}
        >
          {t[item.section]}
        </Link>
      ))}
    </nav>
  );
}
