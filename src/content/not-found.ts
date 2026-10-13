// Not found page links. The text comes from the shell dictionary (`src/i18n/shell.ts`);
// the three route buttons reuse the nav labels.

export const notFound = {
  primaryHref: "/",
  links: [
    { href: "/products", label: "products" },
    { href: "/services", label: "services" },
    { href: "/news", label: "news" },
  ],
} as const;
