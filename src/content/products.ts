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

// Story 4.2: the PXP section. The phone screens stay empty frames until real
// screens arrive with Story 4.4 (after demo).
export const pxpSection = {
  badge: "PXP",
  heading: "The school day, in a parent's pocket.",
  lede: "[Placeholder] Parent eXperience Place keeps parents close to every school day, on iOS and Android.",
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
      body: "[Placeholder] Alerts when your child reaches the gate.",
    },
    {
      id: "progress",
      title: "See progress early",
      body: "[Placeholder] Scores and comments as soon as published.",
    },
    {
      id: "teachers",
      title: "Talk to teachers",
      body: "[Placeholder] Two-way messages with teachers.",
    },
    {
      id: "fees",
      title: "Pay fees in a tap",
      body: "[Placeholder] Clear due dates and receipts.",
    },
  ],
  stores: {
    appStore: "[Placeholder] App Store",
    googlePlay: "[Placeholder] Google Play",
    newTab: " (opens in a new tab)",
  },
} as const;

// LXP, SXP and IoT sections (Story 4.3). Descriptions and feature lists were
// confirmed by the business on 2026-09-28; the web addresses are in
// product-links.ts. Real screens arrive with Story 4.4 (after demo); until
// then each browser frame stays empty.
export const productsLxp = {
  badge: "LXP",
  title: "A calm place to learn.",
  lede: "Learner eXperience Place brings a student's lessons, assignments and progress into one place.",
  audience: ["Students", "Web app"],
  features: [
    { id: "lessons", name: "Lessons", line: "Every material in one place." },
    { id: "assignments", name: "Assignments", line: "Clear due dates." },
    { id: "progress", name: "Progress", line: "Seen at a glance." },
    { id: "feedback", name: "Feedback", line: "Comments from teachers." },
  ],
  media: "[Placeholder] LXP screenshot",
} as const;

export const productsSxp = {
  badge: "SXP",
  title: "One workspace for the whole school.",
  lede: "Staff eXperience Place gives staff, teachers and leaders their own views of the same data.",
  audience: ["Staff", "Teachers", "Leaders"],
  features: [
    {
      id: "attendance",
      name: "Attendance and records",
      line: "Updated in real time.",
    },
    { id: "classes", name: "Classes", line: "Classes, timetables and grades." },
    {
      id: "communication",
      name: "Communication",
      line: "Reach parents through PXP.",
    },
    {
      id: "dashboards",
      name: "Leader dashboards",
      line: "What needs attention today.",
    },
  ],
  media: "[Placeholder] SXP screenshot",
} as const;

// The prototype's IoT section has no audience chips; the audience comes from
// the Products mega menu (School staff and facilities), as CAP-1 asks for one.
export const productsIot = {
  badgeLabel: "IoT",
  title: "A campus you run from one screen.",
  lede: "IoT Device Management lets school staff control classroom AV, lighting, climate and access across campus.",
  audience: ["School staff", "Facilities"],
  features: [
    { id: "av", name: "Classroom AV", line: "Projectors, displays and sound." },
    {
      id: "climate",
      name: "Lighting and climate",
      line: "Scheduled around the timetable.",
    },
    {
      id: "access",
      name: "Access",
      line: "Doors and zones, managed centrally.",
    },
    { id: "energy", name: "Energy", line: "See usage across the campus." },
  ],
  media: "[Placeholder] IoT screenshot",
} as const;
