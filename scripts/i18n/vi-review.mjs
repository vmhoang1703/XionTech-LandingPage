#!/usr/bin/env node
// Writes docs/translations/vi-review.md: every Vietnamese string of the site next to its
// English, with its source (Amber's prototype or AI), for a native reader to check.
//
// The list is generated from the dictionaries themselves, so it cannot go stale:
// vi-review.test.mjs fails when the committed file differs from a fresh run.
// A dictionary pair is a `fooVi` / `FOO_VI` export next to `foo` / `FOO` in the same module,
// plus the few pairs named in NAMED_PAIRS and OVERRIDES below.
//
// Usage: node scripts/i18n/vi-review.mjs   (or: npm run i18n:vi-review)
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = join(import.meta.dirname, "../..");
const PROTOTYPE_JSON = join(ROOT, "src/i18n/prototype-vi.json");
export const OUTPUT = join(ROOT, "docs/translations/vi-review.md");

/** Modules whose `*Vi` / `*_VI` exports are dictionaries, and the heading of the page each belongs to. */
export const PAGES = [
  ["src/i18n/shell.ts", "Site shell: header, footer, language menu, 404"],
  ["src/i18n/site-meta.ts", "Site title and description"],
  ["src/content/home.ts", "Home"],
  ["src/content/apps.ts", "Apps (Home and Products)"],
  ["src/content/values.ts", "Values (Home and About)"],
  ["src/content/process.ts", "Process (Home and Services)"],
  ["src/content/products.ts", "Products"],
  ["src/content/services.ts", "Services"],
  ["src/content/about.ts", "About"],
  ["src/content/offices.ts", "Offices (About, Contact, footer)"],
  ["src/content/careers.ts", "Careers"],
  ["src/content/job.ts", "Job page and application form"],
  ["src/content/news.ts", "News"],
  ["src/content/privacy.ts", "Privacy"],
  [
    "src/components/contact/contact-strings.ts",
    "Contact, demo form and capture band",
  ],
];

/** Dictionaries kept as one `{ en, vi }` object instead of two exports. */
const NAMED_PAIRS = [
  ["src/i18n/shell.ts", "SHELL"],
  ["src/i18n/site-meta.ts", "META"],
  ["src/content/job.ts", "ROLE_TYPE_LABELS"],
];

/** Pairs whose English side is not an export named like the Vietnamese one. */
const OVERRIDES = {
  // The English taglines sit in the APPS list.
  appTaglinesVi: (mod) =>
    Object.fromEntries(mod.APPS.map((app) => [app.id, app.tagline])),
  // A map from each English error message to its Vietnamese text; compared as two lists.
  ERRORS_VI: (mod) => [...mod.ERRORS_VI.keys()],
};
const OVERRIDE_VI = {
  ERRORS_VI: (mod) => [...mod.ERRORS_VI.values()],
};

