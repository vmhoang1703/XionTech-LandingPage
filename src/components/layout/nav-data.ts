/**
 * Navigation data: labels, services, header links and section detection.
 * Single source of truth for all navigation content (Story 1.2 translates from here).
 */

export interface Service {
  anchor: string;
  name: string;
}

export interface NavLabels {
  home: string;
  products: string;
  services: string;
  news: string;
  about: string;
  careers: string;
  skipLink: string;
  mainNav: string;
  homeLink: string;
  logoAlt: string;
  menu: string;
}

// Navigation labels (for translation in Story 1.2)
export const LABELS: NavLabels = {
  home: "Home",
  products: "Products",
  services: "Services",
  news: "News",
  about: "About",
  careers: "Careers",
  skipLink: "Skip to content",
  mainNav: "Main",
  homeLink: "XionTech home",
  logoAlt: "XionTech, Get IT Done",
  menu: "Menu",
};

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
  label: string;
}

// Top-level pages in header order; the desktop nav and the mobile menu list them as plain links.
export const NAV_LINKS: readonly NavLink[] = [
  { section: "home", href: "/", label: LABELS.home },
  { section: "products", href: "/products", label: LABELS.products },
  { section: "services", href: "/services", label: LABELS.services },
  { section: "news", href: "/news", label: LABELS.news },
  { section: "about", href: "/about", label: LABELS.about },
  { section: "careers", href: "/careers", label: LABELS.careers },
];

const SECTIONS: readonly Exclude<Section, "home">[] = [
  "news",
  "careers",
  "about",
  "products",
  "services",
];

/**
 * Determine the current section from a pathname.
 * A section matches its own path or a child path ("/news", "/news/x"),
 * not a path that only shares a prefix ("/newsletter"). Matching is case-sensitive.
 * Home is only exactly "/" (a prefix match would mark it on every page, the 404 included).
 * /demo and unknown paths return null.
 */
export function currentSection(pathname: string): Section | null {
  if (pathname === "/") {
    return "home";
  }
  return (
    SECTIONS.find(
      (section) =>
        pathname === `/${section}` || pathname.startsWith(`/${section}/`),
    ) ?? null
  );
}
