import { pathToFileURL } from "node:url";

import { createClient } from "@sanity/client";

const API_VERSION = "2025-02-19";

export function summarize({ post, job, probeId, probeCount }) {
  const lines = [];
  let ok = true;

  for (const [kind, doc] of [
    ["post", post],
    ["job", job],
  ]) {
    if (doc) {
      lines.push(`${kind}: ${doc._id} ${doc.title ?? "(no English title)"}`);
    } else {
      ok = false;
      const hint = kind === "job" ? "a [Placeholder] job" : "a real post";
      lines.push(`FAIL: no ${kind} found — publish ${hint} in the Studio`);
    }
  }

  if (!probeId) {
    lines.push(
      "draft privacy: not proven — save an unpublished post in the Studio and run with SANITY_DRAFT_PROBE_ID=drafts.<id>",
    );
  } else if (probeCount === 0) {
    lines.push(
      `draft privacy: proven (draft ${probeId} not readable without a token)`,
    );
  } else {
    ok = false;
    lines.push(`FAIL: draft ${probeId} is readable without a token`);
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

  // Same settings as src/lib/sanity/client.ts: no CDN, published perspective, no token.
  const client = createClient({
    projectId,
    dataset,
    apiVersion: API_VERSION,
    useCdn: false,
    perspective: "published",
  });
  // The published perspective hides drafts, so the probe uses the raw perspective.
  // No token and no CDN: a private draft must not come back.
  const probeId = process.env.SANITY_DRAFT_PROBE_ID;
  const rawClient = client.withConfig({ perspective: "raw", useCdn: false });

  console.log(`project: ${projectId}, dataset: ${dataset}`);
  const [post, job, probe] = await Promise.all([
    client.fetch(`*[_type == "post"][0]{_id, "title": title.en}`),
    client.fetch(`*[_type == "job"][0]{_id, "title": title.en}`),
    probeId ? rawClient.fetch(`*[_id == $id]{_id}`, { id: probeId }) : null,
  ]);

  const { ok, lines } = summarize({
    post,
    job,
    probeId,
    probeCount: probe?.length,
  });
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
