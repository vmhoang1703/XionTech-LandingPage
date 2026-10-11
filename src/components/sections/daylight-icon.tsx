"use client";

import { ClockIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useOfficeTime } from "@/lib/clock/use-office-time";

// Day is 06:00 to 17:59, office local time.
const DAY_FROM = 6;
const NIGHT_FROM = 18;

// An office chip's icon: a sun by day and a moon by night, from the office's
// real local time. Until the time is known (server HTML, no JavaScript) it is
// the clock icon. The sun or moon turns in once (globals.css, ".daylight").
export function DaylightIcon({ timeZone }: Readonly<{ timeZone: string }>) {
  const time = useOfficeTime(timeZone);
  if (!time) return <ClockIcon aria-hidden="true" />;

  const hour = Number(time.slice(0, 2));
  const Icon = hour >= DAY_FROM && hour < NIGHT_FROM ? SunIcon : MoonIcon;
  return <Icon aria-hidden="true" className="daylight" />;
}
