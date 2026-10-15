import { readdirSync } from "node:fs";
import path from "node:path";

// "Meet the team at XionTech" photos: every image file in
// public/careers/life/, any filename, sorted by filename. Amber only drops
// files in the folder. The careers page is statically generated, so in
// production the folder is read at build time (and again whenever a Sanity
// job update revalidates the page): rebuild and redeploy after adding
// photos. In `next dev` the page renders per request, so a refresh picks
// them up. The path is fixed; nothing here takes user input.
export const LIFE_PHOTO_DIR = path.join(
  process.cwd(),
  "public",
  "careers",
  "life",
);

const IMAGE_EXT = /\.(webp|jpe?g|png|avif)$/i;

export function listLifePhotos(dir: string = LIFE_PHOTO_DIR): string[] {
  let names: string[];
  try {
    names = readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && IMAGE_EXT.test(entry.name))
      .map((entry) => entry.name);
  } catch {
    return [];
  }
  return names
    .toSorted((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((name) => `/careers/life/${encodeURIComponent(name)}`);
}
