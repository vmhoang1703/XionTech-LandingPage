import { pathToFileURL } from "node:url";

import { createClient } from "@sanity/client";

const API_VERSION = "2025-01-01";

export function summarize({ post, job, draftCount }) {
  const lines = [];
  let ok = true;

  for (const [kind, doc] of [
    ["post", post],
    ["job", job],
  ]) {
    if (doc) {
      lines.push(`${kind}: ${doc._id} ${doc.title}`);
    } else {
      ok = false;
      lines.push(
        `FAIL: no ${kind} found — publish a [Placeholder] ${kind} in the Studio`,
      );
    }
  }

  if (draftCount === 0) {
    lines.push("drafts readable without a token: 0");
  } else {
    ok = false;
    lines.push(
      `FAIL: draft documents are readable without a token (${draftCount})`,
    );
  }

  return { ok, lines };
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) {
    console.error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET (copy .env.example to .env.local)",
    );
    return 1;
  }

  // Same settings as src/lib/sanity/client.ts: CDN, published perspective, no token.
  const client = createClient({
    projectId,
    dataset,
    apiVersion: API_VERSION,
    useCdn: true,
    perspective: "published",
  });
  // The perspective hides drafts, so the draft read uses the raw perspective.
  // Still no token: a public dataset must return nothing.
  const rawClient = client.withConfig({ perspective: "raw", useCdn: false });

  console.log(`project: ${projectId}, dataset: ${dataset}`);
  const [post, job, drafts] = await Promise.all([
    client.fetch(`*[_type == "post"][0]{_id, "title": title.en}`),
    client.fetch(`*[_type == "job"][0]{_id, "title": title.en}`),
    rawClient.fetch(`*[_id in path("drafts.**")][0...1]{_id}`),
  ]);

  const { ok, lines } = summarize({ post, job, draftCount: drafts.length });
  for (const line of lines) {
    console.log(line);
  }
  return ok ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await main().catch((error) => {
    console.error(`sanity:check failed: ${error.message}`);
    return 1;
  });
}
