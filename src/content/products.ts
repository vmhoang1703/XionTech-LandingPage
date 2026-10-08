// Products page copy (E-A5), from the prototype products.html. Kept out of the
// components so it can be translated later. App names, badges and taglines
// come from apps.ts.
import { appById, type AppId } from "@/content/apps";

const [parentHub, staffHub, iot, aiTutor] = [
  appById("parent-hub"),
  appById("staff-hub"),
  appById("iot"),
  appById("ai-tutor"),
];

export const productsMeta = {
  title: `School Apps: ${parentHub.shortName}, ${staffHub.shortName}, ${iot.shortName} & ${aiTutor.shortName} | XionTech`,
  description: `${parentHub.shortName} for parents, ${staffHub.shortName} for staff, teachers and leaders, and ${iot.fullName} for campuses. Connected school apps from XionTech.`,
};

// CAP-1. Diagram cards in reading order: top row left to right, then the
// bottom row (prototype order).
export const productsHero = {
  titleLines: ["Built apart.", "Better", "together."],
  lede: "A connected suite for school communities — bringing parents, learning, staff operations and campus technology into one shared ecosystem.",
  diagramLabel: "The four apps share one platform",
  hub: "X",
  diagram: [
    { app: parentHub, eyebrow: "Parent experience", corner: "tl" },
    { app: aiTutor, eyebrow: "AI tutoring", corner: "tr" },
    { app: staffHub, eyebrow: "Staff experience", corner: "bl" },
    { app: iot, eyebrow: "Connected campus", corner: "br" },
  ],
  motion: { pause: "Pause motion", play: "Play motion" },
} as const;

// CAP-2.
export const productsShowcase = {
  heading: "What we build.",
  lede: "Four apps that connect parents, schools and students. Use the expand icon to see each app in detail.",
  openLabel: (name: string) => `Open ${name} details`,
  closeLabel: (name: string) => `Close ${name} details`,
  screenshot: (name: string, media: "phone" | "browser") =>
    `[Placeholder] ${name} ${media === "phone" ? "phone screenshot" : "screenshot"}`,
  madeFor: "Made for",
  featuresHeading: "Features",
  viewPrototype: "[Placeholder] View prototype",
  newTab: "(opens in a new tab)",
  stores: {
    appStore: { small: "[Placeholder] Download on the", name: "App Store" },
    googlePlay: { small: "[Placeholder] Get it on", name: "Google Play" },
  },
};

// Feature descriptions are not confirmed yet (ENH-089).
export const FEATURE_PLACEHOLDER =
  "[Placeholder] One or two lines on how this works for the people who use it.";

export type Audience = "parents" | "school" | "students";

export type FeatureId =
  | "gate"
  | "scores"
  | "messages"
  | "fees"
  | "attendance"
  | "classes"
  | "parents"
  | "dashboards"
  | "av"
  | "climate"
  | "doors"
  | "energy"
  | "diagnosis"
  | "hints"
  | "mastery";

export type ProductDetail = {
  audience: Audience;
  madeFor: string;
  media: "phone" | "browser";
  features: readonly { id: FeatureId; title: string }[];
};

// CAP-3. Feature titles and "Made for" lines are copied from products.html.
export const productDetails: Record<AppId, ProductDetail> = {
  "parent-hub": {
    audience: "parents",
    madeFor: "Parents and families",
    media: "phone",
    features: [
      { id: "gate", title: "Alerts when your child reaches the gate" },
      { id: "scores", title: "Scores and comments as soon as published" },
      { id: "messages", title: "Two-way messages with teachers" },
      { id: "fees", title: "Fee payments with clear receipts" },
    ],
  },
  "staff-hub": {
    audience: "school",
    madeFor: "Staff, teachers and school leaders",
    media: "browser",
    features: [
      { id: "attendance", title: "Attendance and records in real time" },
      { id: "classes", title: "Classes, timetables and grades" },
      {
        id: "parents",
        title: `Messages to parents through ${parentHub.shortName}`,
      },
      { id: "dashboards", title: "Leader dashboards for today's priorities" },
    ],
  },
  iot: {
    audience: "school",
    madeFor: "School operations and facilities teams",
    media: "browser",
    features: [
      { id: "av", title: "Projectors, displays and sound" },
      { id: "climate", title: "Lighting and climate on the timetable" },
      { id: "doors", title: "Doors and zones managed centrally" },
      { id: "energy", title: "Energy use across the campus" },
    ],
  },
  "ai-tutor": {
    audience: "students",
    madeFor: "Students, with teachers alongside",
    media: "browser",
    features: [
      { id: "diagnosis", title: "Skill-by-skill diagnosis" },
      { id: "hints", title: "Step-by-step hints once you have tried" },
      { id: "mastery", title: "Mastery only when you can do it alone" },
    ],
  },
};
