import { describe, it, expect } from "vitest";
import {
  formatBusinessHours,
  formatBusinessHoursText,
  type HourEntry,
} from "./formatBusinessHours";

describe("formatBusinessHours", () => {
  describe("time formatting", () => {
    it("removes :00 when minutes are zero", () => {
      const hours: HourEntry[] = [
        { day: "monday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
      ];
      const result = formatBusinessHours(hours);
      expect(result[0].hours).toBe("9am–6pm");
    });

    it("keeps minutes when not zero", () => {
      const hours: HourEntry[] = [
        { day: "monday", opens_at: "09:30", closes_at: "17:45", is_closed: false },
      ];
      const result = formatBusinessHours(hours);
      expect(result[0].hours).toBe("9:30am–5:45pm");
    });

    it("handles noon correctly", () => {
      const hours: HourEntry[] = [
        { day: "monday", opens_at: "12:00", closes_at: "20:00", is_closed: false },
      ];
      const result = formatBusinessHours(hours);
      expect(result[0].hours).toBe("12pm–8pm");
    });

    it("handles midnight correctly", () => {
      const hours: HourEntry[] = [
        { day: "monday", opens_at: "00:00", closes_at: "06:00", is_closed: false },
      ];
      const result = formatBusinessHours(hours);
      expect(result[0].hours).toBe("12am–6am");
    });
  });

  describe("day grouping", () => {
    it("groups consecutive days with same hours", () => {
      const hours: HourEntry[] = [
        { day: "monday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "tuesday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "wednesday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "thursday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "friday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
      ];
      const result = formatBusinessHours(hours);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ days: "Mon–Fri", hours: "9am–6pm" });
    });

    it("separates non-consecutive days with same hours", () => {
      const hours: HourEntry[] = [
        { day: "monday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "wednesday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "friday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
      ];
      const result = formatBusinessHours(hours);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ days: "Mon", hours: "9am–6pm" });
      expect(result[1]).toEqual({ days: "Wed", hours: "9am–6pm" });
      expect(result[2]).toEqual({ days: "Fri", hours: "9am–6pm" });
    });

    it("separates consecutive days with different hours", () => {
      const hours: HourEntry[] = [
        { day: "monday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "tuesday", opens_at: "10:00", closes_at: "17:00", is_closed: false },
      ];
      const result = formatBusinessHours(hours);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ days: "Mon", hours: "9am–6pm" });
      expect(result[1]).toEqual({ days: "Tue", hours: "10am–5pm" });
    });

    it("handles two consecutive days", () => {
      const hours: HourEntry[] = [
        { day: "saturday", opens_at: "10:00", closes_at: "14:00", is_closed: false },
        { day: "sunday", opens_at: "10:00", closes_at: "14:00", is_closed: false },
      ];
      const result = formatBusinessHours(hours);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ days: "Sat–Sun", hours: "10am–2pm" });
    });
  });

  describe("closed days", () => {
    it("shows Closed with capital C", () => {
      const hours: HourEntry[] = [
        { day: "sunday", opens_at: "", closes_at: "", is_closed: true },
      ];
      const result = formatBusinessHours(hours);
      expect(result[0].hours).toBe("Closed");
    });

    it("groups consecutive closed days", () => {
      const hours: HourEntry[] = [
        { day: "saturday", opens_at: "", closes_at: "", is_closed: true },
        { day: "sunday", opens_at: "", closes_at: "", is_closed: true },
      ];
      const result = formatBusinessHours(hours);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ days: "Sat–Sun", hours: "Closed" });
    });
  });

  describe("full week example", () => {
    it("formats typical business hours correctly", () => {
      const hours: HourEntry[] = [
        { day: "monday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "tuesday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "wednesday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "thursday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "friday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "saturday", opens_at: "10:00", closes_at: "14:00", is_closed: false },
        { day: "sunday", opens_at: "", closes_at: "", is_closed: true },
      ];
      const result = formatBusinessHours(hours);
      expect(result).toEqual([
        { days: "Mon–Fri", hours: "9am–6pm" },
        { days: "Sat", hours: "10am–2pm" },
        { days: "Sun", hours: "Closed" },
      ]);
    });
  });

  describe("edge cases", () => {
    it("returns empty array for empty input", () => {
      expect(formatBusinessHours([])).toEqual([]);
    });

    it("handles unsorted input", () => {
      const hours: HourEntry[] = [
        { day: "friday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "monday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "wednesday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "tuesday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
        { day: "thursday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
      ];
      const result = formatBusinessHours(hours);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ days: "Mon–Fri", hours: "9am–6pm" });
    });

    it("handles single day", () => {
      const hours: HourEntry[] = [
        { day: "wednesday", opens_at: "10:00", closes_at: "16:00", is_closed: false },
      ];
      const result = formatBusinessHours(hours);
      expect(result).toEqual([{ days: "Wed", hours: "10am–4pm" }]);
    });
  });
});

describe("formatBusinessHoursText", () => {
  it("formats as newline-separated text", () => {
    const hours: HourEntry[] = [
      { day: "monday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
      { day: "tuesday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
      { day: "wednesday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
      { day: "thursday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
      { day: "friday", opens_at: "09:00", closes_at: "18:00", is_closed: false },
      { day: "saturday", opens_at: "10:00", closes_at: "14:00", is_closed: false },
      { day: "sunday", opens_at: "", closes_at: "", is_closed: true },
    ];
    const result = formatBusinessHoursText(hours);
    expect(result).toBe("Mon–Fri: 9am–6pm\nSat: 10am–2pm\nSun: Closed");
  });
});
