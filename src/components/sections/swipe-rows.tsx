"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { readMotionPaused } from "@/lib/motion/motion-preference";

// The swipe rows on phones (globals.css, "Phones: shorter pages").
export const SWIPE_ROWS =
  ".flow, .app-cards, .flip-cards:not(.home-values .flip-cards), .sgrid-row";
export const SWIPE_DELAY = 3500;

// Dots under one row, the card in front and the auto swipe. Returns the
// cleanup.
function setUpRow(row: HTMLElement, cards: HTMLElement[], still: boolean) {
  const dots = document.createElement("div");
  dots.className = "swipe-dots";
  const buttons = cards.map((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute(
      "aria-label",
      `Show card ${index + 1} of ${cards.length}`,
    );
    dots.append(button);
    return button;
  });
  row.after(dots);
  row.dataset.swipe = still ? "still" : "move";

  const step = () => cards[1].offsetLeft - cards[0].offsetLeft;
  const atEnd = () => row.scrollLeft + row.clientWidth >= row.scrollWidth - 2;
  const current = () =>
    atEnd()
      ? cards.length - 1
      : Math.min(cards.length - 1, Math.round(row.scrollLeft / step()));
  const goTo = (index: number) =>
    row.scrollTo({
      left: index * step(),
      behavior: still ? "auto" : "smooth",
    });
  const show = (active: number) => {
    cards.forEach((card, index) =>
      card.toggleAttribute("data-active", index === active),
    );
    buttons.forEach((button, index) =>
      button.setAttribute("aria-current", String(index === active)),
    );
    dots.style.setProperty("--i", String(active));
  };
  show(0);

  let frame = 0;
  const onScroll = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => show(current()));
  };
  row.addEventListener("scroll", onScroll, { passive: true });

  let timer = 0;
  let handedOver = still;
  const stop = () => {
    clearInterval(timer);
    timer = 0;
  };
  const takeOver = () => {
    handedOver = true;
    stop();
  };
  const events = ["pointerdown", "wheel", "keydown"] as const;
  for (const name of events)
    row.addEventListener(name, takeOver, { passive: true });
  const onDot = (event: MouseEvent) => {
    const index = buttons.indexOf(event.target as HTMLButtonElement);
    if (index < 0) return;
    takeOver();
    goTo(index);
  };
  dots.addEventListener("click", onDot);

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || handedOver) stop();
      else if (!timer)
        timer = window.setInterval(
          () => goTo(atEnd() ? 0 : current() + 1),
          SWIPE_DELAY,
        );
    },
    { threshold: 0.6 },
  );
  observer.observe(row);

  return () => {
    observer.disconnect();
    stop();
    cancelAnimationFrame(frame);
    row.removeEventListener("scroll", onScroll);
    for (const name of events) row.removeEventListener(name, takeOver);
    dots.remove();
    delete row.dataset.swipe;
    for (const card of cards) card.removeAttribute("data-active");
  };
}

// Phones (lead, 2026-10-13): each swipe row gets dots under it; the amber dot
// slides to the card in front, which is full size while the others shrink a
// little, and a tap on a dot goes to its card. While a row is in view it moves
// on by one card every few seconds, back to the first after the last; the
// first touch, wheel, key or dot hands it to the visitor for good. Reduced
// motion or a saved Pause: dots only, no auto swipe and no animation. From
// 640px the cards sit in a grid and nothing runs. Runs again after each
// navigation.
export function SwipeRows() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia?.("(width < 640px)").matches) return;
    const still =
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      readMotionPaused();
    const cleanups = [...document.querySelectorAll<HTMLElement>(SWIPE_ROWS)]
      .map((row) => ({
        row,
        // The 4-D row also holds its track and nodes, 1px wide on phones.
        cards: ([...row.children] as HTMLElement[]).filter(
          (card) => !card.matches(".track, .node"),
        ),
      }))
      .filter(({ cards }) => cards.length > 1)
      .map(({ row, cards }) => setUpRow(row, cards, still));
    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [pathname]);

  return null;
}
