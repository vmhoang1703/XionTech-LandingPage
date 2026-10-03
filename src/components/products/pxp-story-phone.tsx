"use client";

import {
  type Icon,
  CalendarStarIcon,
  ChartLineUpIcon,
  ChatsCircleIcon,
  CheckCircleIcon,
  WalletIcon,
} from "@phosphor-icons/react";
import { useRef, useState, type KeyboardEvent } from "react";
import { pxpSection } from "@/content/products";

const { screens, tabsLabel, screenCaption } = pxpSection;

// Keyed by screen id, so a new screen without an icon is a type error.
const ICONS: Record<(typeof screens)[number]["id"], Icon> = {
  attendance: CheckCircleIcon,
  grades: ChartLineUpIcon,
  messages: ChatsCircleIcon,
  payments: WalletIcon,
  events: CalendarStarIcon,
};

const KEY_STEPS: Record<string, (index: number, last: number) => number> = {
  ArrowRight: (i, last) => (i === last ? 0 : i + 1),
  ArrowLeft: (i, last) => (i === 0 ? last : i - 1),
  Home: () => 0,
  End: (_i, last) => last,
};

// Client island: the PXP story phone and its pill tabs (ARIA tab pattern,
// roving tabindex). Inactive screens carry `hidden`, so they never take focus
// and screen readers skip them (AC-A11Y-3). Screens switch instantly; the
// 0.55s crossfade follows after demo.
export function PxpStoryPhone() {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = KEY_STEPS[event.key];
    const modified =
      event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
    if (!step || modified) return;
    event.preventDefault();
    const next = step(selected, screens.length - 1);
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div className="story-phone">
        <span className="notch" aria-hidden="true" />
        {screens.map((s, index) => (
          <div
            key={s.id}
            id={`pxp-panel-${s.id}`}
            role="tabpanel"
            aria-labelledby={`pxp-tab-${s.id}`}
            hidden={index !== selected}
            tabIndex={index === selected ? 0 : -1}
            className="story-screen home-media"
          >
            <span>{screenCaption(s.label)}</span>
          </div>
        ))}
      </div>
      <div
        className="ptabs"
        role="tablist"
        aria-label={tabsLabel}
        onKeyDown={onKeyDown}
      >
        {screens.map((s, index) => {
          const ScreenIcon = ICONS[s.id];
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`pxp-tab-${s.id}`}
              aria-selected={index === selected}
              aria-controls={`pxp-panel-${s.id}`}
              tabIndex={index === selected ? 0 : -1}
              onClick={() => setSelected(index)}
            >
              <ScreenIcon aria-hidden="true" />
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
