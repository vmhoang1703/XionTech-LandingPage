"use client";

import { useEffect, useState } from "react";
import { CLOCK_REFRESH_MS, formatOfficeTime } from "@/lib/clock/office-time";

type LiveClockProps = {
  timeZone: string;
  zoneLabel: string;
};

export function LiveClock({ timeZone, zoneLabel }: Readonly<LiveClockProps>) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      try {
        setTime(formatOfficeTime(new Date(), timeZone));
      } catch (error) {
        console.warn(
          `LiveClock: cannot format time for zone "${timeZone}"`,
          error,
        );
        clearInterval(id);
      }
    };
    const id = setInterval(tick, CLOCK_REFRESH_MS);
    tick();
    return () => clearInterval(id);
  }, [timeZone]);

  return <span>{time ?? zoneLabel}</span>;
}
