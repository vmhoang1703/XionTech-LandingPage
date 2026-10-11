"use client";

import { useOfficeTime } from "@/lib/clock/use-office-time";

type LiveClockProps = {
  timeZone: string;
  zoneLabel: string;
};

export function LiveClock({ timeZone, zoneLabel }: Readonly<LiveClockProps>) {
  const time = useOfficeTime(timeZone);

  return <span>{time ?? zoneLabel}</span>;
}
