import { APPS, appById } from "@/content/apps";
import type { RoadStop } from "@/content/products";

// The brand's own name, for the first stop: no app is at work there yet.
export const BRAND = "XionTech";

// The words that stand up as towers in a stop's scene. An app's stop shows the
// app's name; the last stop, where every app keeps the day connected, shows
// all of them; the first stop shows the brand. Product names stay English in
// every language (2026-10-13).
export function sceneWords(stop: RoadStop, isLast: boolean): string[] {
  if (stop.app) return [appById(stop.app).shortName];
  return isLast ? APPS.map((app) => app.shortName) : [BRAND];
}
