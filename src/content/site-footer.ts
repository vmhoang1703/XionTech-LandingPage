// Footer links and fixed copy. Headings and link labels come from the shell dictionary.
// "Product updates" (/products#updates) is hidden on Demo day (decision T5);
// Story 4.5 adds it back.

import { APPS } from "@/content/apps";
import type { ShellDictionary } from "@/i18n/shell";

type Text = (t: ShellDictionary) => string;
export type FooterLink = { href: string; label: Text };
export type FooterColumn = { heading: Text; links: FooterLink[] };

export const siteFooter = {
  logoAlt: "XionTech",
  columns: [
    {
      heading: (t) => t.footer.products,
      // The three apps on the Products journey, by their product names (the
      // same in every locale).
      links: APPS.map((app) => ({
        href: `/products#${app.anchor}`,
        label: () => app.fullName,
      })),
    },
    {
      heading: (t) => t.footer.services,
      links: [
        {
          href: "/services#product-engineering",
          label: (t) => t.names.productEngineering,
        },
        { href: "/services#ai-analytics", label: (t) => t.names.aiAnalytics },
        { href: "/services#staffing", label: (t) => t.names.staffing },
        { href: "/services#low-code", label: (t) => t.names.lowCode },
        { href: "/services#cloud", label: (t) => t.names.cloud },
        { href: "/services#process", label: (t) => t.footer.howWeWork },
        { href: "/services", label: (t) => t.footer.allServices },
      ],
    },
    {
      heading: (t) => t.footer.company,
      links: [
        { href: "/news", label: (t) => t.nav.news },
        { href: "/about", label: (t) => t.footer.aboutUs },
        { href: "/careers", label: (t) => t.nav.careers },
      ],
    },
  ] satisfies FooterColumn[],
  officesHeading: (t: ShellDictionary) => t.footer.offices,
  copyright: (t: ShellDictionary) => t.footer.copyright,
  privacy: {
    href: "/privacy",
    label: (t: ShellDictionary) => t.footer.privacy,
  },
  tag: { lead: "GET IT", accent: "DONE" },
};

/** XionTech's social pages (Amber, 2026-10-16): the footer icons and JSON-LD sameAs. */
export const SOCIAL_LINKS = [
  {
    id: "linkedin",
    href: "https://www.linkedin.com/company/xiontechs/about/",
    ariaLabel: { en: "XionTech on LinkedIn", vi: "XionTech trên LinkedIn" },
  },
  {
    id: "facebook",
    href: "https://www.facebook.com/xiontechs/",
    ariaLabel: { en: "XionTech on Facebook", vi: "XionTech trên Facebook" },
  },
] as const;
