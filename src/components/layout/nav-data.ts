/**
 * Navigation data: services, header links and section detection.
 * Labels come from the shell dictionary (`src/i18n/shell.ts`).
 */

import { isLocale } from "@/i18n/locales";

export interface Service {
  anchor: string;
  name: string;
}

// Every call to action goes to the Home Get in touch form; the Demo page is
// kept but not linked (lead, 2026-10-13). Prefix it with localeHref.
export const CONTACT_HREF = "/#contact";

// Services (8 total, in order)
export const SERVICES: Service[] = [
  {
    anchor: "product-engineering",
    name: "Product Engineering",
  },
  {
    anchor: "ai-analytics",
    name: "AI-Driven Analytics",
  },
  {
    anchor: "co-creation",
    name: "Product Co-Creation",
  },
  {
    anchor: "staffing",
    name: "Staffing Service",
  },
  {
    anchor: "custom-apps",
    name: "Custom App Development",
  },
  {
    anchor: "low-code",
    name: "Low-code Solutions",
  },
  {
    anchor: "ai-solutions",
    name: "AI-Powered Solutions",
  },
  {
    anchor: "cloud",
    name: "Cloud Computing",
  },
];

export type Section =
  "home" | "products" | "services" | "news" | "about" | "careers";

export interface NavLink {
  section: Section;
  href: string;
}

// Top-level pages in header order; the desktop nav and the mobile menu list them as plain links.
export const NAV_LINKS: readonly NavLink[] = [
  { section: "home", href: "/" },
  { section: "products", href: "/products" },
  { section: "services", href: "/services" },
  { section: "news", href: "/news" },
  { section: "about", href: "/about" },
  { section: "careers", href: "/careers" },
];

const SECTIONS: readonly Exclude<Section, "home">[] = [
  "news",
  "careers",
  "about",
  "products",
  "services",
];

/**
 * Determine the current section from a pathname, with or without its locale prefix.
 * A section matches its own path or a child path ("/news", "/news/x"),
 * not a path that only shares a prefix ("/newsletter"). Matching is case-sensitive.
 * Home is only exactly "/" (a prefix match would mark it on every page, the 404 included).
 * /demo and unknown paths return null.
 */
export function currentSection(pathname: string): Section | null {
  const [, first, ...rest] = pathname.split("/");
  const path = isLocale(first) ? `/${rest.join("/")}` : pathname;
  if (path === "/") {
    return "home";
  }
  return (
    SECTIONS.find(
      (section) => path === `/${section}` || path.startsWith(`/${section}/`),
    ) ?? null
  );
}
