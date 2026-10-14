import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// E-A1: the prototype's calmer weights, heading rhythm and tighter sections.
const css = readFileSync(join(__dirname, "globals.css"), "utf8");

function token(name: string): string | undefined {
  return new RegExp(String.raw`--${name}:\s*([^;]+);`).exec(css)?.[1].trim();
}

describe("E-A1 type and spacing tokens", () => {
  it.each([
    "display-hero",
    "display-hero-mobile",
    "display-hero-fluid",
    "display-page",
  ])("sets page title %s to 300, line height 1.04, -0.04em", (name) => {
    expect(token(`text-${name}--font-weight`)).toBe("300");
    expect(token(`text-${name}--line-height`)).toBe("1.04");
    expect(token(`text-${name}--letter-spacing`)).toBe("-0.04em");
  });

  it.each(["headline", "headline-mobile", "headline-fluid"])(
    "sets section heading %s to 300, line height 1.06, -0.035em",
    (name) => {
      expect(token(`text-${name}--font-weight`)).toBe("300");
      expect(token(`text-${name}--line-height`)).toBe("1.06");
      expect(token(`text-${name}--letter-spacing`)).toBe("-0.035em");
    },
  );

  it.each(["title-lg", "title-md", "title-sm", "news-title"])(
    "sets card title %s to 400, line height 1.3, -0.02em",
    (name) => {
      expect(token(`text-${name}--font-weight`)).toBe("400");
      expect(token(`text-${name}--line-height`)).toBe("1.3");
      expect(token(`text-${name}--letter-spacing`)).toBe("-0.02em");
    },
  );

  it.each(["stat", "stat-fluid"])("sets stat %s to 400", (name) => {
    expect(token(`text-${name}--font-weight`)).toBe("400");
  });

  it.each(["button", "button-sm"])("sets %s to 500", (name) => {
    expect(token(`text-${name}--font-weight`)).toBe("500");
  });

  it("leaves no hard-coded 700 weight; 600 only for inline bold", () => {
    expect(css).not.toMatch(/font-weight:\s*(700|800|900|bold)/);
    const sixHundred = [...css.matchAll(/([^{}]+)\{[^{}]*font-weight:\s*600/g)]
      .map((match) => match[1].replace(/\s+/g, " ").trim())
      .filter((selector) => !selector.startsWith("--"));
    expect(sixHundred).toEqual(["b, strong"]);
  });

  it("uses 64px sections (48px on phones) and a 24px section-head gap", () => {
    expect(token("spacing-section")).toBe("64px");
    expect(token("spacing-section-mobile")).toBe("48px");
    expect(token("spacing-section-head-gap")).toBe("24px");
    expect(css).toMatch(/\.sec-head \{\s*display: grid;\s*gap: 20px;/);
  });
});

describe("E-A1 site icon", () => {
  it("ships the X-mark icon and apple icon instead of the scaffold favicon", () => {
    expect(existsSync(join(__dirname, "icon.png"))).toBe(true);
    expect(existsSync(join(__dirname, "apple-icon.png"))).toBe(true);
    expect(existsSync(join(__dirname, "favicon.ico"))).toBe(false);
  });
});

describe("CJK type rules", () => {
  it("set the CJK heading leading on the heading itself, so lang=en islands keep theirs", () => {
    expect(css).toContain(
      ":is(h1, h2, h3, h4):is(:lang(ja), :lang(ko), :lang(zh)) {\n  line-height: 1.35;",
    );
  });

  it("reset letter-spacing on CJK pseudo-elements too", () => {
    expect(css).toMatch(
      /:lang\(zh\)::after \{\n {2}letter-spacing: normal !important;/,
    );
  });
});
