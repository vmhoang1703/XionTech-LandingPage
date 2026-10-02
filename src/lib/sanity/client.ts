import "server-only";

import { createClient } from "@sanity/client";

import { getSanityConfig } from "./config";

const client = createClient({
  ...getSanityConfig(),
  useCdn: true,
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
