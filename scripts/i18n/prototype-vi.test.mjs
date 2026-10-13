import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { collectPairs, extractPairs } from "./prototype-vi.mjs";

describe("extractPairs", () => {
  it("pairs the text of an element with its data-vi", () => {
    expect(
      extractPairs('<h1 data-vi="Trang chủ"> Home <b>page</b> </h1>'),
    ).toEqual([["Home page", "Trang chủ"]]);
  });

  it("reads a line break as a space", () => {
    expect(extractPairs('<h1 data-vi="Một. Hai.">One.<br>Two.</h1>')).toEqual([
      ["One. Two.", "Một. Hai."],
    ]);
  });

  it("strips the tags of data-vi-html", () => {
    expect(
      extractPairs('<p data-vi-html="Xin <b>chào</b><br>bạn">Hello you</p>'),
    ).toEqual([["Hello you", "Xin chào bạn"]]);
  });

  it("pairs aria-label and placeholder with their Vietnamese attributes", () => {
    expect(
      extractPairs(
        '<a aria-label="Open" data-vi-aria="Mở">x</a><input placeholder="Name" data-vi-ph="Tên">',
      ),
    ).toEqual([
      ["Open", "Mở"],
      ["Name", "Tên"],
    ]);
  });

  it("skips elements with a Vietnamese text but no English text, and run-time templates", () => {
    expect(
      extractPairs('<i data-vi="Trống"></i><b data-vi="${vi}">${en}</b>'),
    ).toEqual([]);
  });
});

describe("committed prototype-vi.json", () => {
  const committed = JSON.parse(
    readFileSync(
      join(import.meta.dirname, "../../src/i18n/prototype-vi.json"),
      "utf8",
    ),
  );

  it("is what the script extracts from the prototype", () => {
    expect(committed).toEqual(collectPairs());
  });

  it("has only unique non-empty pairs with a source file", () => {
    const keys = committed.map((pair) => `${pair.english}\u0000${pair.vi}`);

    expect(new Set(keys).size).toBe(keys.length);
    expect(committed.length).toBeGreaterThan(400);
    for (const pair of committed) {
      expect(pair.english).not.toBe("");
      expect(pair.vi).not.toBe("");
      expect(pair.source).toMatch(/\.(html|js)$/);
    }
  });
});
