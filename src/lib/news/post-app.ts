import { APPS, type App } from "@/content/apps";

// Sanity may still hold the old values. LXP is not shown any more, so it maps
// to no app.
const OLD_VALUES: ReadonlyMap<string, App["id"]> = new Map([
  ["PXP", "parent-hub"],
  ["SXP", "staff-hub"],
  ["IoT", "iot"],
]);

/** The app of a stored `post.app` value, or null when it has none. */
export function postApp(value?: string | null): App | null {
  if (!value) return null;
  const id = OLD_VALUES.get(value) ?? value;
  return APPS.find((app) => app.id === id) ?? null;
}
