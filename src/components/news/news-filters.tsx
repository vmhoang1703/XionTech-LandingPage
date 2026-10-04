"use client";

import { Fragment, useRef, useState, type ReactNode } from "react";
import { categoryLabels, newsPage } from "@/content/news";

export type FilterItem = {
  key: string;
  category: string | null | undefined;
  /** The server-rendered news card. */
  node: ReactNode;
};

const FILTERS = [
  newsPage.allFilter,
  ...Object.entries(categoryLabels).map(([id, label]) => ({ id, label })),
];

// The only client part of the News page (Story 6.1). The cards arrive already
// rendered on the server, so without JavaScript every story stays visible.
// A chip shows one category with no reload (CAP-2); the count is announced in
// a polite live region (CAP-3); an empty category offers "Show all" (CAP-4).
export function NewsFilters({ items }: Readonly<{ items: FilterItem[] }>) {
  const [active, setActive] = useState(newsPage.allFilter.id);
  const allRef = useRef<HTMLButtonElement>(null);
  const shown =
    active === newsPage.allFilter.id
      ? items
      : items.filter((item) => item.category === active);

  function showAll() {
    setActive(newsPage.allFilter.id);
    // The Show all button goes away, so keep focus in the filter group.
    allRef.current?.focus();
  }

  return (
    <>
      <div className="filters" role="group" aria-label={newsPage.filtersLabel}>
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
      {shown.length > 0 ? (
        <div className="news-grid">
          {shown.map((item) => (
            <Fragment key={item.key}>{item.node}</Fragment>
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
