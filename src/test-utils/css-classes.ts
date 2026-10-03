import { readFileSync } from "node:fs";
import { join } from "node:path";

// Test helper. Home sections were first built with class names that no
// stylesheet defined, and every class-name test still passed. This lists the
// classes a rendered tree uses that globals.css has no rule for.
const GLOBALS_CSS = readFileSync(
  join(process.cwd(), "src/app/globals.css"),
  "utf8",
);

export function globalsCss() {
  return GLOBALS_CSS;
}

const escape = (text: string) =>
  text.replaceAll(/[.*+?^${}()|[\]\/]/g, String.raw`\$&`);

// True when `css` has a rule whose selector uses `.name` on its own, or
// compounded only with classes in `alongside` (the element's other classes:
// `.svc.feature` defines `feature` on an element that also has `svc`, but
// `.field.full` does not define `full` on a tile). Comments are ignored.
export function definesClass(
  css: string,
  name: string,
  alongside: readonly string[] = [],
) {
  const code = css.replaceAll(/\/\*[\s\S]*?\*\//g, "");
  const own = String.raw`(?<![\w\-\]])`;
  const end = String.raw`(?![\w-])`;
  const cls = String.raw`\.${escape(name)}`;
  if (new RegExp(String.raw`${own}(?<!\.[\w-]+)${cls}${end}`).test(code)) {
    return true;
  }
  return alongside.some((other) => {
    const o = String.raw`\.${escape(other)}`;
    return new RegExp(`${own}(${o}${cls}|${cls}${o})${end}`).test(code);
  });
}

// Classes used under `root` that globals.css does not define. `utilities`
// skips Tailwind utility classes that are generated, not written in the CSS.
export function undefinedClasses(root: Element, utilities?: RegExp) {
  const missing = new Set<string>();
  for (const el of Array.from(root.querySelectorAll("[class]"))) {
    const names = Array.from(el.classList).filter((n) => !n.includes(":"));
    for (const name of names) {
      if (utilities?.test(name)) continue;
      const others = names.filter((n) => n !== name);
      if (!definesClass(GLOBALS_CSS, name, others)) missing.add(name);
    }
  }
  return [...missing];
}
