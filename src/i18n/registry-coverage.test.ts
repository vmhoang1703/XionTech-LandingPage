import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { english, isRegistered } from "./translations";

const SRC = join(import.meta.dirname, "..");
const PICKERS = new Set([
  "pickLocale",
  "localeMetadata",
  "forLocale",
  "useLocalized",
]);

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [path]
      : [];
  });
}

interface Binding {
  fn: string;
  line: number;
  en?: string;
  key?: string;
  error?: string;
}

function parse(text: string) {
  return ts.createSourceFile("x.tsx", text, ts.ScriptTarget.Latest, true);
}

/** `local name -> [module, exported name]` for a file's named imports. */
function namedImports(text: string): Map<string, [string, string]> {
  const found = new Map<string, [string, string]>();
  for (const statement of parse(text).statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const from = (statement.moduleSpecifier as ts.StringLiteral).text;
    const named = statement.importClause?.namedBindings;
    if (!named || !ts.isNamedImports(named)) continue;
    for (const element of named.elements) {
      found.set(element.name.text, [
        from,
        (element.propertyName ?? element.name).text,
      ]);
    }
  }
  return found;
}

function propertyName(name: ts.PropertyName): string | undefined {
  return ts.isIdentifier(name) || ts.isStringLiteral(name)
    ? name.text
    : undefined;
}

/** The English binding of one picker call, or why it cannot be resolved. */
function binding(call: ts.CallExpression, fn: string): Omit<Binding, "line"> {
  let key: string | undefined;
  if (fn === "useLocalized") {
    const first = call.arguments[0];
    if (!first || !ts.isStringLiteral(first)) {
      return { fn, error: "key is not a string literal" };
    }
    key = first.text;
  }
  const dictionary = call.arguments[fn === "localeMetadata" ? 0 : 1];
  if (!dictionary || !ts.isObjectLiteralExpression(dictionary)) {
    return { fn, key, error: "dictionary is not an object literal" };
  }
  const ens: string[] = [];
  for (const property of dictionary.properties) {
    if (ts.isSpreadAssignment(property)) {
      return { fn, key, error: "dictionary has a spread" };
    }
    if (ts.isShorthandPropertyAssignment(property)) {
      if (property.name.text === "en") ens.push("en");
      continue;
    }
    if (!ts.isPropertyAssignment(property)) {
      return { fn, key, error: "dictionary has a method or accessor" };
    }
    const name = propertyName(property.name);
    if (name === undefined) {
      return { fn, key, error: "dictionary has a computed key" };
    }
    if (name !== "en") continue;
    if (!ts.isIdentifier(property.initializer)) {
      return { fn, key, error: "en is not a plain identifier" };
    }
    ens.push(property.initializer.text);
  }
  if (ens.length !== 1) {
    return { fn, key, error: `${ens.length} en bindings` };
  }
  return { fn, key, en: ens[0] };
}

/** Every call of a picker in a source text, each with its English binding or an error. */
function pickerCalls(text: string): Binding[] {
  const source = parse(text);
  const found: Binding[] = [];
  const visit = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      PICKERS.has(node.expression.text)
    ) {
      found.push({
        ...binding(node, node.expression.text),
        line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

/** Every `picker(` or `picker<…>(` in the text that is not its declaration. */
function callCount(text: string): number {
  return [
    ...text.matchAll(
      /(?<!function\s+)\b(pickLocale|localeMetadata|forLocale|useLocalized)\b(?:<[^>(]*>)?\(/g,
    ),
  ].length;
}

// src/i18n defines the pickers and calls them with variables on purpose.
const files = sourceFiles(SRC).filter(
  (file) => !file.includes(join("src", "i18n")),
);

describe("pickerCalls", () => {
  it("resolves trailing commas, quoted keys and shorthand, and counts each call", () => {
    const text = `
      const a = pickLocale(locale, {
        en: homeHero,
        vi: homeHeroVi,
      },
      );
      const b = useLocalized("homeHero", { "en": homeHero, vi: x });
      const c = pickLocale<T>(locale, { en, vi });
    `;
    expect(
      pickerCalls(text).map(({ en, key, error }) => [en, key, error]),
    ).toEqual([
      ["homeHero", undefined, undefined],
      ["homeHero", "homeHero", undefined],
      ["en", undefined, undefined],
    ]);
    expect(callCount(text)).toBe(3);
  });

  it("fails what it cannot resolve instead of skipping it", () => {
    const errors = pickerCalls(`
      pickLocale(locale, { ...dict });
      pickLocale(locale, dict);
      pickLocale(locale, { en: a.b });
      pickLocale(locale, { vi: x });
      useLocalized(key, { en: a });
      localeMetadata({ [k]: a });
      pickLocale(locale, { en() { return a; } });
    `).map(({ error }) => error);
    expect(errors).toEqual([
      "dictionary has a spread",
      "dictionary is not an object literal",
      "en is not a plain identifier",
      "0 en bindings",
      "key is not a string literal",
      "dictionary has a computed key",
      "dictionary has a method or accessor",
    ]);
  });

  it("reads aliased imports", () => {
    expect(
      namedImports(
        `import { homeHero as hero, type X } from "@/content/home";`,
      ),
    ).toEqual(
      new Map([
        ["hero", ["@/content/home", "homeHero"]],
        ["X", ["@/content/home", "X"]],
      ]),
    );
  });
});

describe("translation registry", () => {
  it("names every English value once", () => {
    const values = Object.values(english());
    expect(new Set(values).size).toBe(values.length);
  });

  it("knows every English value a page picks by locale", async () => {
    const problems: string[] = [];
    let checked = 0;
    let occurrences = 0;
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      const imports = namedImports(text);
      const calls = pickerCalls(text);
      occurrences += callCount(text);
      if (calls.length !== callCount(text)) {
        problems.push(`${relative(SRC, file)}: a picker call was not parsed`);
      }
      for (const { fn, line, en, key, error } of calls) {
        const where = `${relative(SRC, file)}:${line} ${fn}`;
        const source = en ? imports.get(en) : undefined;
        if (error || !source) {
          problems.push(`${where}: ${error ?? `en "${en}" is not imported`}`);
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
        checked += 1;
        if (!isRegistered(value)) {
          problems.push(`${where}: ${en} is not registered`);
        }
        if (
          key &&
          english()[key as keyof ReturnType<typeof english>] !== value
        ) {
          problems.push(`${where}: ${en} is not the value of key "${key}"`);
        }
      }
    }
    expect(problems).toEqual([]);
    expect(checked).toBe(occurrences);
  });
});
