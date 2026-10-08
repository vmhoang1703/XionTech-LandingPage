// Home page copy. Kept out of the components so it can be translated later.

import type { Stat } from "@/components/sections/stats-band";
import { appById } from "@/content/apps";

// App names and badges come from apps.ts (E-A2), the one source for them.
const parentHub = appById("parent-hub");
const staffHub = appById("staff-hub");
const iot = appById("iot");
const aiTutor = appById("ai-tutor");

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
    badges: [parentHub, staffHub, iot],
    title: "Products for schools",
    line: "Connected apps for parents, students, teachers, leaders and school staff.",
    chips: [
      parentHub.shortName,
      staffHub.shortName,
      iot.shortName,
      aiTutor.shortName,
    ],
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
      { app: parentHub, caption: "Parents" },
      { app: staffHub, caption: "Staff" },
      { app: iot, caption: "Facilities" },
    ],
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
    moreLabel: "+3 more industries: Healthcare, Logistics and Private Equity",
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

export const homeProcess = {
  title: "How we approach.",
  lede: "Our 4-D process (Discovery, Design, Development, Deployment) takes your idea to launch, and every step ends with something you can see and approve.",
  link: { href: "/services#process", label: "See how we work" },
};
