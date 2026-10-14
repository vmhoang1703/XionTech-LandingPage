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
    tagline: "Keeps parents close to every school day, on their phone.",
  },
  {
    id: "staff-hub",
    shortName: "Staff Hub",
    fullName: "Staff Hub",
    badge: { kind: "text", text: "S-Hub" },
    anchor: "sxp",
    tagline:
      "One workspace where staff, teachers and leaders share the same data.",
  },
  {
    id: "iot",
    shortName: "IoT",
    fullName: "IoT Device Management",
    badge: { kind: "icon", icon: "Cpu" },
    anchor: "iot",
    tagline:
      "Run classroom devices, lighting, climate and access from one screen.",
  },
  {
    id: "ai-tutor",
    shortName: "AI Tutor",
    fullName: "AI Tutor",
    badge: { kind: "icon", icon: "Sparkle" },
    anchor: "ai-tutor",
    tagline:
      "[Placeholder] Solve new problems on your own. Not just read solutions.",
  },
];

// Taglines by app, the English a translation is keyed to.
export const APP_TAGLINES = Object.fromEntries(
  APPS.map((app) => [app.id, app.tagline]),
) as Record<AppId, string>;

// Taglines in Vietnamese. App names and badges stay English (2026-10-13).
export const appTaglinesVi: Record<AppId, string> = {
  "parent-hub":
    "Giúp phụ huynh đồng hành cùng con mỗi ngày học, ngay trên điện thoại.",
  "staff-hub":
    "Một không gian làm việc để nhân viên, giáo viên và lãnh đạo dùng chung dữ liệu.",
  iot: "Điều khiển thiết bị lớp học, ánh sáng, điều hòa và ra vào từ một màn hình.",
  "ai-tutor": "[Placeholder] Tự giải bài mới. Không chỉ đọc lời giải.",
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
