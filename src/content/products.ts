// Products page copy. Kept out of the components so it can be translated later.
// App names and badge text come from apps.ts.
import { appById, type AppId } from "@/content/apps";

function badgeText(id: AppId): string {
  const { badge } = appById(id);
  if (badge.kind !== "text") throw new Error(`App ${id} has no text badge`);
  return badge.text;
}

const parentHub = appById("parent-hub");
const staffHub = appById("staff-hub");
const iot = appById("iot");

export const productsHero = {
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Products",
  title: {
    lead: "Four apps. One ",
    highlight: "connected",
    tail: " school.",
  },
  lede: `${parentHub.shortName}, ${staffHub.shortName}, ${iot.shortName} and ${appById("ai-tutor").shortName} share one source of truth, so every role sees the same school day.`,
  cta: { href: "/demo#form", label: "Book a demo" },
  // Real product screens arrive with Story 4.4 (after demo); until then the
  // device frames stay empty.
  devices: {
    tablet: "[Placeholder] Web app screenshot",
    phone: "[Placeholder] Phone screenshot",
  },
};

export const productsMeta = {
  title: `School Platforms: ${parentHub.shortName}, ${staffHub.shortName} & ${iot.shortName} | XionTech`,
  description: `${parentHub.shortName} for parents, ${staffHub.shortName} for staff, teachers and leaders, and ${iot.fullName} for campuses. Connected school apps from XionTech.`,
};

export const productsSubnav = {
  label: "Products on this page",
  // The "Updates" pill to #updates is hidden on Demo day (decision T5);
  // Story 4.5 adds it back with the section.
  items: [
    { id: parentHub.anchor, label: parentHub.shortName },
    { id: staffHub.anchor, label: staffHub.shortName },
    { id: iot.anchor, label: iot.shortName },
  ],
};

// Story 4.2: the PXP section. Feature copy was confirmed by the business on
// 2026-09-28 (EXPERIENCE.md); the platforms are not confirmed yet.
// The phone screens stay empty frames until real
// screens arrive with Story 4.4 (after demo).
export const pxpSection = {
  badge: badgeText("parent-hub"),
  heading: "The school day, in a parent's pocket.",
  lede: `${parentHub.shortName} keeps parents close to every school day, on [Placeholder] iOS and Android.`,
  tabsLabel: `${parentHub.shortName} screens`,
  screens: [
    { id: "attendance", label: "Attendance" },
    { id: "grades", label: "Grades" },
    { id: "messages", label: "Messages" },
    { id: "payments", label: "Payments" },
    { id: "events", label: "Events" },
  ],
  screenCaption: (label: string) =>
    `[Placeholder] ${parentHub.shortName} ${label} screen`,
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

// Staff Hub and IoT sections (Story 4.3). Descriptions and feature lists were
// confirmed by the business on 2026-09-28; the web addresses are in
// product-links.ts. Real screens arrive with Story 4.4 (after demo); until
// then each browser frame stays empty.
export const productsSxp = {
  badge: badgeText("staff-hub"),
  title: "One workspace for the whole school.",
  lede: `${staffHub.shortName} gives staff, teachers and leaders their own views of the same data.`,
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
      line: `Reach parents through ${parentHub.shortName}.`,
    },
    {
      id: "dashboards",
      name: "Leader dashboards",
      line: "What needs attention today.",
    },
  ],
  media: `[Placeholder] ${staffHub.shortName} screenshot`,
} as const;

// The prototype's IoT section has no audience chips; the audience comes from
// the Products mega menu (School staff and facilities), as CAP-1 asks for one.
export const productsIot = {
  badgeLabel: iot.shortName,
  title: "A campus you run from one screen.",
  lede: `${iot.fullName} lets school staff control classroom AV, lighting, climate and access across campus.`,
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
