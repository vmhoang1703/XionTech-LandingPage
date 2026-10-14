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

/**
 * The site's own localized GROQ, run per locale: each result needs a title and
 * the `*Lang` field of every localized field it read. `results` maps
 * `"<query> (<locale>)"` to the documents that query returned.
 */
export function checkLocalized(results) {
  const lines = [];
  let ok = true;
  for (const [name, { docs, langs }] of Object.entries(results)) {
    const problems = [];
    if (docs.length === 0) problems.push("no documents");
    for (const doc of docs) {
      if (!doc.title) problems.push(`${doc.slug ?? "?"} has no title`);
      for (const lang of langs) {
        if (!["en", "vi"].includes(doc[lang]))
          problems.push(`${doc.slug ?? "?"} has ${lang} = ${doc[lang]}`);
      }
    }
    if (problems.length > 0) {
      ok = false;
      lines.push(`FAIL: ${name}: ${problems.join("; ")}`);
    } else {
      const shown = docs
        .map((doc) => `${doc.title} [${langs.map((l) => doc[l]).join(",")}]`)
        .join(" | ");
      lines.push(`${name}: ${docs.length} ok — ${shown}`);
    }
  }
  return { ok, lines };
}

// Loads the query strings from the site's TypeScript modules (Vite, as vi-review does);
// "server-only" is a Next.js marker with nothing to run here.
async function loadQueries() {
  const { createServer } = await import("vite");
  const server = await createServer({
    configFile: false,
    appType: "custom",
    logLevel: "error",
    server: { middlewareMode: true, hmr: false, ws: false },
    optimizeDeps: { noDiscovery: true },
    resolve: { tsconfigPaths: true },
    plugins: [
      {
        name: "server-only-stub",
        resolveId: (id) =>
          id === "server-only" ? "virtual:server-only" : null,
        load: (id) => (id === "virtual:server-only" ? "export {};" : null),
      },
    ],
  });
  try {
    const news = await server.ssrLoadModule("/src/lib/news/all-posts.ts");
    const post = await server.ssrLoadModule("/src/lib/news/post.ts");
    const roles = await server.ssrLoadModule("/src/lib/careers/open-roles.ts");
    return {
      news: news.ALL_POSTS_QUERY,
      story: post.POST_QUERY,
      roles: roles.OPEN_ROLES_QUERY,
      role: roles.OPEN_ROLE_QUERY,
    };
  } finally {
    await server.close();
  }
}

async function runLocalized(client) {
  const queries = await loadQueries();
  const results = {};
  for (const locale of ["en", "vi"]) {
    const [news, roles] = await Promise.all([
      client.fetch(queries.news, { locale }),
      client.fetch(queries.roles, { locale }),
    ]);
    const [story, role] = await Promise.all([
      news[0]
        ? client.fetch(queries.story, { locale, slug: news[0].slug })
        : null,
      roles[0]
        ? client.fetch(queries.role, { locale, slug: roles[0].slug })
        : null,
    ]);
    const list = ["titleLang", "excerptLang"];
    results[`news list (${locale})`] = { docs: news, langs: list };
    results[`story (${locale})`] = {
      docs: story ? [{ ...story, slug: news[0].slug }] : [],
      langs: [...list, "bodyLang"],
    };
    results[`roles list (${locale})`] = {
      docs: roles,
      langs: ["titleLang", "teamLang", "locationLang"],
    };
    results[`role (${locale})`] = {
      docs: role ? [{ ...role, slug: roles[0].slug }] : [],
      langs: [
        "titleLang",
        "teamLang",
        "locationLang",
        "aboutLang",
        "responsibilitiesLang",
        "requirementsLang",
      ],
    };
  }
  return checkLocalized(results);
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
  const localized = await runLocalized(client);
  for (const line of localized.lines) {
    console.log(line);
  }
  return ok && localized.ok ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  process.exitCode = await main().catch((error) => {
    console.error(`sanity:check failed: ${error.message}`);
    return 1;
  });
}
