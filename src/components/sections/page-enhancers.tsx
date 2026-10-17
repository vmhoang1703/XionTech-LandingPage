"use client";

import { PointerGlow } from "./pointer-glow";
import { SwipeRows } from "./swipe-rows";
import { TouchPress } from "./touch-press";

// Page-wide behaviour with no markup of its own: the card light under a mouse,
// the phone swipe rows and the iPhone pressed look. Loaded lazily together by
// DeferredEnhancers, so none of it is in the first bundle.
export function PageEnhancers() {
  return (
    <>
      <PointerGlow />
      <SwipeRows />
      <TouchPress />
    </>
  );
}
