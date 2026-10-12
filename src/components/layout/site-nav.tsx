"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { currentSection, LABELS, NAV_LINKS } from "./nav-data";

// The header pill (lead, 2026-10-12, in the style of busplanner.com): each link is a
// small pill of its own, light blue on hover and soft amber when it is the current page.
// The mobile menu uses the same links.
export const itemClass =
  "inline-flex h-11 items-center rounded-full px-4 text-ui leading-none font-semibold text-navy transition-[background-color] duration-[250ms] ease-[var(--ease-brand)] hover:bg-[color-mix(in_srgb,var(--color-ice)_70%,transparent)] aria-[current=page]:bg-[color-mix(in_srgb,var(--color-amber-light)_38%,white)]";

export function SiteNav() {
  const section = currentSection(usePathname());

  return (
    <nav
      aria-label={LABELS.mainNav}
      className="mx-auto hidden items-center gap-1 min-[1081px]:flex"
    >
      {NAV_LINKS.map((item) => (
        <Link
          key={item.section}
          href={item.href}
          className={itemClass}
          aria-current={section === item.section ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
