// Footer copy and links. Kept out of the component so it can be translated later.
// "Product updates" (/products#updates) is hidden on Demo day (decision T5);
// Story 4.5 adds it back.

export type FooterLink = { href: string; label: string };
export type FooterColumn = { heading: string; links: FooterLink[] };

export const siteFooter = {
  logoAlt: "XionTech",
  blurb:
    "Education technology products and software delivery services for schools and businesses.",
  columns: [
    {
      heading: "Products",
      links: [
        { href: "/products#sxp", label: "For schools" },
        { href: "/products#ai-tutor", label: "For students" },
        { href: "/products#pxp", label: "For parents" },
      ],
    },
    {
      heading: "Services",
      links: [
        {
          href: "/services#product-engineering",
          label: "Product Engineering",
        },
        { href: "/services#ai-analytics", label: "AI-Driven Analytics" },
        { href: "/services#staffing", label: "Staffing Service" },
        { href: "/services#low-code", label: "Low-code Solutions" },
        { href: "/services#cloud", label: "Cloud Computing" },
        { href: "/services#process", label: "How we work" },
        { href: "/services", label: "All services" },
      ],
    },
    {
      heading: "Company",
      links: [
        { href: "/news", label: "News" },
        { href: "/about", label: "About us" },
        { href: "/careers", label: "Careers" },
      ],
    },
  ] satisfies FooterColumn[],
  officesHeading: "Offices",
  copyright: "© 2026 XionTech",
  privacy: { href: "/privacy", label: "Privacy policy" },
  tag: { lead: "GET IT", accent: "DONE" },
};
