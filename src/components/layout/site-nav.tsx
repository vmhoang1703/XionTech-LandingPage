"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  currentSection,
  LABELS,
  PRODUCTS,
  PRODUCTS_FOOTER,
  SERVICES,
  SERVICES_FOOTER,
  type MegaFooter,
} from "./nav-data";

type MenuId = "products" | "services";

const itemClass =
  "inline-flex h-10 items-center border-b-2 border-transparent px-3 text-ui text-text hover:text-navy aria-[current=page]:border-amber aria-[current=page]:font-bold aria-[current=page]:text-navy";

// Prototype values with no design token.
const panelClass =
  "absolute top-[calc(100%+14px)] -left-5 z-[var(--z-index-mega-menu)] w-[min(660px,92vw)] [&:not([hidden])]:grid grid-cols-2 gap-1.5 rounded-lg border border-border bg-paper p-3.5 shadow-[0_30px_70px_-24px_rgb(22_54_99/0.3)]";
const rowClass =
  "flex gap-3.5 rounded-[16px] p-3.5 hover:bg-mist focus-visible:bg-mist";

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

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpened(null);
        triggerRefs.current[open]?.focus();
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

  const link = (key: string, href: string, label: string) => (
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
      aria-label="Primary"
      className="hidden items-center gap-1 min-[1081px]:flex"
    >
      <div className="relative">
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
                <span className="text-title-sm text-heading block">
                  {product.name}
                </span>
                <span className="text-ui text-muted block">
                  {product.valueLine}
                </span>
                <span className="text-label-sm text-navy mt-1.5 block">
                  {product.forLine}
                </span>
              </span>
            </Link>
          ))}
          <MegaFooterRow footer={PRODUCTS_FOOTER} onNavigate={close} />
        </div>
      </div>
      <div className="relative">
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
              <span className="text-title-sm text-heading block">
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
