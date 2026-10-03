// Footer copy and links. Kept out of the component so it can be translated later.
// "Product updates" (/products#updates) is hidden on Demo day (decision T5);
// Story 4.5 adds it back.

export type FooterLink = { href: string; label: string };
export type FooterColumn = { heading: string; links: FooterLink[] };

export const siteFooter = {
  logoAlt: "XionTechs",
  blurb:
    "Education technology products and software delivery services for schools and businesses.",
  columns: [
    {
      heading: "Products",
      links: [
        { href: "/products#pxp", label: "PXP" },
        { href: "/products#lxp", label: "LXP" },
        { href: "/products#sxp", label: "SXP" },
        { href: "/products#iot", label: "IoT Device Management" },
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
        { href: "/services", label: "All services" },
      ],
    },
    {
      heading: "Company",
      links: [
        { href: "/about", label: "About" },
        { href: "/about#values", label: "Core values" },
        { href: "/about#faq", label: "FAQ" },
        { href: "/news", label: "News" },
        { href: "/careers", label: "Careers" },
        { href: "/demo", label: "Contact" },
      ],
    },
  ] satisfies FooterColumn[],
  officesHeading: "Offices",
  copyright: "© 2026 XionTechs",
  privacy: { href: "/privacy", label: "Privacy policy" },
  tag: { lead: "GET IT", accent: "DONE" },
};
