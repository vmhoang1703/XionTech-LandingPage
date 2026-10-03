import { readFileSync } from "node:fs";
import { join } from "node:path";

// Test helper. Home sections were first built with class names that no
// stylesheet defined, and every class-name test still passed. This lists the
// classes a rendered tree uses that globals.css has no rule for, skipping
// Tailwind utilities (those with a variant prefix, or in `utilities`).
const GLOBALS_CSS = readFileSync(
  join(process.cwd(), "src/app/globals.css"),
  "utf8",
);

export function globalsCss() {
  return GLOBALS_CSS;
}

export function undefinedClasses(root: Element, utilities: RegExp) {
  const used = new Set(
    Array.from(root.querySelectorAll("[class]")).flatMap((el) =>
      Array.from(el.classList).filter((name) => !name.includes(":")),
    ),
  );
  return [...used].filter(
    (name) =>
      !utilities.test(name) &&
      !new RegExp(String.raw`\.${name}[\s,:{.]`).test(GLOBALS_CSS),
  );
}
