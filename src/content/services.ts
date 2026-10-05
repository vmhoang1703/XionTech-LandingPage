import { hcmc, plano } from "@/content/offices";

// Services page copy. Kept out of the components so it can be translated later.

export const servicesMeta = {
  title: "Services | XionTech",
  description:
    "Dedicated teams and end-to-end software delivery from Ho Chi Minh City: product engineering, AI, low-code and cloud, across USA, Europe and Australia time zones.",
};

export const servicesPage = {
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Services",
  title: {
    lead: "Software teams that ",
    highlight: "get IT done",
    tail: ".",
  },
  lede: "Product engineering, AI, low-code and cloud delivery from Ho Chi Minh City, working across USA, Europe and Australia time zones.",
  primaryCta: {
    href: "/demo#project",
    label: "Start a project",
  },
  secondaryCta: {
    href: "#process",
    label: "See our 4-D process",
  },
  clockStripLabel: "Office local times",
  // Strip order: Ho Chi Minh City first.
  clockCities: [
    { office: hcmc, city: "Ho Chi Minh City" },
    { office: plano, city: "Plano" },
  ],
};
