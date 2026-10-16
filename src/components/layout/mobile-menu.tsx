"use client";

import { ArrowRightIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { contactByPrefix, hcmc, plano } from "@/content/offices";
import { localeHref, type Locale } from "@/i18n/locales";
import type { ShellDictionary } from "@/i18n/shell";
import { CONTACT_HREF, currentSection, NAV_LINKS } from "./nav-data";

const MENU_ID = "mobile-menu";
const noSubscribe = () => () => {};

// Under the links (lead, 2026-10-13): the contact button and both
// headquarters' phones, so contact is one tap away from any page.
const MENU_PHONES = [
  { city: "cityPlano", phone: contactByPrefix(plano, "tel:") },
  { city: "cityHcmc", phone: contactByPrefix(hcmc, "tel:") },
] as const;

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

export function MobileMenu({
  locale,
  t,
}: Readonly<{ locale: Locale; t: ShellDictionary["nav"] }>) {
  const pathname = usePathname();
  // The menu is open only on the pathname it was opened on, so a navigation closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (openedOn !== null && openedOn !== pathname) {
    setOpenedOn(null);
  }
  const open = openedOn === pathname;
  // The dimmed backdrop lives on <body>: the pill's backdrop-filter would
  // otherwise trap a fixed layer inside the pill.
  const mounted = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
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
    // The header contact button fades out while open (globals.css);
    // inert keeps it out of the focus cycle, the sheet has its own.
    const talk = scope.querySelector<HTMLElement>(".nav-talk");
    talk?.setAttribute("inert", "");
    // Everything else on the page (main, footer, Back to top) is inert while
    // open, so no key, click or screen reader reaches it behind the sheet
    // (audit 2026-10-16, #5).
    const header = buttonRef.current?.closest("header");
    const behind = header
      ? [...document.body.children].filter(
          (el) =>
            !el.contains(header) &&
            !el.classList.contains("mm-backdrop") &&
            !el.hasAttribute("inert"),
        )
      : [];
    for (const el of behind) el.setAttribute("inert", "");
    root.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    desktop.addEventListener("change", onWiden);
    return () => {
      talk?.removeAttribute("inert");
      for (const el of behind) el.removeAttribute("inert");
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
        className="text-navy inline-flex size-11 shrink-0 items-center justify-center rounded-full text-2xl transition-[background-color] duration-[250ms] ease-[var(--ease-brand)] hover:bg-[color-mix(in_srgb,var(--color-ice)_70%,transparent)] aria-expanded:bg-[color-mix(in_srgb,var(--color-ice)_70%,transparent)] min-[1081px]:hidden"
        aria-controls={MENU_ID}
        aria-expanded={open}
        onClick={() => setOpenedOn(open ? null : pathname)}
      >
        {open ? <XIcon aria-hidden="true" /> : <ListIcon aria-hidden="true" />}
        <span className="sr-only">{t.menu}</span>
      </button>
      {/* The open menu is one surface
          with the pill (globals.css "Mobile menu sheet"): the pill squares its
          bottom corners and the sheet hangs from it. Closed, the sheet stays
          in the DOM (inert, aria-hidden) so it can animate out. */}
      <nav
        id={MENU_ID}
        aria-label={t.mainNav}
        aria-hidden={!open || undefined}
        inert={!open}
        data-open={open || undefined}
        className="mm-sheet"
      >
        <div className="mm-links">
          {NAV_LINKS.map((item, i) => (
            <Link
              key={item.section}
              href={localeHref(locale, item.href)}
              className="mm-link"
              style={{ "--i": i } as CSSProperties}
              aria-current={section === item.section ? "page" : undefined}
            >
              {t[item.section]}
              <ArrowRightIcon aria-hidden="true" className="mm-arrow" />
            </Link>
          ))}
        </div>
        <Link
          href={localeHref(locale, CONTACT_HREF)}
          className="btn btn-primary mm-cta"
          style={{ "--i": NAV_LINKS.length } as CSSProperties}
          onClick={() => setOpenedOn(null)}
        >
          {t.contact}
          <ArrowRightIcon aria-hidden="true" />
        </Link>
        <div
          className="mm-phones"
          style={{ "--i": NAV_LINKS.length + 1 } as CSSProperties}
        >
          {MENU_PHONES.map(({ city, phone }) => (
            <a key={city} href={phone.href}>
              {t[city]} {phone.label}
            </a>
          ))}
        </div>
      </nav>
      {mounted &&
        createPortal(
          <div
            className="mm-backdrop"
            data-open={open || undefined}
            aria-hidden="true"
            onClick={() => setOpenedOn(null)}
          />,
          document.body,
        )}
    </>
  );
}
