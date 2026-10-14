// Runs `start` at the page's first quiet moment (at most `timeout` ms later),
// so heavy or showy work does not compete with the page starting up. Browsers
// without requestIdleCallback (Safari) wait 200ms. Returns a cancel function.
export function whenIdle(start: () => void, timeout = 800) {
  if (window.requestIdleCallback) {
    const idle = window.requestIdleCallback(start, { timeout });
    return () => window.cancelIdleCallback(idle);
  }
  const timer = window.setTimeout(start, 200);
  return () => window.clearTimeout(timer);
}
