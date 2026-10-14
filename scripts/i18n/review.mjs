#!/usr/bin/env node
// Writes docs/translations/<locale>-review.md for every non-English locale: each translated
// string of the site next to its English, for a native reader to check. Vietnamese keeps its
// own generator (vi-review.mjs: twin exports and prototype sources); the other locales are
// one dictionary each (src/i18n/dictionaries/<locale>.ts) keyed like english() in
// src/i18n/translations.ts, plus the shell and the site meta.
//
// review.test.mjs fails when a committed page differs from a fresh run;
// untranslated.test.mjs fails when a string equals its English and is not allowed.
//
// Usage: node scripts/i18n/review.mjs   (or: npm run i18n:review)
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { PAGES, buildReview, viPairs, walk } from "./vi-review.mjs";

const ROOT = join(import.meta.dirname, "../..");
const PROTOTYPE_JSON = join(ROOT, "src/i18n/prototype-vi.json");

export const REVIEW_LOCALES = ["vi", "ja", "fr", "ko", "zh"];

export const outputOf = (locale) =>
  join(ROOT, `docs/translations/${locale}-review.md`);

/** What each review page says to its reader. vi is rendered by vi-review.mjs. */
export const LOCALE_INFO = {
  ja: {
    name: "Japanese",
    column: "日本語",
    kept: "names of products, services and apps, tech tags (Web, Mobile, AI/ML, Power Platform, n8n …), XionTech and the tagline “Get IT done”. The CV upload label stays “CV”.",
  },
  fr: {
    name: "French",
    column: "Français",
    kept: "names of products, services and apps, tech tags, XionTech and the tagline “Get IT done”. Words French spells like English stay as they are: Service, Services, Menu, Contact, Parents, Campus, CV.",
  },
  ko: {
    name: "Korean",
    column: "한국어",
    kept: "names of products, services and apps, tech tags (Web, Mobile, AI/ML, Power Platform, n8n …), XionTech and the tagline “Get IT done”.",
  },
  zh: {
    name: "Simplified Chinese",
    column: "简体中文",
    kept: "names of products, services and apps, tech tags (Web, Mobile, AI/ML, Power Platform, n8n …), XionTech and the tagline “Get IT done”.",
  },
};

const SHELL_PAGE = PAGES[0][1];
const META_PAGE = PAGES[1][1];

/**
 * Every dictionary of a locale next to its English: `{ page, name, en, tr }`.
 * vi comes from its twin exports; the others from the registry, the shell and the meta.
 */
export async function localePairs(load, locale) {
  if (locale === "vi") {
    return (await viPairs(load)).map(({ page, name, en, vi }) => ({
      page,
      name,
      en,
      tr: vi,
    }));
  }
  const { english } = await load("src/i18n/translations.ts");
  const { DICTIONARIES } = await load("src/i18n/dictionaries/index.ts");
  const { SHELL } = await load("src/i18n/shell.ts");
  const { META } = await load("src/i18n/site-meta.ts");
  const dictionary = DICTIONARIES[locale];
  if (!dictionary) throw new Error(`${locale}: no dictionary registered`);

  // The page of a registry key: the module that exports the same English value.
  const pageByValue = new Map();
  for (const [file, page] of PAGES) {
    for (const value of Object.values(await load(file)))
      if (!pageByValue.has(value)) pageByValue.set(value, page);
  }
  const pairs = Object.entries(english()).map(([name, en]) => ({
    page: pageByValue.get(en) ?? "Other",
    name,
    en,
    tr: dictionary[name],
  }));
  pairs.push(
    { page: SHELL_PAGE, name: "shell", en: SHELL.en, tr: SHELL[locale] },
    { page: META_PAGE, name: "meta", en: META.en, tr: META[locale] },
  );
  return pairs;
}

/**
 * Every string of a locale that differs from its English: `{ page, location, english, text }`.
 * With `{ same: true }`, the strings left equal to their English instead.
 * Throws when a dictionary lacks a key or has another shape.
 */
