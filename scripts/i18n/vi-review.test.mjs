import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import {
  OUTPUT,
  PAGES,
  buildReview,
  collectStrings,
  normalise,
  renderReview,
  withSources,
} from "./vi-review.mjs";

const ROOT = join(import.meta.dirname, "../..");
const load = (file) =>
  import(/* @vite-ignore */ pathToFileURL(join(ROOT, file)).href);
// Loading every content module is slow on a busy machine or under coverage.
const SLOW = 60_000;
const prototype = JSON.parse(
  readFileSync(join(ROOT, "src/i18n/prototype-vi.json"), "utf8"),
);

const VIETNAMESE_LETTER =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
const cell = (text) => text.replaceAll("|", "\\|").replaceAll(/\r?\n/g, "<br>");

function leaves(value) {
  if (typeof value === "string") return [value];
  if (value instanceof Map) return [...value.values()].flatMap(leaves);
  if (value && typeof value === "object")
    return Object.values(value).flatMap(leaves);
  return [];
}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !/\.test\./.test(entry.name)
      ? [path]
      : [];
  });
}

describe("the generated Vietnamese review", () => {
  it(
    "is up to date with the dictionaries",
    async () => {
      const fresh = await buildReview(load, prototype);
      expect(readFileSync(OUTPUT, "utf8").replaceAll("\r\n", "\n")).toBe(fresh);
    },
    SLOW,
  );

  it(
    "lists every Vietnamese string of every dictionary",
    async () => {
      const review = readFileSync(OUTPUT, "utf8").replaceAll("\r\n", "\n");
      const missing = [];
      for (const [file] of PAGES) {
        const mod = await load(file);
        const vi = [
          ...Object.entries(mod)
            .filter(([name]) => /(Vi|_VI)$/.test(name))
            .map(([, value]) => value),
          ...["SHELL", "META", "ROLE_TYPE_LABELS"]
            .filter((name) => name in mod)
            .map((name) => mod[name].vi),
        ];
        for (const text of vi.flatMap(leaves)) {
          if (VIETNAMESE_LETTER.test(text) && !review.includes(cell(text)))
            missing.push(`${file}: ${text}`);
        }
      }
      expect(missing).toEqual([]);
    },
    SLOW,
  );

  it("covers every module that exports a Vietnamese dictionary", () => {
    const listed = new Set(PAGES.map(([file]) => file));
    const unlisted = sourceFiles(join(ROOT, "src"))
      .map((path) => path.slice(ROOT.length + 1).replaceAll("\\", "/"))
      .filter((file) => !listed.has(file))
      .filter((file) =>
        /export const \w+(Vi|_VI)\b/.test(
          readFileSync(join(ROOT, file), "utf8"),
        ),
      );
    expect(unlisted).toEqual([]);
  });
});

describe("collectStrings", () => {
  const empty = { en: {}, vi: {} };
  const modules = {
    "src/i18n/shell.ts": { SHELL: { en: { a: "A" }, vi: { a: "Á" } } },
    "src/i18n/site-meta.ts": { META: empty },
    "src/content/job.ts": { ROLE_TYPE_LABELS: empty },
    "src/content/home.ts": {
      homeHero: { title: "Hello", lines: ["One", "Same"], n: 3 },
      homeHeroVi: { title: "Xin chào", lines: ["Một", "Same"], n: 3 },
    },
  };
  const fakeLoad = async (file) => modules[file] ?? {};
  const withHome = (home) => async (file) =>
    file === "src/content/home.ts" ? home : fakeLoad(file);

  it("emits a row for each string that differs and none for a string left in English", async () => {
    expect(await collectStrings(fakeLoad)).toEqual([
      {
        page: expect.any(String),
        location: "shell:SHELL.a",
        english: "A",
        vi: "Á",
      },
      {
        page: "Home",
        location: "home:homeHeroVi.title",
        english: "Hello",
        vi: "Xin chào",
      },
      {
        page: "Home",
        location: "home:homeHeroVi.lines[0]",
        english: "One",
        vi: "Một",
      },
    ]);
  });

  it("fails loudly when a Vietnamese export has no English counterpart", async () => {
    await expect(
      collectStrings(withHome({ orphanVi: { a: "á" } })),
    ).rejects.toThrow("orphanVi has no English orphan");
  });

  it("fails loudly when a named dictionary is not exported", async () => {
    await expect(collectStrings(async () => ({}))).rejects.toThrow(
      "SHELL is not exported",
    );
  });

  it("fails when the Vietnamese lacks a key or has a list of another length", async () => {
    const broken = (vi) => withHome({ x: { a: "A", l: ["1"] }, xVi: vi });
    await expect(collectStrings(broken({ l: ["1"] }))).rejects.toThrow(
      "xVi.a: missing in vi",
    );
    await expect(collectStrings(broken({ a: "Á", l: [] }))).rejects.toThrow(
      "differs in length",
    );
    await expect(collectStrings(broken({ a: 1, l: ["1"] }))).rejects.toThrow(
      "not a string",
    );
  });
});

describe("withSources", () => {
  const pairs = [
    {
      english: "XionTechs builds   software",
      vi: "XionTech xây dựng phần mềm",
      source: "x.html",
    },
    { english: "Don’t wait", vi: "Đừng chờ", source: "x.html" },
  ];
  const row = (english, vi) => ({
    page: "Home",
    location: "home:a",
    english,
    vi,
  });

  it("tags a string as prototype when its English and Vietnamese both match, ignoring spacing, quotes and the brand spelling", () => {
    const [byBrand, byQuote] = withSources(
      [
        row("XionTech builds software", "XionTechs xây dựng phần mềm"),
        row("Don't wait", "Đừng chờ"),
      ],
      pairs,
    );
    expect(byBrand.source).toBe("prototype");
    expect(byQuote.source).toBe("prototype");
  });

  it("tags everything else as ai, also a prototype English reworded in Vietnamese", () => {
    const [unknown, reworded] = withSources(
      [row("Brand new text", "Văn bản mới"), row("Don't wait", "Chớ chờ")],
      pairs,
    );
    expect(unknown.source).toBe("ai");
    expect(reworded.source).toBe("ai");
  });

  it("normalise squashes spaces and straightens quotes", () => {
    expect(normalise(" “a”  ‘b’\n c ")).toBe("\"a\" 'b' c");
  });
});

describe("renderReview", () => {
  const rows = [
    {
      page: "Home",
      location: "home:a",
      english: "Plain",
      vi: "Thường",
      source: "prototype",
    },
    {
      page: "Home",
      location: "home:b",
      english: "Pipe | and\nline",
      vi: "Ống | dòng",
      source: "ai",
    },
    {
      page: "Home",
      location: "home:c",
      english: "Pipe | and\nline",
      vi: "Ống | dòng",
      source: "ai",
    },
    {
      page: "About",
      location: "about:d",
      english: "Other",
      vi: "Khác",
      source: "prototype",
    },
  ];
  const review = renderReview(rows);

  it("groups by page with AI rows first and counts the sources", () => {
    expect(review).toContain("**Total:** 3 strings, 1 AI and 2 prototype.");
    expect(review.indexOf("## Home")).toBeLessThan(review.indexOf("## About"));
    expect(review.indexOf("| AI |")).toBeLessThan(
      review.indexOf("| Prototype | `home:a`"),
    );
  });

  it("merges one pair used in several places and escapes table characters", () => {
    expect(review).toContain(
      "| AI | `home:b`<br>`home:c` | Pipe \\| and<br>line | Ống \\| dòng |",
    );
  });
});
