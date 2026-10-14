"use client";

import { ListIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { localeHref, type Locale } from "@/i18n/locales";
import { SHELL } from "@/i18n/shell";
import { currentSection, NAV_LINKS } from "./nav-data";
import { itemClass } from "./site-nav";

const MENU_ID = "mobile-menu";
// The menu is for 1080px and below (inclusive, as the prototype CSS); above it the desktop
// nav shows, so growing past it closes the menu (decision T6).
const DESKTOP_QUERY = "(min-width: 1081px)";
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// While open, focus cycles through the header bar controls (logo, Menu, the EN/VI
// switch) and the open panel (EXPERIENCE.md "Mobile menu").
// Elements hidden by CSS at this width (the desktop nav) have no boxes and are skipped.
function trapTargets(scope: ParentNode) {
  return [...scope.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => el.getClientRects().length > 0,
  );
}

export function MobileMenu({ locale }: Readonly<{ locale: Locale }>) {
  const t = SHELL[locale].nav;
  const pathname = usePathname();
  // The menu is open only on the pathname it was opened on, so a navigation closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (openedOn !== null && openedOn !== pathname) {
    setOpenedOn(null);
  }
  const open = openedOn === pathname;
  const section = currentSection(pathname);

  useEffect(() => {
    if (!open) {
      return;
    }
    const root = document.documentElement;
    const lockedBefore = root.style.overflow;
    const scope = buttonRef.current?.closest("header") ?? document;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenedOn(null);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const targets = trapTargets(scope);
      const index = targets.indexOf(document.activeElement as HTMLElement);
      const last = targets.length - 1;
      let next: HTMLElement | undefined;
      if (event.shiftKey && index <= 0) {
        next = targets[last];
      } else if (!event.shiftKey && (index === -1 || index === last)) {
        next = targets[0];
      }
      if (next) {
        event.preventDefault();
        next.focus();
      }
    };
    // Any link closes the menu (CAP-8), also one to the current page (the logo on
    // Home), which changes no pathname. A clicked panel link to this page hides with
    // the panel, so focus moves to Menu.
    const onClick = (event: MouseEvent) => {
      const link =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (!link) {
        return;
      }
      setOpenedOn(null);
      // Panel links are the app's own (NAV_LINKS), so they parse.
      if (
        link instanceof HTMLAnchorElement &&
        document.getElementById(MENU_ID)?.contains(link) &&
        new URL(link.href).pathname === pathname
      ) {
        buttonRef.current?.focus();
      }
    };
    const desktop = matchMedia(DESKTOP_QUERY);
    const onWiden = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setOpenedOn(null);
      }
    };
    root.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    desktop.addEventListener("change", onWiden);
    return () => {
      root.style.overflow = lockedBefore;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
      desktop.removeEventListener("change", onWiden);
    };
  }, [open, pathname]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        // A 44px round hamburger icon, a cross while open, light blue on hover and while
        // open like the nav links.
        className="text-navy inline-flex size-11 items-center justify-center rounded-full text-2xl transition-[background-color] duration-[250ms] ease-[var(--ease-brand)] hover:bg-[color-mix(in_srgb,var(--color-ice)_70%,transparent)] aria-expanded:bg-[color-mix(in_srgb,var(--color-ice)_70%,transparent)] min-[1081px]:hidden"
        aria-controls={MENU_ID}
        aria-expanded={open}
        onClick={() => setOpenedOn(open ? null : pathname)}
      >
        {open ? <XIcon aria-hidden="true" /> : <ListIcon aria-hidden="true" />}
        <span className="sr-only">{t.menu}</span>
      </button>
      <nav
        id={MENU_ID}
        aria-label={t.mainNav}
        hidden={!open}
        className="border-border bg-paper pointer-events-auto absolute inset-x-3 top-full z-[var(--z-index-mobile-menu)] flex max-h-[calc(100dvh-var(--spacing-header-room))] flex-col items-stretch gap-0.5 overflow-auto rounded-[28px] border p-4 shadow-[0_24px_48px_-24px_rgb(11_23_48/0.35)]"
      >
        {/* Below 412px the header hides Book a demo, so the menu always offers it first. */}
        <Link href={localeHref(locale, "/demo")} className={itemClass}>
          {t.demo}
        </Link>
        {NAV_LINKS.map((item) => (
          <Link
            key={item.section}
            href={localeHref(locale, item.href)}
            className={itemClass}
            aria-current={section === item.section ? "page" : undefined}
          >
            {t[item.section]}
          </Link>
        ))}
      </nav>
    </>
  );
}