export async function collectLocaleStrings(
  load,
  locale,
  { same: wantSame = false } = {},
) {
  const rows = [];
  for (const { page, name, en, tr } of await localePairs(load, locale)) {
    const found = [];
    const same = [];
    walk(en, tr, name, found, same);
    for (const { path, english, vi: text } of wantSame ? same : found)
      rows.push({ page, location: `${locale}:${path}`, english, text });
  }
  return rows;
}

/** Strings that stay English in every locale (user decisions: names, tagline, tags, data). */
const GLOBAL_ALLOWED = [
  // Brand and tagline.
  "XionTech",
  "Get IT done",
  "Get IT Done",
  "GET IT DONE",
  "XionTech, Get IT Done",
  "[Placeholder] Get IT Done",
  "newXion",
  // Place names.
  "Plano",
  // App, product and service names and badges.
  "Parent Hub",
  "Staff Hub",
  "IoT",
  "IoT Device Management",
  "AI Tutor",
  "P-Hub",
  "S-Hub",
  "Product Engineering",
  "AI-Driven Analytics",
  "Product Co-Creation",
  "Staffing Service",
  "Custom App Development",
  "Low-code Solutions",
  "AI-Powered Solutions",
  "Cloud Computing",
  "Staffing",
  "Low-code",
  "Cloud",
  // Tech tags.
  "Web",
  "Mobile",
  "AI/ML",
  "Dashboards",
  "Power Platform",
  "Make",
  "n8n",
  "Retool",
  "Bubble",
  "Generative AI",
  "Azure",
  "AWS",
  "GCP",
  // Language names, each in its own language.
  "English",
  "Français",
  "Tiếng Việt",
  // Icon names and time zones (data).
  "Cpu",
  "Sparkle",
  "America/Chicago",
  "Asia/Ho_Chi_Minh",
  "GMT+7",
  // Addresses, emails and phone labels.
  "7950 Legacy Drive, Suite 400",
  "Plano, Texas 75024, USA",
  "Floor 15, B1 Building",
  "279 Nguyen Tri Phuong Street",
  "Dien Hong Ward, Ho Chi Minh City, Vietnam",
  "vinni.tran@newxion.com",
  "WhatsApp +1 469 439 9345",
  "name@school.edu.vn",
  "name@company.com",
];

/** Words a locale writes like the English (spec-vi-page-content decisions 2 and 4 for vi). */
const LOCALE_ALLOWED = {
  vi: ["Logistics", "Menu", "Email", "CV"],
  ja: ["CV"],
  fr: ["Service", "Services", "Menu", "Contact", "Parents", "Campus", "CV"],
  ko: [],
  zh: [],
};

