import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

// Testing Library only auto-cleans when Vitest globals are enabled; they are not.
afterEach(() => {
  cleanup();
});

// jsdom has no scrollIntoView; forms call it after focusing a field
// (focusField). Tests that check scrolling put their own spy in its place.
// Script tests run without a DOM.
beforeEach(() => {
  if (typeof Element !== "undefined") {
    Element.prototype.scrollIntoView = () => {};
  }
});
