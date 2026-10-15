import type { RoadApp } from "@/content/products";

// Real screenshots of each product (public/products/<app>/). The 3D device
// shows them one after another in place of the wireframe, the first one first.
// Parent Hub is on a phone (portrait, about 9:19.5), Staff Hub on a laptop and
// AI Tutor on a desktop monitor (both wide). A product with no screenshots
// shows its wireframe.
export const SCREENSHOTS: Partial<Record<RoadApp, readonly string[]>> = {
  "parent-hub": [1, 2, 3, 4].map((n) => `/products/parent-hub/${n}.webp`),
  "staff-hub": [1, 2, 3, 4].map((n) => `/products/staff-hub/${n}.webp`),
  "ai-tutor": [1, 2, 3, 4].map((n) => `/products/ai-tutor/${n}.webp`),
};
