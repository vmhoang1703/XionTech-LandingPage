"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { currentSection, LABELS, NAV_LINKS } from "./nav-data";
import { itemClass } from "./site-nav";

const MENU_ID = "mobile-menu";
// The menu is for 1080px and below (inclusive, as the prototype CSS); above it the desktop
// nav shows, so growing past it closes the menu (decision T6).
const DESKTOP_QUERY = "(min-width: 1081px)";
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// While open, focus cycles through the header bar controls (logo, Book a demo above 640px,
// later the EN/VI switch, Menu) and the open panel (EXPERIENCE.md "Mobile menu").
// Elements hidden by CSS at this width (the desktop nav) have no boxes and are skipped.
function trapTargets(scope: ParentNode) {
  return [...scope.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => el.getClientRects().length > 0,
  );
}

export function MobileMenu() {
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
    // Any link closes the menu, also one to the current page (the logo on Home), which
    // changes no pathname (CAP-8). A modifier or middle click opens a new tab, so the
    // menu stays open. A panel link to this page hides itself, so focus goes to Menu.
    const onClick = (event: MouseEvent) => {
      const link =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      const newTab =
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey;
      if (!link || newTab) {
        return;
      }
      setOpenedOn(null);
      const samePage =
        link instanceof HTMLAnchorElement &&
        new URL(link.href).pathname === pathname;
      if (samePage && document.getElementById(MENU_ID)?.contains(link)) {
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
        className="border-navy/14 text-navy inline-flex h-10 items-center rounded-full border px-4 text-[0.9rem] leading-none font-semibold min-[1081px]:hidden"
        aria-controls={MENU_ID}
        aria-expanded={open}
        onClick={() => setOpenedOn(open ? null : pathname)}
      >
        {LABELS.menu}
      </button>
      <nav
        id={MENU_ID}
        aria-label={LABELS.mainNav}
        hidden={!open}
        className="border-border bg-paper absolute inset-x-0 top-full z-[var(--z-index-mobile-menu)] flex max-h-[calc(100dvh-var(--spacing-header-height))] flex-col items-stretch gap-0.5 overflow-auto border-b px-6 pt-4 pb-6"
      >
        <Link
          href="/demo#form"
          className="btn btn-primary mb-2.5 hidden justify-center max-[641px]:inline-flex"
        >
          {LABELS.bookDemo}
        </Link>
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
    </>
  );
}
