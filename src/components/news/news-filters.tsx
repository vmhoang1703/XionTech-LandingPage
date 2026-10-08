"use client";

import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { categoryLabels, newsPage } from "@/content/news";
import type { Audience } from "@/lib/news/audience";

export type FilterItem = {
  key: string;
  /** The story's audience; null shows it only under All. */
  category: Audience | null;
  /** The server-rendered news card. */
  node: ReactNode;
};

const FILTERS = [
  newsPage.allFilter,
  ...Object.entries(categoryLabels).map(([id, label]) => ({ id, label })),
];

// The grid's columns at each width; the same breakpoints as `#newsGrid` in
// globals.css (3, then 2 at 900px, then 1 at 560px).
const ONE_COLUMN = "(max-width: 560px)";
const TWO_COLUMNS = "(max-width: 900px)";

function subscribe(onChange: () => void) {
  const lists = [matchMedia(ONE_COLUMN), matchMedia(TWO_COLUMNS)];
  for (const list of lists) list.addEventListener("change", onChange);
  return () => {
    for (const list of lists) list.removeEventListener("change", onChange);
  };
}

function columns() {
  if (matchMedia(ONE_COLUMN).matches) return 1;
  return matchMedia(TWO_COLUMNS).matches ? 2 : 3;
}

// The server (and so the no-JavaScript page) decides the lead for 3 columns.
const serverColumns = () => 3;

// The only client part of the News page (Story 6.1, E-A6). The cards arrive
// already rendered on the server, so without JavaScript every story stays
// visible. A chip shows one audience with no reload (CAP-2); the count is
// announced in a polite live region; an empty audience offers "Show all"
// (CAP-5). The first card shown is the full-width lead only when it is alone
// or a full row of squares follows it (prototype site.js `shape()`).
export function NewsFilters({ items }: Readonly<{ items: FilterItem[] }>) {
  const [active, setActive] = useState(newsPage.allFilter.id);
  const allRef = useRef<HTMLButtonElement>(null);
  const cols = useSyncExternalStore(subscribe, columns, serverColumns);
  const shown =
    active === newsPage.allFilter.id
      ? items
      : items.filter((item) => item.category === active);
  const hasLead = shown.length === 1 || shown.length - 1 >= cols;

  function showAll() {
    setActive(newsPage.allFilter.id);
    // The Show all button goes away, so keep focus in the filter group.
    allRef.current?.focus();
  }

  return (
    <>
      <div className="news-bar">
        <div
          className="filters"
          role="group"
          aria-label={newsPage.filtersLabel}
        >
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              ref={id === newsPage.allFilter.id ? allRef : undefined}
              type="button"
              aria-pressed={id === active}
              onClick={() => setActive(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="sample">{newsPage.sampleNote}</p>
      </div>
      {shown.length > 0 ? (
        <div className="sgrid" id="newsGrid">
          {shown.map((item, index) => (
            <div
              key={item.key}
              className={index === 0 && hasLead ? "s-lead" : undefined}
            >
              {item.node}
            </div>
          ))}
        </div>
      ) : (
        <div className="news-empty">
          <span>{newsPage.empty}</span>
          {active === newsPage.allFilter.id ? null : (
            <button
              className="btn btn-glass btn-sm"
              type="button"
              onClick={showAll}
            >
              {newsPage.showAll}
            </button>
          )}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {newsPage.count(shown.length)}
      </p>
    </>
  );
}