const pageOf = (file) => PAGES.find(([path]) => path === file)[1];
const moduleName = (file) => file.replace(/^.*\//, "").replace(/\.ts$/, "");

function isObject(value) {
  return typeof value === "object" && value !== null;
}

function walk(en, vi, path, found) {
  if (typeof en === "string") {
    if (typeof vi !== "string") throw new Error(`${path}: vi is not a string`);
    if (vi !== en) found.push({ path, english: en, vi });
    return;
  }
  if (!isObject(en)) return;
  if (!isObject(vi)) throw new Error(`${path}: vi has no matching object`);
  if (en instanceof Map) {
    for (const [key, value] of en)
      walk(value, vi.get(key), `${path}[${key}]`, found);
  } else if (Array.isArray(en)) {
    if (!Array.isArray(vi) || vi.length !== en.length)
      throw new Error(`${path}: vi list differs in length`);
    en.forEach((value, i) => walk(value, vi[i], `${path}[${i}]`, found));
  } else {
    for (const key of Object.keys(en)) {
      if (!(key in vi)) throw new Error(`${path}.${key}: missing in vi`);
      walk(en[key], vi[key], `${path}.${key}`, found);
    }
  }
}

/** The `[english export, vi export]` names of a module, found by the Vi / _VI suffix. */
function pairNames(mod) {
  return Object.keys(mod).flatMap((name) => {
    const base = /_VI$/.test(name)
      ? name.slice(0, -3)
      : /Vi$/.test(name)
        ? name.slice(0, -2)
        : null;
    return base === null ? [] : [[base, name]];
  });
}

/**
 * Every Vietnamese string that differs from its English, in dictionary order:
 * `{ page, location, english, vi }`. `load(relativePath)` returns a loaded module.
 * Throws when a Vietnamese export has no English counterpart or another shape.
 */
export async function collectStrings(load) {
  const rows = [];
  for (const [file] of PAGES) {
    const mod = await load(file);
    const page = pageOf(file);
    const add = (location, en, vi) => {
      const found = [];
      walk(en, vi, location, found);
      for (const { path, english, vi: text } of found) {
        rows.push({
          page,
          location: `${moduleName(file)}:${path}`,
          english,
          vi: text,
        });
      }
    };
    for (const [base, name] of pairNames(mod)) {
      const en = OVERRIDES[name] ? OVERRIDES[name](mod) : mod[base];
      const vi = OVERRIDE_VI[name] ? OVERRIDE_VI[name](mod) : mod[name];
      if (en === undefined)
        throw new Error(`${file}: ${name} has no English ${base}`);
      add(name, en, vi);
    }
    for (const [namedFile, name] of NAMED_PAIRS) {
      if (namedFile !== file) continue;
      if (!mod[name]) throw new Error(`${file}: ${name} is not exported`);
      add(name, mod[name].en, mod[name].vi);
    }
  }
  return rows;
}

/** Text as compared with the prototype: one space, straight quotes, the brand without the final "s". */
export function normalise(text) {
  return text
    .normalize("NFC")
    .replaceAll(/[‘’]/g, "'")
    .replaceAll(/[“”]/g, '"')
    .replaceAll(/\s+/g, " ")
    .replaceAll("XionTechs", "XionTech")
    .trim();
}

/** Prototype pairs as a map from normalised English to the set of its normalised Vietnamese renderings. */
function prototypeIndex(pairs) {
  const index = new Map();
  for (const { english, vi } of pairs) {
    const key = normalise(english);
    if (!index.has(key)) index.set(key, new Set());
    index.get(key).add(normalise(vi));
  }
  return index;
}

/**
 * Adds `source` to each row: "prototype" when the English matches a prototype string and the
 * Vietnamese is the prototype's, otherwise "ai" (including a prototype string worded differently).
 */
export function withSources(rows, prototypePairs) {
  const index = prototypeIndex(prototypePairs);
  return rows.map((row) => ({
    ...row,
    source: index.get(normalise(row.english))?.has(normalise(row.vi))
      ? "prototype"
      : "ai",
  }));
}

const cell = (text) => text.replaceAll("|", "\\|").replaceAll(/\r?\n/g, "<br>");

/** One row per distinct English and Vietnamese pair on a page, with every place it is used. */
function mergeByPage(rows) {
  const pages = new Map();
  for (const row of rows) {
    if (!pages.has(row.page)) pages.set(row.page, new Map());
    const merged = pages.get(row.page);
    const key = `${row.source}\u0000${row.english}\u0000${row.vi}`;
    if (merged.has(key)) merged.get(key).locations.push(row.location);
    else merged.set(key, { ...row, locations: [row.location] });
  }
  return pages;
}

function countSources(rows) {
  const count = (source) => rows.filter((row) => row.source === source).length;
  return { ai: count("ai"), prototype: count("prototype") };
}

/** The review page as Markdown. */
export function renderReview(rows) {
  const pages = mergeByPage(rows);
  const total = countSources(
    [...pages.values()].flatMap((m) => [...m.values()]),
  );
  const lines = [
    "# Vietnamese review",
    "",
    "<!-- Generated by `npm run i18n:vi-review`. Do not edit by hand; edit the dictionaries and run it again. -->",
    "",
    "For a native Vietnamese reader. Every row is a Vietnamese string on the site that differs from its English.",
    "",
    "- **AI** rows were translated by an AI from the real English copy. Check these first: meaning, tone, spelling, and that nothing is added or left out.",
    "- **Prototype** rows are Amber's own Vietnamese from the clickable prototype (`data-vi`), kept where the English still matches. A quick read is enough.",
    '- Product and service names, and the tagline "Get IT done", stay English on purpose. `[Placeholder]` stays in front of a placeholder text.',
    "",
    "**Send corrections** as a list of `Where` and the corrected Vietnamese to Hoang Vu (team lead), or change the text in the file named by `Where` and open a pull request. `Where` is `file:export.path`; the file is in `src/content/`, `src/i18n/` or `src/components/contact/`. Regenerate this page afterwards with `npm run i18n:vi-review`.",
    "",
    `**Total:** ${total.ai + total.prototype} strings, ${total.ai} AI and ${total.prototype} prototype.`,
  ];
  for (const [page, merged] of pages) {
    const items = [...merged.values()].sort((a, b) =>
      a.source === b.source ? 0 : a.source === "ai" ? -1 : 1,
    );
    const sources = countSources(items);
    lines.push(
      "",
      `## ${page}`,
      "",
      `${sources.ai} AI, ${sources.prototype} prototype.`,
      "",
      "| Source | Where | English | Tiếng Việt |",
      "| --- | --- | --- | --- |",
      ...items.map(
        (item) =>
          `| ${item.source === "ai" ? "AI" : "Prototype"} | ${item.locations.map((l) => `\`${cell(l)}\``).join("<br>")} | ${cell(item.english)} | ${cell(item.vi)} |`,
      ),
    );
  }
  return `${lines.join("\n")}\n`;
}

/** The review page for the loaded dictionaries and the prototype pairs. */
export async function buildReview(load, prototypePairs) {
  return renderReview(withSources(await collectStrings(load), prototypePairs));
}

async function main() {
  // The dictionaries are TypeScript with "@/" imports, so Vite (already installed with Vitest) loads them.
  const { createServer } = await import("vite");
  const server = await createServer({
    configFile: false,
    appType: "custom",
    logLevel: "error",
    server: { middlewareMode: true },
    optimizeDeps: { noDiscovery: true },
    resolve: { tsconfigPaths: true },
  });
  try {
    const prototype = JSON.parse(readFileSync(PROTOTYPE_JSON, "utf8"));
    const review = await buildReview(
      (file) => server.ssrLoadModule(`/${file}`),
      prototype,
    );
    writeFileSync(OUTPUT, review);
    console.log("Written to docs/translations/vi-review.md");
  } finally {
    await server.close();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  await main();
}
