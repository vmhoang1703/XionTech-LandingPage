import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { english, isRegistered } from "./translations";

const SRC = join(import.meta.dirname, "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [path]
      : [];
  });
}

/** `local name -> [module, exported name]` for a file's named imports. */
function namedImports(text: string): Map<string, [string, string]> {
  const found = new Map<string, [string, string]>();
  for (const [, names, from] of text.matchAll(
    /import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*"([^"]+)"/g,
  )) {
    for (const part of names.split(",")) {
      const [name, alias] = part
        .trim()
        .replace(/^type\s+/, "")
        .split(/\s+as\s+/);
      if (name) found.set(alias ?? name, [from, name]);
    }
  }
  return found;
}

/** The `en:` expression of each pickLocale / localeMetadata / forLocale / useLocalized call. */
function englishBindings(text: string) {
  const calls = text.matchAll(
    /\b(?<!function )(pickLocale|localeMetadata|forLocale|useLocalized)(?:<[^>(]*>)?\(([^]*?)\}\s*\)/g,
  );
  return [...calls].flatMap(([, fn, args]) => {
    const en = /\ben:\s*([^,}\n]+)/.exec(args)?.[1]?.trim();
    const key = /^\s*"(\w+)"/.exec(args)?.[1];
    return en ? [{ fn, en, key }] : [];
  });
}

const files = sourceFiles(SRC).filter(
  (file) => !file.includes(join("src", "i18n")),
);

describe("translation registry", () => {
  it("names every English value once", () => {
    const values = Object.values(english());
    expect(new Set(values).size).toBe(values.length);
  });

  it("knows every English value a page picks by locale", async () => {
    const problems: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      const imports = namedImports(text);
      for (const { fn, en, key } of englishBindings(text)) {
        const where = `${relative(SRC, file)}: ${fn}(en: ${en})`;
        const source = imports.get(en);
        if (!source) {
          problems.push(`${where} is not an imported named value`);
          continue;
        }
        const [from, name] = source;
        const resolved = from.startsWith("@/")
          ? `../${from.slice(2)}`
          : join(relative(import.meta.dirname, join(file, "..")), from);
        const mod = (await import(
          /* @vite-ignore */ resolved.replaceAll("\\", "/")
        )) as Record<string, unknown>;
        const value = mod[name];
        if (!isRegistered(value)) problems.push(`${where} is not registered`);
        if (key && english()[key as keyof ReturnType<typeof english>] !== value)
          problems.push(`${where} is not the value of key "${key}"`);
      }
    }
    expect(problems).toEqual([]);
  });
});
