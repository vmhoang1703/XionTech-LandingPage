import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DaylightIcon } from "./daylight-icon";

// 03:15 UTC is 22:15 in Plano (US Central, daylight time) and 10:15 in HCMC.
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-05T03:15:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const iconOf = (container: HTMLElement) =>
  container.querySelector("svg") as SVGElement;

describe("DaylightIcon", () => {
  it("is the clock icon in the server HTML", () => {
    const html = renderToString(<DaylightIcon timeZone="Asia/Ho_Chi_Minh" />);
    expect(html).toContain("<svg");
    expect(html).not.toContain("daylight");
  });

  it("shows a sun by day and a moon by night, hidden from screen readers", () => {
    const day = render(<DaylightIcon timeZone="Asia/Ho_Chi_Minh" />);
    const night = render(<DaylightIcon timeZone="America/Chicago" />);
    const sun = iconOf(day.container);
    const moon = iconOf(night.container);

    expect(sun.getAttribute("class")).toBe("daylight");
    expect(sun.getAttribute("aria-hidden")).toBe("true");
    expect(moon.getAttribute("class")).toBe("daylight");
    expect(sun.innerHTML).not.toBe(moon.innerHTML);
  });

  it("turns at 06:00 and 18:00", () => {
    // 23:00 UTC is 06:00 in HCMC, 11:00 UTC is 18:00 there.
    vi.setSystemTime(new Date("2026-10-04T23:00:00Z"));
    const morning = iconOf(
      render(<DaylightIcon timeZone="Asia/Ho_Chi_Minh" />).container,
    );
    vi.setSystemTime(new Date("2026-10-05T11:00:00Z"));
    const evening = iconOf(
      render(<DaylightIcon timeZone="Asia/Ho_Chi_Minh" />).container,
    );
    vi.setSystemTime(new Date("2026-10-05T10:59:00Z"));
    const afternoon = iconOf(
      render(<DaylightIcon timeZone="Asia/Ho_Chi_Minh" />).container,
    );

    expect(morning.innerHTML).toBe(afternoon.innerHTML);
    expect(evening.innerHTML).not.toBe(afternoon.innerHTML);
  });

  it("keeps the clock icon for a bad zone", () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { container } = render(<DaylightIcon timeZone="Mars/Olympus" />);
    expect(iconOf(container).getAttribute("class")).toBeNull();
  });
});
