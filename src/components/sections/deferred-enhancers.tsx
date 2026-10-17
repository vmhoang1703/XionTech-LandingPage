"use client";

import dynamic from "next/dynamic";

// PageEnhancers render nothing on the server (each returns null) and only add
// listeners and swipe dots once the page runs, so they load as one small chunk
// after hydration rather than in the first bundle (mobile speed pass,
// 2026-10-17). Without JavaScript the page is the same as before.
export const DeferredEnhancers = dynamic(
  () => import("./page-enhancers").then((m) => m.PageEnhancers),
  { ssr: false },
);
