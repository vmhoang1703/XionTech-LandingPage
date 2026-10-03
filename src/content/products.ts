// Products page copy. Kept out of the components so it can be translated later.

export const productsHero = {
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Products",
  title: {
    lead: "Four apps. One ",
    highlight: "connected",
    tail: " school.",
  },
  lede: "PXP, LXP, SXP and IoT share one source of truth, so every role sees the same school day.",
  cta: { href: "/demo#form", label: "Book a demo" },
  // Real product screens arrive with Story 4.4 (after demo); until then the
  // device frames stay empty.
  devices: {
    tablet: "[Placeholder] Web app screenshot",
    phone: "[Placeholder] Phone screenshot",
  },
};

export const productsMeta = {
  title: "School Platforms: PXP Parent App, LXP, SXP & IoT | XionTech",
  description:
    "PXP for parents, LXP for students, SXP for staff, teachers and leaders, and IoT Device Management for campuses. Connected school apps from XionTech.",
};

export const productsSubnav = {
  label: "Products on this page",
  // The "Updates" pill to #updates is hidden on Demo day (decision T5);
  // Story 4.5 adds it back with the section.
  items: [
    { id: "pxp", label: "PXP" },
    { id: "lxp", label: "LXP" },
    { id: "sxp", label: "SXP" },
    { id: "iot", label: "IoT" },
  ],
};

// Anchor targets, one per sub-nav pill. Stories 4.2 and 4.3 replace each stub
// with the real section.
export const productsSections = productsSubnav.items.map(({ id, label }) => ({
  id,
  heading: label,
}));

// Story 4.2: the PXP section. The phone screens stay empty frames until real
// screens arrive with Story 4.4 (after demo).
export const pxpSection = {
  badge: "PXP",
  heading: "The school day, in a parent's pocket.",
  lede: "Parent eXperience Place keeps parents close to every school day, on iOS and Android.",
  tabsLabel: "PXP screens",
  screens: [
    { id: "attendance", label: "Attendance" },
    { id: "grades", label: "Grades" },
    { id: "messages", label: "Messages" },
    { id: "payments", label: "Payments" },
    { id: "events", label: "Events" },
  ],
  screenCaption: (label: string) => `[Placeholder] PXP ${label} screen`,
  features: [
    {
      id: "arrived",
      title: "Know they arrived",
      body: "Alerts when your child reaches the gate.",
    },
    {
      id: "progress",
      title: "See progress early",
      body: "Scores and comments as soon as published.",
    },
    {
      id: "teachers",
      title: "Talk to teachers",
      body: "Two-way messages with teachers.",
    },
    {
      id: "fees",
      title: "Pay fees in a tap",
      body: "Clear due dates and receipts.",
    },
  ],
  stores: {
    appStore: "[Placeholder] App Store",
    googlePlay: "[Placeholder] Google Play",
    newTab: " (opens in a new tab)",
  },
} as const;
