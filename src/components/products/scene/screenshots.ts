import type { RoadApp } from "@/content/products";

// A real screenshot of each product's screen. The 3D device shows it in place
// of the wireframe. To use one, save the image under public/ (for example
// public/screens/parent-hub.png) and add its path here:
//
//   "parent-hub": "/screens/parent-hub.png",
//
// Parent Hub is on a phone (portrait, about 9:19), Staff Hub on a laptop and
// AI Tutor on a desktop monitor (both about 16:10). No screenshot has been
// added yet, so every device shows its wireframe.
export const SCREENSHOTS: Partial<Record<RoadApp, string>> = {};
