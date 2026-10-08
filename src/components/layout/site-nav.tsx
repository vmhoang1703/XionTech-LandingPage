"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { currentSection, LABELS, NAV_LINKS } from "./nav-data";

// Prototype ENH-002: the hover is the 2px amber underline under the word, with no pill.
// No side padding, so the underline is exactly as wide as the word; the mobile menu adds
// its own padding.
export const itemClass =
  "inline-flex h-11 items-center text-ui leading-none text-text transition-[box-shadow,color] duration-[250ms] ease-[var(--ease-brand)] hover:text-navy hover:shadow-[inset_0_-2px_0_var(--color-amber)] aria-[current=page]:font-medium aria-[current=page]:text-navy aria-[current=page]:shadow-[inset_0_-2px_0_var(--color-amber)]";

export function SiteNav() {
  const section = currentSection(usePathname());

  return (
    <nav
      aria-label={LABELS.mainNav}
      className="ml-auto hidden items-center gap-[30px] min-[1081px]:flex"
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
