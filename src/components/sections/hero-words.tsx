import type { CSSProperties, ReactNode } from "react";

// A page title that opens word by word (lead, 2026-10-14: every page opens the
// same way). Each word is its own span with its place in the title in `--i`;
// globals.css ("Hero entrance") makes them rise in one after another, then the
// line and the button under the title. The words are in the HTML, so the
// entrance plays on first paint with no script, and the heading reads the same.
export function heroWords() {
  let index = 0;
  const place = () => ({ "--i": index++ }) as CSSProperties;
  return {
    /** Plain title text, one span a word; the spaces stay as text. */
    words(text: string): ReactNode[] {
      return text
        .split(/(\s+)/)
        .filter(Boolean)
        .map((part) =>
          /^\s+$/.test(part) ? (
            part
          ) : (
            <span key={`${index}-${part}`} data-hw="" style={place()}>
              {part}
            </span>
          ),
        );
    },
    /** Props for an element that rises in as one word (a highlight). */
    unit() {
      return { "data-hw": "", style: place() };
    },
  };
}
