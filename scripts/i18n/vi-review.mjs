#!/usr/bin/env node
// Builds docs/translations/vi-review.md: every Vietnamese string of the site next to its
// English, with its source (Amber's prototype or AI), for a native reader to check.
// review.mjs writes it, with the other locales' pages.
//
// The list is generated from the dictionaries themselves, so it cannot go stale:
// vi-review.test.mjs fails when the committed file differs from a fresh run.
// A dictionary pair is a `fooVi` / `FOO_VI` export next to `foo` / `FOO` in the same module,
// plus the few pairs named in NAMED_PAIRS and OVERRIDES below.
//
// Usage: npm run i18n:review   (npm run i18n:vi-review is an alias)
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "../..");
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

/**
 * Compares a translation with its English, pushing each string path to `found` (differs) or
 * `same`. Throws, naming `locale`, when the translation lacks a key or has another shape.
 */
export function walk(en, tr, path, found, same, locale = "vi") {
  if (typeof en === "string") {
    if (typeof tr !== "string")
      throw new Error(`${path}: ${locale} is not a string`);
    if (tr !== en) found.push({ path, english: en, vi: tr });
    else same.push({ path, english: en, vi: tr });
    return;
  }
  if (!isObject(en)) return;
  if (!isObject(tr) || Array.isArray(tr) !== Array.isArray(en))
    throw new Error(`${path}: ${locale} has no matching object`);
  const next = (value, other, at) =>
    walk(value, other, at, found, same, locale);
  if (en instanceof Map) {
    for (const [key, value] of en) next(value, tr.get(key), `${path}[${key}]`);
  } else if (Array.isArray(en)) {
    if (tr.length !== en.length)
      throw new Error(`${path}: ${locale} list differs in length`);
    en.forEach((value, i) => next(value, tr[i], `${path}[${i}]`));
  } else {
    for (const key of Object.keys(en)) {
      if (!(key in tr)) throw new Error(`${path}.${key}: missing in ${locale}`);
      next(en[key], tr[key], `${path}.${key}`);
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
 * Every Vietnamese dictionary next to its English, in module order:
 * `{ file, page, name, en, vi }`. `load(relativePath)` returns a loaded module.
 * Throws when a Vietnamese export has no English counterpart.
 */
export async function viPairs(load) {
  const pairs = [];
  for (const [file] of PAGES) {
    const mod = await load(file);
    const page = pageOf(file);
    for (const [base, name] of pairNames(mod)) {
      const en = OVERRIDES[name] ? OVERRIDES[name](mod) : mod[base];
      const vi = OVERRIDE_VI[name] ? OVERRIDE_VI[name](mod) : mod[name];
      if (en === undefined)
        throw new Error(`${file}: ${name} has no English ${base}`);
      pairs.push({ file, page, name, en, vi });
    }
    for (const [namedFile, name] of NAMED_PAIRS) {
      if (namedFile !== file) continue;
      if (!mod[name]) throw new Error(`${file}: ${name} is not exported`);
      pairs.push({ file, page, name, en: mod[name].en, vi: mod[name].vi });
    }
  }
  return pairs;
}

/**
 * Every Vietnamese string that differs from its English, in dictionary order:
 * `{ page, location, english, vi }`. `load(relativePath)` returns a loaded module.
 * With `{ same: true }`, the strings left equal to their English instead.
 * Throws when a Vietnamese export has no English counterpart or another shape.
 */
export async function collectStrings(load, { same: wantSame = false } = {}) {
  const rows = [];
  for (const { file, page, name, en, vi } of await viPairs(load)) {
    const found = [];
    const same = [];
    walk(en, vi, name, found, same);
    for (const { path, english, vi: text } of wantSame ? same : found) {
      rows.push({
        page,
        location: `${moduleName(file)}:${path}`,
        english,
        vi: text,
      });
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
    "<!-- Generated by `npm run i18n:review`. Do not edit by hand; edit the dictionaries and run it again. -->",
    "",
    "For a native Vietnamese reader. Every row is a Vietnamese string on the site that differs from its English.",
    "",
    "- **AI** rows were translated by an AI from the real English copy. Check these first: meaning, tone, spelling, and that nothing is added or left out.",
    "- **Prototype** rows are Amber's own Vietnamese from the clickable prototype (`data-vi`), kept where the English still matches. A quick read is enough.",
    '- Product and service names, and the tagline "Get IT done", stay English on purpose. `[Placeholder]` stays in front of a placeholder text.',
    "- **Privacy** is legal text translated by an AI. It needs the lead's and a legal reviewer's sign-off before it is published.",
    "",
    "**Loanwords kept on purpose:** outsourcing, workshop, low-code, demo (as in “đặt lịch demo”). Write them in lower case inside a sentence.",
    "",
    "**Send corrections** as a list of `Where` and the corrected Vietnamese to Hoang Vu (team lead), or change the text in the file named by `Where` and open a pull request. `Where` is `file:export.path`; the file is in `src/content/`, `src/i18n/` or `src/components/contact/`. Regenerate this page afterwards with `npm run i18n:review`.",
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
