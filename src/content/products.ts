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

// The journey map: the XionTech hub and one place per app, in tab order.
// Names, taglines, badges and anchors come from apps.ts.
const place = (id: AppId) => {
  const { shortName, tagline, badge, anchor } = appById(id);
  return { id, name: shortName, tagline, badge, anchor };
};

export const journeyMap = {
  intro: {
    title: "Built apart. Better together.",
    lede: "A connected suite for school communities — bringing parents, learning, staff operations and campus technology into one shared ecosystem.",
  },
  hub: "XionTech",
  places: [
    place("parent-hub"),
    place("staff-hub"),
    place("ai-tutor"),
    place("iot"),
  ],
  openLabel: productsShowcase.openLabel,
  listHeading: "Our apps",
  motion: { pause: "Pause motion", play: "Play motion" },
} as const;

// The school-day roadmap: one student's day from arrival to the end of the
// day, as stations on a road. Times, titles and text are the prototype's
// "A day at school" copy (products.html); the IoT stop uses IoT's own
// feature title and tagline, and has no time because the prototype gives none.
export type RoadStop = {
  id: string;
  time?: string;
  title: string;
  text: string;
  app?: AppId;
};

export const dayRoad = {
  heading: "A day at school.",
  lede: "Follow one student journey through a typical school day and see how students, parents and school staff stay informed and connected across each step.",
  start: "Start",
  finish: "Finish",
  // Tour controls over the 3D road.
  tour: {
    begin: "Start the day",
    overview: "The whole day",
    explore: "Explore this step",
    previous: "Previous step",
    next: "Next step",
    controls: "Tour of the school day",
    step: (n: number, total: number) => `Step ${n} of ${total}`,
  },
  stops: [
    {
      id: "arrive",
      time: "07:45",
      title: "Student arrives",
      text: "The student arrives on campus.",
    },
    {
      id: "attendance",
      time: "08:00",
      title: "Attendance recorded",
      text: "A teacher marks the student's attendance in Staff Hub.",
      app: "staff-hub",
    },
    {
      id: "parent",
      time: "08:01",
      title: "Parent updated",
      text: "Parent Hub notifies parents that the student is at school.",
      app: "parent-hub",
    },
    {
      id: "learn",
      time: "09:30",
      title: "Student learns",
      text: "Students practise and ask questions with the AI Tutor.",
      app: "ai-tutor",
    },
    {
      id: "campus",
      title: productDetails.iot.features[1].title,
      text: iot.tagline,
      app: "iot",
    },
    {
      id: "connected",
      time: "15:30",
      title: "Day stays connected",
      text: "Notifications and school information stay connected across the system.",
    },
  ] satisfies RoadStop[],
} as const;

// The journey board: who acts at each stop of the day. Each lane is a person
// in the school and the app they use; the last stop belongs to everyone.
export type LaneId = "student" | "staff" | "parent" | "campus";

export const journeyBoard = {
  hint: "Select a step to see the app behind it.",
  timeLabel: "Time",
  everyone: "Everyone",
  details: "Details",
  lanes: [
    { id: "student", label: "Student", app: "ai-tutor" },
    { id: "staff", label: "Teacher and staff", app: "staff-hub" },
    { id: "parent", label: "Parent", app: "parent-hub" },
    { id: "campus", label: "Campus", app: "iot" },
  ] satisfies { id: LaneId; label: string; app: AppId }[],
  // Lane per stop id; "all" spans every lane.
  laneOf: {
    arrive: "student",
    attendance: "staff",
    parent: "parent",
    learn: "student",
    campus: "campus",
    connected: "all",
  } as Record<string, LaneId | "all">,
} as const;
