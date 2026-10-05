import { act, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LiveClock } from "./live-clock";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-05T03:15:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("LiveClock", () => {
  it("renders the zone label in the server HTML", () => {
    const html = renderToString(
      <LiveClock timeZone="Asia/Ho_Chi_Minh" zoneLabel="GMT+7" />,
    );
    expect(html).toContain("GMT+7");
    expect(html).not.toContain("10:15");
  });

  it("shows the local time after mount", () => {
    const { container } = render(
      <LiveClock timeZone="America/Chicago" zoneLabel="US Central" />,
    );
    expect(container.textContent).toBe("22:15");
    expect(container.textContent).not.toContain("US Central");
  });

  it("shows the new minute after 30 seconds", () => {
    vi.setSystemTime(new Date("2026-10-05T03:15:45Z"));
    const { container } = render(
      <LiveClock timeZone="Asia/Ho_Chi_Minh" zoneLabel="GMT+7" />,
    );
    expect(container.textContent).toBe("10:15");
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(container.textContent).toBe("10:16");
  });

  it("clears the interval on unmount", () => {
    const { unmount } = render(
      <LiveClock timeZone="Asia/Ho_Chi_Minh" zoneLabel="GMT+7" />,
    );
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("keeps the label and warns once for a bad zone", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { container } = render(
      <LiveClock timeZone="Mars/Olympus" zoneLabel="Mars" />,
    );
    act(() => {
      vi.advanceTimersByTime(90_000);
    });
    expect(container.textContent).toBe("Mars");
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain("Mars/Olympus");
  });
});
