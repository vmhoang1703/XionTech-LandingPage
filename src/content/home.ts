// Home page copy. Kept out of the components so it can be translated later.

import type { Stat } from "@/components/sections/stats-band";

export const homeHero = {
  label: "EdTech products · Software services",
  title: {
    lead: "Every school community, ",
    highlight: "connected",
    tail: ".",
  },
  sub: "PXP for parents, LXP for learners, SXP for staff. And the engineering team behind them, ready to build yours.",
  motion: { pause: "Pause motion", play: "Play motion" },
  cta: { href: "/products", label: "Explore our products" },
  // Real product screens arrive with Story 4.4 (after demo); until then the
  // device frames stay empty.
  devices: {
    tablet: "[Placeholder] Web app screenshot",
    phone: "[Placeholder] Phone screenshot",
  },
};

// Figures confirmed by the business on 2026-09-28 (FR-12).
export const homeStats: { label: string; stats: Stat[] } = {
  label: "Experience you can count on",
  stats: [
    {
      value: "25",
      suffix: "+",
      caption: "Years of leadership experience in software",
    },
    { value: "24", suffix: "/7", caption: "Global coverage across time zones" },
    { value: "20", suffix: "+", caption: "Technology stacks we work in" },
    { value: "8", caption: "Service offerings, from idea to operation" },
    { value: "2", caption: "Offices: Ho Chi Minh City and Plano" },
  ],
};

export const homeDoors = {
  label: "What we do",
  products: {
    href: "/products",
    badges: ["PXP", "LXP", "SXP", "IoT"] as const,
    title: "Products for schools",
    line: "Connected apps for parents, students, teachers, leaders and school staff.",
    chips: ["PXP · Parents", "LXP · Students", "SXP · Staff", "IoT · Campus"],
  },
  services: {
    href: "/services",
    label: "Outsourcing services",
    title: "Your software delivery team",
    line: "Dedicated teams and end-to-end delivery for companies building digital products.",
    chips: [
      "Product Engineering",
      "AI-Driven Analytics",
      "Staffing",
      "Low-code",
      "Cloud",
      "+3 more",
    ],
  },
};
