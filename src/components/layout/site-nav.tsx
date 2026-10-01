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
  "absolute inset-x-0 top-full z-[var(--z-index-mega-menu)] border-b border-border bg-paper shadow-[0_30px_70px_-24px_rgb(22_54_99/0.3)]";
const rowClass = "block rounded-[16px] p-4 hover:bg-mist focus-visible:bg-mist";

function MegaFooterRow({
  footer,
  onNavigate,
}: Readonly<{
  footer: MegaFooter;
  onNavigate: () => void;
}>) {
  return (
    <div className="border-border text-ui text-muted mt-4 flex items-center justify-between gap-4 border-t pt-4">
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

  const open: MenuId | null =
    opened && opened.path === pathname ? opened.menu : null;
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
      {trigger("products", LABELS.products)}
      {trigger("services", LABELS.services)}
      {link("news", "/news", LABELS.news)}
      {link("about", "/about", LABELS.about)}
      {link("careers", "/careers", LABELS.careers)}

      <div
        id="mega-products"
        className={panelClass}
        hidden={open !== "products"}
      >
        <div className="wrap py-6">
          <ul className="grid grid-cols-4 gap-2">
            {PRODUCTS.map((product) => (
              <li key={product.anchor}>
                <Link
                  href={`/products#${product.anchor}`}
                  onClick={close}
                  className={rowClass}
                >
                  <span className="text-title-sm text-heading block">
                    {product.name}
                  </span>
                  <span className="text-ui text-muted mt-1 block">
                    {product.valueLine}
                  </span>
                  <span className="text-label-sm text-navy mt-2 block">
                    For <span>{product.forLine}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <MegaFooterRow footer={PRODUCTS_FOOTER} onNavigate={close} />
        </div>
      </div>

      <div
        id="mega-services"
        className={panelClass}
        hidden={open !== "services"}
      >
        <div className="wrap py-6">
          <ul className="grid grid-cols-4 gap-2">
            {SERVICES.map((service) => (
              <li key={service.anchor}>
                <Link
                  href={`/services#${service.anchor}`}
                  onClick={close}
                  className={rowClass}
                >
                  <span className="text-title-sm text-heading block">
                    {service.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <MegaFooterRow footer={SERVICES_FOOTER} onNavigate={close} />
        </div>
      </div>
    </nav>
  );
}
