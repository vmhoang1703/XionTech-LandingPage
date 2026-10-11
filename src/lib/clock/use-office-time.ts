import { useEffect, useState } from "react";
import { CLOCK_REFRESH_MS, formatOfficeTime } from "./office-time";

/**
 * An office's local time ("HH:MM"), refreshed every 30 seconds after mount.
 *
 * @param timeZone - IANA timezone identifier (e.g., 'Asia/Ho_Chi_Minh')
 * @returns The time, or null before mount (server HTML) and for a bad zone,
 *   which warns once and stops refreshing
 */
export function useOfficeTime(timeZone: string): string | null {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      try {
        setTime(formatOfficeTime(new Date(), timeZone));
      } catch (error) {
        console.warn(
          `useOfficeTime: cannot format time for zone "${timeZone}"`,
          error,
        );
        clearInterval(id);
      }
    };
    const id = setInterval(tick, CLOCK_REFRESH_MS);
    tick();
    return () => clearInterval(id);
  }, [timeZone]);

  return time;
}
