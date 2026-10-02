export type SanityConfig = {
  projectId: string;
  dataset: string;
  apiVersion: string;
};

const API_VERSION = "2025-02-19";

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and set it (see docs/sanity.md).`,
    );
  }
  return value;
}

// Literal `process.env.NAME` lookups so Next.js can inline them in the build.
export function getSanityConfig(): SanityConfig {
  return {
    projectId: required(
      "NEXT_PUBLIC_SANITY_PROJECT_ID",
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    ),
    dataset: required(
      "NEXT_PUBLIC_SANITY_DATASET",
      process.env.NEXT_PUBLIC_SANITY_DATASET,
    ),
    apiVersion: API_VERSION,
  };
}
