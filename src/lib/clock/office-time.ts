export const CLOCK_REFRESH_MS = 30_000;

/**
 * Format a date to local time in a given timezone.
 *
 * @param date - The date to format
 * @param timeZone - IANA timezone identifier (e.g., 'Asia/Ho_Chi_Minh')
 * @returns Time in "HH:MM" format using 24-hour clock (en-GB)
 * @throws RangeError if the timezone is invalid
 */
export function formatOfficeTime(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  });

  return formatter.format(date);
}
