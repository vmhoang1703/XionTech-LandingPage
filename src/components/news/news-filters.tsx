"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useLocale, useLocalized } from "@/components/layout/locale-link";
import {
  categoryLabels,
  categoryLabelsVi,
  newsPage as newsPageEn,
  newsPageVi,
  storyCount,
} from "@/content/news";
import { readMotionPaused } from "@/lib/motion/motion-preference";
import type { Audience } from "@/lib/news/audience";

export type FilterItem = {
  key: string;
  /** The story's audience; null shows it only under All. */
  category: Audience | null;
  /** The story has a cover photo (it can then lead the list). */
  photo?: boolean;
  /** The server-rendered news card. */
  node: ReactNode;
};

/**
 * The lead is the newest story with a cover photo (Amber, 2026-10-15): it moves
 * first, the rest keep their newest-first order. With no photo at all, the
 * newest story leads as before.
 */
export function photoLeadFirst<T extends { photo?: boolean }>(items: T[]): T[] {
  const lead = items.findIndex((item) => item.photo);
  if (lead <= 0) return items;
  return [items[lead], ...items.slice(0, lead), ...items.slice(lead + 1)];
}

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

// A card that arrives with others in its row waits this long per column, so a
// row unfolds left to right (Amber's prototype, site.js "press").
const UNFOLD_STAGGER_MS = 260;

// The server (and so the no-JavaScript page) decides the lead for 3 columns.
const serverColumns = () => 3;

// The only client part of the News page (Story 6.1, E-A6). The cards arrive
// already rendered on the server, so without JavaScript every story stays
// visible. A chip shows one audience with no reload (CAP-2); the count is
// announced in a polite live region; an empty audience offers "Show all"
// (CAP-5). The first card shown is the full-width lead only when it is alone
// or a full row of squares follows it (prototype site.js `shape()`).
export function NewsFilters({ items }: Readonly<{ items: FilterItem[] }>) {
  const locale = useLocale();
  const newsPage = useLocalized("newsPage", {
    en: newsPageEn,
    vi: newsPageVi,
  });
  const labels = useLocalized("categoryLabels", {
    en: categoryLabels,
    vi: categoryLabelsVi,
  });
  const filters = [
    newsPage.allFilter,
    ...Object.entries(labels).map(([id, label]) => ({ id, label })),
  ];
  const [active, setActive] = useState(newsPage.allFilter.id);
  const allRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cols = useSyncExternalStore(subscribe, columns, serverColumns);
  const shown = photoLeadFirst(
    active === newsPage.allFilter.id
      ? items
      : items.filter((item) => item.category === active),
  );
  const hasLead = shown.length === 1 || shown.length - 1 >= cols;

  // Each story card unfolds from the top as it comes into view, one after
  // another across its row; a filter change replays it (lead, 2026-10-13).
  // Only cards the script marks wait hidden; reduced motion or a saved Pause:
  // no unfold.
  useEffect(() => {
    const grid = gridRef.current;
    if (
      !grid ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      readMotionPaused()
    ) {
      return;
    }
    const cards = [...grid.children] as HTMLElement[];
    const lead = cards[0]?.classList.contains("s-lead") ? 1 : 0;
    for (const card of cards) card.removeAttribute("data-in");
    grid.setAttribute("data-unfold", "");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting) continue;
          const card = target as HTMLElement;
          observer.unobserve(card);
          const index = cards.indexOf(card);
          const column = index < lead ? 0 : (index - lead) % cols;
          card.style.setProperty(
            "--unfold-delay",
            `${column * UNFOLD_STAGGER_MS}ms`,
          );
          card.setAttribute("data-in", "");
        }
      },
      { threshold: 0.01 },
    );
    for (const card of cards) observer.observe(card);
    return () => observer.disconnect();
  }, [active, cols]);

  function showAll() {
    setActive(newsPage.allFilter.id);
    // The Show all button goes away, so keep focus in the filter group.
    allRef.current?.focus();
  }

  return (
    <>
      <div className="news-bar">
        <fieldset className="filters" aria-label={newsPage.filtersLabel}>
          {filters.map(({ id, label }) => (
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
        </fieldset>
      </div>
      {shown.length > 0 ? (
        <div ref={gridRef} className="sgrid" id="newsGrid">
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
        {storyCount(newsPage, shown.length, locale)}
      </p>
    </>
  );
}