/** Ids, links and numbers: no words to translate. */
const DATA = /^(?:[^A-Za-z]*|[a-z0-9-]+|(?:\/|#|https?:|mailto:|tel:).*)$/;

/**
 * Shared app records inside the Home dictionaries. Their fields (taglines included) stay the
 * English app objects on purpose: Home renders only the app name and icon from them, and the
 * shown taglines come from the translated `appTaglines` (vi: `appTaglinesVi`).
 */
const SHARED_APP =
  /^(?:home|[a-z]{2}):(?:homeApps(?:Vi)?\.apps\[\d+\]\.app|homeDoors(?:Vi)?\.products\.badges\[\d+\])\./;

/** The rows (strings equal to their English) that are not allowed, as `location: english`. */
export function untranslated(rows, locale) {
  const allowed = new Set([...GLOBAL_ALLOWED, ...LOCALE_ALLOWED[locale]]);
  return rows
    .filter(
      ({ english, location }) =>
        !allowed.has(english) &&
        !DATA.test(english) &&
        !SHARED_APP.test(location),
    )
    .map(({ location, english }) => `${location}: ${english}`);
}

const cell = (text) => text.replaceAll("|", "\\|").replaceAll(/\r?\n/g, "<br>");

/** One row per distinct English and translated pair on a page, with every place it is used. */
function mergeByPage(rows) {
  const pages = new Map();
  for (const row of rows) {
    if (!pages.has(row.page)) pages.set(row.page, new Map());
    const merged = pages.get(row.page);
    const key = `${row.english}\u0000${row.text}`;
    if (merged.has(key)) merged.get(key).locations.push(row.location);
    else merged.set(key, { ...row, locations: [row.location] });
  }
  return pages;
}

/** The review page of a non-Vietnamese locale as Markdown. Every row is AI-translated. */
export function renderLocaleReview(rows, locale) {
  const { name, column, kept } = LOCALE_INFO[locale];
  const pages = mergeByPage(rows);
  const total = [...pages.values()].reduce((n, m) => n + m.size, 0);
  const lines = [
    `# ${name} review`,
    "",
    "<!-- Generated by `npm run i18n:review`. Do not edit by hand; edit the dictionaries and run it again. -->",
    "",
    `For a native ${name} reader. Every row is a ${name} string on the site that differs from its English. All of them were translated by an AI from the real English copy.`,
    "",
    "- Check meaning, tone, spelling and natural wording, and that nothing is added, left out or made stronger than the English (no new claims, numbers or promises).",
    "- `[Placeholder]` stays in front of a placeholder text, and `{n}` is a number filled in by the site; keep both.",
    "- **Privacy** is legal text translated by an AI. It needs the lead's and a legal reviewer's sign-off before it is published.",
    "- News stories and job posts from the CMS are not translated; they show in English on purpose.",
    "",
    `**Kept in English on purpose:** ${kept}`,
    "",
    `**Send corrections** as a list of \`Where\` and the corrected text to Hoang Vu (team lead), or change the text in \`src/i18n/dictionaries/${locale}.ts\` and open a pull request. \`Where\` is \`${locale}:key.path\`; \`shell\` and \`meta\` are in \`src/i18n/shell.ts\` and \`src/i18n/site-meta.ts\`. Regenerate this page afterwards with \`npm run i18n:review\`.`,
    "",
    `**Total:** ${total} strings.`,
  ];
  for (const [page, merged] of pages) {
    lines.push(
      "",
      `## ${page}`,
      "",
      `${merged.size} strings.`,
      "",
      `| Where | English | ${column} |`,
      "| --- | --- | --- |",
      ...[...merged.values()].map(
        (item) =>
          `| ${item.locations.map((l) => `\`${cell(l)}\``).join("<br>")} | ${cell(item.english)} | ${cell(item.text)} |`,
      ),
    );
  }
  return `${lines.join("\n")}\n`;
}

/** The review page of one locale for the loaded dictionaries. */
export async function buildLocaleReview(load, locale, prototypePairs) {
  if (locale === "vi") return buildReview(load, prototypePairs);
  return renderLocaleReview(await collectLocaleStrings(load, locale), locale);
}

async function main() {
  // The dictionaries are TypeScript with "@/" imports, so Vite (already installed with Vitest) loads them.
  const { createServer } = await import("vite");
  const server = await createServer({
    configFile: false,
    appType: "custom",
    logLevel: "error",
    server: { middlewareMode: true, hmr: false, ws: false },
    optimizeDeps: { noDiscovery: true },
    resolve: {
      tsconfigPaths: true,
      // The registry modules are server-only; load its no-op build.
      alias: { "server-only": "next/dist/compiled/server-only/empty.js" },
    },
  });
  try {
    const prototype = JSON.parse(readFileSync(PROTOTYPE_JSON, "utf8"));
    const load = (file) => server.ssrLoadModule(`/${file}`);
    for (const locale of REVIEW_LOCALES) {
      writeFileSync(
        outputOf(locale),
        await buildLocaleReview(load, locale, prototype),
      );
      console.log(`Written to docs/translations/${locale}-review.md`);
    }
  } finally {
    await server.close();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  await main();
}
