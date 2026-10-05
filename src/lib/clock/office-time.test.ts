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

    it("formats daylight saving time in Ho Chi Minh City (2026-12-05T03:15:00Z)", () => {
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

    it("pads hours with leading zero", () => {
      const date = new Date("2026-10-04T16:59:00Z"); // HCMC: 23:59
      const result = formatOfficeTime(date, "Asia/Ho_Chi_Minh");
      expect(result).toBe("23:59");
    });

    it("pads minutes with leading zero", () => {
      const date = new Date("2026-10-05T01:05:00Z"); // HCMC: 08:05
      const result = formatOfficeTime(date, "Asia/Ho_Chi_Minh");
      expect(result).toBe("08:05");
    });
  });
});
