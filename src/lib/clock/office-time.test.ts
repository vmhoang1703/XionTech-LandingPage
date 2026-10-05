import { describe, it, expect } from "vitest";
import { formatOfficeTime } from "./office-time";

describe("formatOfficeTime", () => {
  describe("matrix times", () => {
    it("formats live time in Ho Chi Minh City (2026-10-05T03:15:00Z)", () => {
      const date = new Date("2026-10-05T03:15:00Z");
      const result = formatOfficeTime(date, "Asia/Ho_Chi_Minh");
      expect(result).toBe("10:15");
    });

    it("formats live time in Plano, UTC−5 (CDT, 2026-10-05T03:15:00Z)", () => {
      const date = new Date("2026-10-05T03:15:00Z");
      const result = formatOfficeTime(date, "America/Chicago");
      expect(result).toBe("22:15");
    });

    it("formats Ho Chi Minh City in December, no daylight saving (2026-12-05T03:15:00Z)", () => {
      const date = new Date("2026-12-05T03:15:00Z");
      const result = formatOfficeTime(date, "Asia/Ho_Chi_Minh");
      expect(result).toBe("10:15");
    });

    it("formats daylight saving time in Plano, UTC−6 (CST, 2026-12-05T03:15:00Z)", () => {
      const date = new Date("2026-12-05T03:15:00Z");
      const result = formatOfficeTime(date, "America/Chicago");
      expect(result).toBe("21:15");
    });
  });

  describe("edge cases", () => {
    it("throws RangeError for invalid IANA zone", () => {
      const date = new Date("2026-10-05T03:15:00Z");
      expect(() => {
        formatOfficeTime(date, "Invalid/Zone");
      }).toThrow(RangeError);
    });
  });

  describe("format", () => {
    it("returns HH:MM in 24-hour format", () => {
      const date = new Date("2026-10-05T00:00:00Z");
      expect(formatOfficeTime(date, "Asia/Ho_Chi_Minh")).toMatch(
        /^\d{2}:\d{2}$/,
      );
    });

    it("pads a single-digit hour with a leading zero", () => {
      const date = new Date("2026-10-05T01:05:00Z"); // HCMC: 08:05
      expect(formatOfficeTime(date, "Asia/Ho_Chi_Minh")).toBe("08:05");
    });

    it("shows 00:05, not 24:05, just after local midnight", () => {
      const date = new Date("2026-10-04T17:05:00Z"); // HCMC: 00:05
      expect(formatOfficeTime(date, "Asia/Ho_Chi_Minh")).toBe("00:05");
    });

    it("skips the hour at the US spring-forward in Plano", () => {
      expect(
        formatOfficeTime(new Date("2026-03-08T07:59:00Z"), "America/Chicago"),
      ).toBe("01:59");
      expect(
        formatOfficeTime(new Date("2026-03-08T08:00:00Z"), "America/Chicago"),
      ).toBe("03:00");
    });

    it("pads minutes with leading zero", () => {
      const date = new Date("2026-10-05T03:05:00Z"); // HCMC: 10:05
      expect(formatOfficeTime(date, "Asia/Ho_Chi_Minh")).toBe("10:05");
    });
  });
});
