#!/usr/bin/env node
// Extracts the (English, Vietnamese) text pairs of Amber's prototype into
// src/i18n/prototype-vi.json, the Vietnamese source for the page content.
//
// A pair comes from an element with data-vi or data-vi-html (its text), from
// aria-label next to data-vi-aria, and from placeholder next to data-vi-ph.
// Pairs whose text is built at run time (a "${...}" template) are skipped.
//
// Usage: node scripts/i18n/prototype-vi.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { JSDOM } from "jsdom";

const PROTOTYPE = join(
  import.meta.dirname,
  "../../_bmad-output/prototype-enhancement/prototype",
);
const OUTPUT = join(import.meta.dirname, "../../src/i18n/prototype-vi.json");

function squash(text) {
  return text.replaceAll(/\s+/g, " ").trim();
}

/** Visible text of a node: a line break reads as a space. */
function textOf(node) {
  const copy = node.cloneNode(true);
  if (copy.querySelectorAll) {
    for (const br of copy.querySelectorAll("br")) br.replaceWith(" ");
  }
  return squash(copy.textContent ?? "");
}

/** Pairs found in one HTML source (a page, or the templates inside site.js). */
export function extractPairs(source) {
  const { document } = new JSDOM(`<body>${source}</body>`).window;
  const pairs = [];
  for (const el of document.querySelectorAll(
    "[data-vi],[data-vi-html],[data-vi-aria],[data-vi-ph]",
  )) {
    const html = el.getAttribute("data-vi-html");
    const vi =
      el.getAttribute("data-vi") ??
      (html === null ? null : textOf(JSDOM.fragment(html)));
    if (vi !== null) pairs.push([textOf(el), squash(vi)]);
    pairs.push(
      [el.getAttribute("aria-label"), el.getAttribute("data-vi-aria")],
      [el.getAttribute("placeholder"), el.getAttribute("data-vi-ph")],
    );
  }
  return pairs
    .filter(([english, vi]) => english && vi)
    .map(([english, vi]) => [squash(english), squash(vi)])
    .filter(
      ([english, vi]) => english && vi && !`${english}${vi}`.includes("${"),
    );
}

/** Unique pairs of every prototype page and of js/site.js, with the file each came from. */
export function collectPairs(directory = PROTOTYPE) {
  const files = [
    ...readdirSync(directory)
      .filter((name) => name.endsWith(".html"))
      .sort(),
    "js/site.js",
  ];
  const seen = new Set();
  const result = [];
  for (const file of files) {
    for (const [english, vi] of extractPairs(
      readFileSync(join(directory, file), "utf8"),
    )) {
      const key = `${english}\u0000${vi}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({ english, vi, source: file });
    }
  }
  return result;
}

function main() {
  const pairs = collectPairs();
  writeFileSync(OUTPUT, `${JSON.stringify(pairs, null, 2)}\n`);
  console.log(`${pairs.length} pairs written to src/i18n/prototype-vi.json`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
