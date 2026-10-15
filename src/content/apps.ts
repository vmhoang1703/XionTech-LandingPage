// One source for the app names, used by Products, the header menu, Demo and News.
// Icons are Phosphor icon names (strings), so this file has no React import.

export type AppBadge =
  { kind: "text"; text: string } | { kind: "icon"; icon: "Cpu" | "Sparkle" };

export type App = {
  id: "parent-hub" | "staff-hub" | "iot" | "ai-tutor";
  shortName: string;
  fullName: string;
  badge: AppBadge;
  anchor: string;
  tagline: string;
};

export type AppId = App["id"];

export const APPS: readonly App[] = [
  {
    id: "parent-hub",
    shortName: "Parent Hub",
    fullName: "Parent Hub",
    badge: { kind: "text", text: "P-Hub" },
    anchor: "pxp",
    tagline:
      "Keep parents informed and connected to their child’s school life.",
  },
  {
    id: "staff-hub",
    shortName: "Staff Hub",
    fullName: "Staff Hub",
    badge: { kind: "text", text: "S-Hub" },
    anchor: "sxp",
    tagline: "Bring daily school operations into one connected workspace.",
  },
  {
    id: "iot",
    shortName: "IoT",
    fullName: "IoT Device Management",
    badge: { kind: "icon", icon: "Cpu" },
    anchor: "iot",
    tagline: "Simplify how schools manage connected campus technology.",
  },
  {
    id: "ai-tutor",
    shortName: "AI Tutor",
    fullName: "AI Tutor",
    badge: { kind: "icon", icon: "Sparkle" },
    anchor: "ai-tutor",
    tagline:
      "Help students understand mistakes and build confidence through guided learning.",
  },
];

// Taglines by app, the English a translation is keyed to.
export const APP_TAGLINES = Object.fromEntries(
  APPS.map((app) => [app.id, app.tagline]),
) as Record<AppId, string>;

// Taglines in Vietnamese. App names and badges stay English (2026-10-13).
export const appTaglinesVi: Record<AppId, string> = {
  "parent-hub":
    "Giúp phụ huynh luôn nắm bắt thông tin và gắn kết với đời sống học đường của con.",
  "staff-hub":
    "Đưa mọi hoạt động vận hành hằng ngày của nhà trường vào một không gian làm việc kết nối.",
  iot: "Đơn giản hóa cách nhà trường quản lý công nghệ trong khuôn viên kết nối.",
  "ai-tutor":
    "Giúp học sinh hiểu lỗi sai và tự tin hơn qua việc học có hướng dẫn.",
};

// The text a badge shows: its text, or the short name for an icon badge.
export function badgeLabel(app: App): string {
  return app.badge.kind === "text" ? app.badge.text : app.shortName;
}

export function appById(id: AppId): App {
  const app = APPS.find((a) => a.id === id);
  if (!app) throw new Error(`Unknown app id: ${id}`);
  return app;
}
