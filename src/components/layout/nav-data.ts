/**
 * Navigation data: labels, products, services, mega footers, and section detection.
 * Single source of truth for all navigation content (Story 1.2 translates from here).
 */

export interface Product {
  anchor: string;
  name: string;
  valueLine: string;
  forLine: string;
}

export interface Service {
  anchor: string;
  name: string;
}

export interface NavLabels {
  products: string;
  services: string;
  news: string;
  about: string;
  careers: string;
  bookDemo: string;
  skipLink: string;
  mainNav: string;
  homeLink: string;
  logoAlt: string;
}

export interface MegaFooter {
  text: string;
  link: string;
  linkText: string;
}

// Navigation labels (for translation in Story 1.2)
export const LABELS: NavLabels = {
  products: "Products",
  services: "Services",
  news: "News",
  about: "About",
  careers: "Careers",
  bookDemo: "Book a demo",
  skipLink: "Skip to content",
  mainNav: "Main",
  homeLink: "XionTechs home",
  logoAlt: "XionTechs, Get IT Done",
};

// Products (4 total, in order)
export const PRODUCTS: Product[] = [
  {
    anchor: "pxp",
    name: "PXP",
    valueLine:
      "Parent eXperience Place. The school day in every parent's pocket.",
    forLine: "Parents",
  },
  {
    anchor: "lxp",
    name: "LXP",
    valueLine:
      "Learner eXperience Place. Lessons, tasks and progress for students.",
    forLine: "Students",
  },
  {
    anchor: "sxp",
    name: "SXP",
    valueLine: "Staff eXperience Place. One workspace, role-based views.",
    forLine: "Staff, Teachers, Leaders",
  },
  {
    anchor: "iot",
    name: "IoT Device Management",
    valueLine: "Control campus devices from one screen.",
    forLine: "School staff and facilities",
  },
];

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

// Products mega footer
export const PRODUCTS_FOOTER: MegaFooter = {
  text: "More products are on the way.",
  link: "/products",
  linkText: "All products",
};

// Services mega footer
export const SERVICES_FOOTER: MegaFooter = {
  text: "Our 4-D process: Discovery, Design, Development, Deployment.",
  link: "/services#process",
  linkText: "See the process",
};

export type Section = "products" | "services" | "news" | "about" | "careers";

const SECTIONS: readonly Section[] = [
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
 * Root, /demo and unknown paths return null.
 */
export function currentSection(pathname: string): Section | null {
  return (
    SECTIONS.find(
      (section) =>
        pathname === `/${section}` || pathname.startsWith(`/${section}/`),
    ) ?? null
  );
}
