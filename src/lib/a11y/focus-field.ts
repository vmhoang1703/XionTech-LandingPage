// Focus a form field and bring it to the middle of the screen. WebKit ignores
// the page's scroll-padding when a script focuses a field, so on a small iPhone
// the field (and its label) ended under the sticky header (mobile retest,
// 2026-10-15). The page's scroll-behavior keeps the trip smooth, and instant
// under reduced motion.
export function focusField(field: HTMLElement | null | undefined) {
  if (!field) return;
  field.focus({ preventScroll: true });
  field.scrollIntoView({ block: "center" });
}
