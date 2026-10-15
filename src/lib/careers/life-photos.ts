import { sanityFetch } from "@/lib/sanity/client";

export type LifePhoto = {
  url?: string | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  caption?: string | null;
};

export type LifePhotos = {
  team?: LifePhoto | null;
  office?: LifePhoto | null;
  event?: LifePhoto | null;
};

const SLOT_FIELDS = `{
    "url": photo.asset->url,
    "width": photo.asset->metadata.dimensions.width,
    "height": photo.asset->metadata.dimensions.height,
    alt,
    caption
  }`;

const LIFE_PHOTOS_QUERY = `*[_id == "careersPhotos"][0] {
  "team": team ${SLOT_FIELDS},
  "office": office ${SLOT_FIELDS},
  "event": event ${SLOT_FIELDS}
}`;

// A missing document or a failed read gives null, so the page keeps its
// [Placeholder] frames. The failure is logged once.
export async function getLifePhotos(): Promise<LifePhotos | null> {
  try {
    return await sanityFetch<LifePhotos | null>({
      query: LIFE_PHOTOS_QUERY,
      tags: ["careersPhotos"],
    });
  } catch (error) {
    console.error(
      "Careers photos: could not load the life photos from Sanity",
      error,
    );
    return null;
  }
}

// The "Life at XionTech" carousel (website copy v3) reads
// these slides. Drop the photos in public/careers/life/ (life-01.webp to
// life-06.webp, about 1600x1000) and list them here; with no slides the
// section stays off the page. `alt` describes the photo; `caption` is the
// short pill shown on it.
export type LifeSlide = { src: string; alt: string; caption: string };

export const LIFE_SLIDES: readonly LifeSlide[] = [];
