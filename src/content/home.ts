// Home page copy. Kept out of the components so it can be translated later.

import type { Stat } from "@/components/sections/stats-band";

export const homeHero = {
  title: {
    lead: "School apps and software teams that ",
    highlight: "get IT done",
    tail: ".",
  },
  sub: "XionTech is an education technology company and software partner. We build connected apps for schools (Parent Hub, Staff Hub and IoT) and deliver digital products for companies, from Ho Chi Minh City and Plano.",
  motion: { pause: "Pause motion", play: "Play motion" },
  // Goes to /demo until the contact section lands (E-A4 adds #contact).
  cta: { href: "/demo", label: "Get in touch" },
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
    badges: ["P-Hub", "S-Hub", "IoT"] as const,
    title: "Products for schools",
    line: "Connected apps for parents, students, teachers, leaders and school staff.",
    chips: ["Parent Hub", "Staff Hub", "IoT", "AI Tutor"],
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

export const homeCapabilities = {
  title: "Capabilities.",
  lede: "Why XionTech: the core capabilities behind every school app and every product we deliver.",
  products: {
    href: "/products",
    label: "School platforms",
    title: "Products for schools",
    line: "Connected apps for parents, students, teachers, leaders and school staff, designed as one ecosystem.",
    apps: [
      { badge: "P-Hub", caption: "Parents" },
      { badge: "S-Hub", caption: "Staff" },
      { badge: "IoT", caption: "Facilities" },
    ] as const,
    link: "Explore products",
  },
  delivery: {
    label: "Global delivery",
    title: "Two offices, one working day.",
    line: "Teams across time zones keep delivery moving with practical overlap.",
  },
  industries: {
    label: "Domain expertise",
    title: "Deep in education. Built to adapt.",
    line: "Education is where we go deepest, while the same engineering capability supports other industries too.",
    main: "Education",
    // Confirmed on the About page (src/content/about.ts), not placeholders.
    more: ["Healthcare", "Logistics", "Private Equity"] as const,
    moreLabel: "3 more industries: Healthcare, Logistics and Private Equity",
  },
  services: {
    href: "/services",
    label: "Software engineering",
    title: "Your software delivery team",
    line: "Dedicated teams and end-to-end delivery for companies building digital products.",
    link: "Explore services",
  },
  motto: {
    lead: "Get IT Done",
    title: "Built with ownership.",
    line: "Ownership of our commitments and pride in quality.",
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
      // Link name; its own string so it can be translated (prototype aria-label).
      label: "PXP, Parent eXperience Place",
      line: "Attendance, grades, messages and fees in every parent's pocket.",
      chips: ["Parents", "iOS and Android"],
    },
    {
      id: "sxp",
      name: "SXP",
      full: "Staff eXperience Place",
      label: "SXP, Staff eXperience Place",
      line: "One workspace with role-based views for staff, teachers and leaders.",
      chips: ["Staff", "Teachers", "Leaders"],
    },
    {
      id: "lxp",
      name: "LXP",
      full: "Learner eXperience Place",
      label: "LXP, Learner eXperience Place",
      line: "Lessons, assignments and progress in one calm space.",
      chips: ["Students"],
    },
    {
      id: "iot",
      name: "IoT",
      full: "Device management",
      label: "IoT, Device management",
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

export const homeProcess = {
  title: "How we approach.",
  lede: "Our 4-D process (Discovery, Design, Development, Deployment) takes your idea to launch, and every step ends with something you can see and approve.",
  link: { href: "/services#process", label: "See how we work" },
};
