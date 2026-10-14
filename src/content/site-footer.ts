// Footer links and fixed copy. Headings and link labels come from the shell dictionary.
// "Product updates" (/products#updates) is hidden on Demo day (decision T5);
// Story 4.5 adds it back.

import type { ShellDictionary } from "@/i18n/shell";

type Text = (t: ShellDictionary) => string;
export type FooterLink = { href: string; label: Text };
export type FooterColumn = { heading: Text; links: FooterLink[] };

export const siteFooter = {
  logoAlt: "XionTech",
  columns: [
    {
      heading: (t) => t.footer.products,
      links: [
        { href: "/products#sxp", label: (t) => t.footer.forSchools },
        { href: "/products#ai-tutor", label: (t) => t.footer.forStudents },
        { href: "/products#pxp", label: (t) => t.footer.forParents },
      ],
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
  copyright: "© 2026 XionTech",
  privacy: {
    href: "/privacy",
    label: (t: ShellDictionary) => t.footer.privacy,
  },
  tag: { lead: "GET IT", accent: "DONE" },
};
