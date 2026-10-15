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
