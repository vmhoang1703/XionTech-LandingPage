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

export const homeApps = {
  title: "Four apps. One school day.",
  lede: "Every role in the school gets its own app, all sharing one source of truth.",
  // Mini phone stays an empty media frame until Story 4.4 supplies media.
  phoneHint: "[Placeholder] PXP screen",
  tiles: [
    {
      id: "pxp",
      name: "PXP",
      full: "Parent eXperience Place",
      line: "Attendance, grades, messages and fees in every parent's pocket.",
      chips: ["Parents", "iOS and Android"],
    },
    {
      id: "sxp",
      name: "SXP",
      full: "Staff eXperience Place",
      line: "One workspace with role-based views for staff, teachers and leaders.",
      chips: ["Staff", "Teachers", "Leaders"],
    },
    {
      id: "lxp",
      name: "LXP",
      full: "Learner eXperience Place",
      line: "Lessons, assignments and progress in one calm space.",
      chips: ["Students"],
    },
    {
      id: "iot",
      name: "IoT",
      full: "Device management",
      line: "Devices, lighting and climate, campus-wide.",
      chips: [],
    },
  ],
} as const;

export const homeServices = {
  title: "Eight ways we get IT done for you.",
  lede: "The same team that builds PXP, LXP and SXP, working on your product.",
  cards: [
    {
      id: "product-engineering",
      name: "Product Engineering",
      line: "Turn ideas into market-ready digital products.",
    },
    {
      id: "ai-analytics",
      name: "AI-Driven Analytics",
      line: "Turn raw data into actionable intelligence.",
    },
    {
      id: "co-creation",
      name: "Product Co-Creation",
      line: "Your domain knowledge, our technical expertise.",
    },
    {
      id: "staffing",
      name: "Staffing Service",
      line: "Specialised technology talent, when you need it.",
    },
    {
      id: "custom-apps",
      name: "Custom App Development",
      line: "Solutions built around your requirements.",
    },
    {
      id: "low-code",
      name: "Low-code Solutions",
      line: "Power Platform, Make, n8n, Retool, Bubble.",
    },
    {
      id: "ai-solutions",
      name: "AI-Powered Solutions",
      line: "Put artificial intelligence to work in your operations.",
    },
    {
      id: "cloud",
      name: "Cloud Computing",
      line: "Azure, AWS and GCP expertise.",
    },
  ],
} as const;
