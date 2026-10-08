import { useSyncExternalStore } from "react";

const subscribeNothing = () => () => {};

// false on the server and during hydration, true after. Parts that need
// JavaScript (or browser storage) render only once it is true, so without
// JavaScript they never show.
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
}
