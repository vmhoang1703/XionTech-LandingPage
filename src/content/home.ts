// Home page copy. Kept out of the components so it can be translated later.

import type { Stat } from "@/components/sections/stats-band";
import { aboutFaq } from "@/content/about";
import { appById } from "@/content/apps";
import { productDetails, productsHero } from "@/content/products";
import {
  servicesOutcomes,
  servicesPage,
  servicesSection,
} from "@/content/services";

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
  // The contact section on this page (E-A4).
  cta: { href: "#contact", label: "Get in touch" },
};

// Figures confirmed by the business on 2026-09-28 (FR-12). Only the two key
// figures count up (lead, 2026-10-11).
export const homeStats: { label: string; stats: Stat[] } = {
  label: "Experience you can count on",
  stats: [
    {
      value: "25",
      suffix: "+",
      caption: "Years of leadership experience in software",
      count: true,
    },
    { value: "24", suffix: "/7", caption: "Global coverage across time zones" },
    {
      value: "20",
      suffix: "+",
      caption: "Technology stacks we work in",
      count: true,
    },
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

// "Why XionTech." (was Capabilities): the products and services cards left,
// because the two doors above already say the same (lead, 2026-10-11).
export const homeCapabilities = {
  title: "Why XionTech.",
  lede: "The capabilities behind every school app and every product we deliver.",
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
  motto: {
    lead: "Get IT Done",
    title: "Built with ownership.",
    line: "Ownership of our commitments and pride in quality.",
  },
};

export const homeProcess = {
  title: "How we work.",
  lede: "Our 4-D process (Discovery, Design, Development, Deployment) takes your idea to launch, and every step ends with something you can see and approve.",
  link: { href: "/services#process", label: "See the full process" },
};

// "What can we help you achieve?": the four outcomes and the lede from the
// Services page; "Start a project" (the Services call to action) goes to the
// contact section on this page.
export const homeOutcomes = {
  title: servicesOutcomes.title,
  lede: servicesSection.lede,
  items: servicesOutcomes.items,
  cta: { href: "#contact", label: servicesPage.primaryCta.label },
  link: { href: "/services", label: "Explore services" },
};

// "One connected school.": each app with who it is for and its first two
// features, from the Products page. AI Tutor's tagline is still a
// placeholder, so the cards do not use taglines.
export const homeApps = {
  title: "One connected school.",
  lede: productsHero.lede,
  apps: [parentHub, staffHub, iot, aiTutor].map((app) => ({
    app,
    href: `/products#${app.anchor}`,
    madeFor: productDetails[app.id].madeFor,
    features: productDetails[app.id].features
      .slice(0, 2)
      .map((feature) => feature.title),
  })),
  link: { href: "/products", label: "Explore products" },
};

// "Your questions, answered.": four About answers, one for schools, two for
// companies and one on working together; the rest are on About.
const HOME_FAQ_IDS = new Set(["try-apps", "time-zones", "results", "feedback"]);

export const homeFaq = {
  title: "Your questions, answered.",
  lede: aboutFaq.lede,
  items: aboutFaq.items.filter((item) => HOME_FAQ_IDS.has(item.id)),
  link: { href: "/about#faq", label: "See all questions" },
};
