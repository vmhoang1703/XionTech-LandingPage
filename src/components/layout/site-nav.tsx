"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import {
  currentSection,
  LABELS,
  PRODUCTS,
  PRODUCTS_FOOTER,
  SERVICES,
  SERVICES_FOOTER,
  type MegaFooter,
  type Section,
} from "./nav-data";

type MenuId = "products" | "services";

const itemClass =
  "inline-flex h-10 items-center rounded-full px-3.5 py-[9px] text-ui leading-none text-text transition-colors duration-[250ms] ease-[var(--ease-brand)] hover:bg-mist aria-expanded:bg-mist aria-[current=page]:rounded-none aria-[current=page]:font-bold aria-[current=page]:text-navy aria-[current=page]:shadow-[inset_0_-2px_0_var(--color-amber)]";

// Prototype values with no design token.
const panelClass =
  "absolute top-[calc(100%+14px)] -left-5 z-[var(--z-index-mega-menu)] w-[min(660px,92vw)] [&:not([hidden])]:grid grid-cols-2 gap-1.5 rounded-lg border border-border bg-paper p-3.5 shadow-[0_30px_70px_-24px_rgb(22_54_99/0.3)]";
const rowClass =
  "flex gap-3.5 rounded-[16px] p-3.5 transition-colors duration-[250ms] ease-[var(--ease-brand)] hover:bg-mist focus-visible:bg-mist";

function MegaFooterRow({
  footer,
  onNavigate,
}: Readonly<{
  footer: MegaFooter;
  onNavigate: () => void;
}>) {
  return (
    <div className="border-border text-muted col-span-full mt-1 flex items-center justify-between gap-4 border-t px-3.5 pt-3 pb-1 text-[0.88rem]">
      <p>{footer.text}</p>
      <Link
        href={footer.link}
        onClick={onNavigate}
        className="text-navy font-bold"
      >
        {footer.linkText}
      </Link>
    </div>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  // The menu is open only on the pathname it was opened on, so a navigation closes it.
  const [opened, setOpened] = useState<{
    menu: MenuId;
    path: string;
  } | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<MenuId, HTMLButtonElement | null>>({
    products: null,
    services: null,
  });

  if (opened && opened.path !== pathname) {
    setOpened(null);
  }
  const open: MenuId | null = opened ? opened.menu : null;
  const section = currentSection(pathname);
  const close = () => setOpened(null);
  const closeOnFocusOut = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (next && !event.currentTarget.contains(next as Node)) {
      setOpened(null);
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpened(null);
        if (navRef.current?.contains(document.activeElement)) {
          triggerRefs.current[open]?.focus();
        }
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpened(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const toggle = (menu: MenuId) =>
    setOpened(open === menu ? null : { menu, path: pathname });

  const trigger = (menu: MenuId, label: string) => (
    <button
      type="button"
      ref={(el) => {
        triggerRefs.current[menu] = el;
      }}
      className={itemClass}
      aria-expanded={open === menu}
      aria-controls={`mega-${menu}`}
      aria-current={section === menu ? "page" : undefined}
      onClick={() => toggle(menu)}
    >
      {label}
    </button>
  );

  const link = (key: Section, href: string, label: string) => (
    <Link
      href={href}
      className={itemClass}
      aria-current={section === key ? "page" : undefined}
    >
      {label}
    </Link>
  );

  return (
    <nav
      ref={navRef}
      aria-label={LABELS.mainNav}
      className="hidden items-center gap-0.5 min-[1081px]:flex"
    >
      <div className="relative" onBlur={closeOnFocusOut}>
        {trigger("products", LABELS.products)}
        <div
          id="mega-products"
          className={panelClass}
          hidden={open !== "products"}
        >
          {PRODUCTS.map((product) => (
            <Link
              key={product.anchor}
              href={`/products#${product.anchor}`}
              onClick={close}
              className={rowClass}
            >
              <span>
                <span className="font-display text-title-sm text-heading block font-semibold">
                  {product.name}
                </span>
                <span className="text-muted block text-[0.84rem] leading-[1.45] font-normal">
                  {product.valueLine}
                </span>
                <span className="font-brand text-label-sm text-navy mt-1.5 block font-medium tracking-[0.14em] uppercase">
                  {product.forLine}
                </span>
              </span>
            </Link>
          ))}
          <MegaFooterRow footer={PRODUCTS_FOOTER} onNavigate={close} />
        </div>
      </div>
      <div className="relative" onBlur={closeOnFocusOut}>
        {trigger("services", LABELS.services)}
        <div
          id="mega-services"
          className={panelClass}
          hidden={open !== "services"}
        >
          {SERVICES.map((service) => (
            <Link
              key={service.anchor}
              href={`/services#${service.anchor}`}
              onClick={close}
              className={`${rowClass} items-center py-3`}
            >
              <span className="font-display text-title-sm text-heading block font-semibold">
                {service.name}
              </span>
            </Link>
          ))}
          <MegaFooterRow footer={SERVICES_FOOTER} onNavigate={close} />
        </div>
      </div>
      {link("news", "/news", LABELS.news)}
      {link("about", "/about", LABELS.about)}
      {link("careers", "/careers", LABELS.careers)}
    </nav>
  );
}
