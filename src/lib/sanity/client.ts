import "server-only";

import { createClient } from "@sanity/client";

import { getSanityConfig } from "./config";

// No CDN: the webhook refreshes pages right after a publish, and the CDN can
// still answer with the old data then, which would be cached again. Next.js
// caches every result (force-cache plus tags), so Sanity sees few requests.
const client = createClient({
  ...getSanityConfig(),
  useCdn: false,
  perspective: "published",
});

export type SanityTag = "post" | "job";

type SanityFetchOptions = {
  query: string;
  params?: Record<string, unknown>;
  tags: SanityTag[];
};

export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: SanityFetchOptions): Promise<T> {
  try {
    return await client.fetch<T>(query, params, {
      cache: "force-cache",
      next: { tags },
    });
  } catch (error) {
    throw new Error(`Sanity fetch failed for tags [${tags.join(", ")}]`, {
      cause: error,
    });
  }
}
