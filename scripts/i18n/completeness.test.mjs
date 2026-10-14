import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { DATA_KEYS, REVIEW_LOCALES, localePairs } from "./review.mjs";

// Every locale has the English shape: the same keys, list lengths and ids,
// data (ids, links, icons) equal to English, the {n} slot where English has one,
// and [Placeholder] exactly where English has it.
const ROOT = join(import.meta.dirname, "../..");
const load = (file) =>
  import(/* @vite-ignore */ pathToFileURL(join(ROOT, file)).href);
const PLACEHOLDER = "[Placeholder]";
const LINK = /^(?:\/|#|https?:|mailto:|tel:)/;
// countOne may carry {n}: plural rules pick it for 0 too in French.
const COUNT_ONE = /\.countOne$/;

/** The differences between an English value and its translation, as `path: problem`. */
export function shapeProblems(en, tr, path, problems = []) {
  if (typeof en === "string") {
    if (typeof tr !== "string") problems.push(`${path}: not a string`);
    else {
      if (en.includes(PLACEHOLDER) !== tr.includes(PLACEHOLDER))
        problems.push(`${path}: [Placeholder] differs`);
      if (!COUNT_ONE.test(path) && en.includes("{n}") !== tr.includes("{n}"))
        problems.push(`${path}: {n} differs`);
      const key = /\.(\w+)$/.exec(path)?.[1];
      if ((DATA_KEYS.has(key) || LINK.test(en)) && tr !== en)
        problems.push(`${path}: data differs`);
    }
  } else if (Array.isArray(en)) {
    if (!Array.isArray(tr)) problems.push(`${path}: not a list`);
    else if (tr.length !== en.length)
      problems.push(`${path}: list length differs`);
    else
      en.forEach((v, i) => shapeProblems(v, tr[i], `${path}[${i}]`, problems));
  } else if (typeof en === "object" && en !== null) {
    if (typeof tr !== "object" || tr === null || Array.isArray(tr)) {
      problems.push(`${path}: not an object`);
      return problems;
    }
    const keys = new Set([...Object.keys(en), ...Object.keys(tr)]);
    for (const key of keys) {
      if (!(key in tr)) problems.push(`${path}.${key}: missing`);
      else if (!(key in en)) problems.push(`${path}.${key}: extra`);
      else shapeProblems(en[key], tr[key], `${path}.${key}`, problems);
    }
  } else if (typeof en !== typeof tr) {
    problems.push(`${path}: type differs`);
  }
  return problems;
}

describe("shapeProblems", () => {
  it("reports missing and extra keys, kinds, list lengths, data and placeholders", () => {
    expect(
      shapeProblems(
        {
          a: "A",
          l: ["1"],
          f: { id: "x", href: "/a", to: "mailto:a@b.c" },
          p: "[Placeholder] P",
          c: "{n} x",
          n: 1,
        },
        {
          b: "B",
          l: [],
          f: { id: "y", href: "/b", to: "mailto:x@b.c" },
          p: "P",
          c: "x",
          n: "1",
        },
        "d",
      ),
    ).toEqual([
      "d.a: missing",
      "d.l: list length differs",
      "d.f.id: data differs",
      "d.f.href: data differs",
      "d.f.to: data differs",
      "d.p: [Placeholder] differs",
      "d.c: {n} differs",
      "d.n: type differs",
      "d.b: extra",
    ]);
    expect(shapeProblems({ a: {} }, { a: "s" }, "d")).toEqual([
      "d.a: not an object",
    ]);
    expect(shapeProblems({ a: {} }, { a: [] }, "d")).toEqual([
      "d.a: not an object",
    ]);
    expect(shapeProblems({ a: [] }, { a: {} }, "d")).toEqual([
      "d.a: not a list",
    ]);
    expect(shapeProblems("s", 1, "d")).toEqual(["d: not a string"]);
    expect(
      shapeProblems({ countOne: "One" }, { countOne: "{n} un" }, "d"),
    ).toEqual([]);
  });
});

describe.each(REVIEW_LOCALES)("the %s dictionaries", (locale) => {
  it("have every English key, list length, id and placeholder", async () => {
    const problems = (await localePairs(load, locale)).flatMap(
      ({ name, en, tr }) => shapeProblems(en, tr, name),
    );
    expect(problems).toEqual([]);
  }, 60_000);

  it("keep {n} in the news count, where English has it", async () => {
    const pairs = await localePairs(load, locale);
    const news = pairs.find(({ name }) => /^newsPage(Vi)?$/.test(name)).tr;
    expect(news.countMany).toContain("{n}");
  }, 60_000);
});
