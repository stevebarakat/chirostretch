import { describe, it, expect } from "vitest";
import { parsePrice, formatPrice } from "./formatPrice";

describe("parsePrice", () => {
  describe("handles undefined/null/empty values", () => {
    it("returns 0 for undefined", () => {
      expect(parsePrice(undefined)).toBe(0);
    });

    it("returns 0 for empty string", () => {
      expect(parsePrice("")).toBe(0);
    });

    it("returns 0 for zero", () => {
      expect(parsePrice(0)).toBe(0);
    });
  });

  describe("handles string prices", () => {
    it("parses price with dollar sign", () => {
      expect(parsePrice("$19.99")).toBe(19.99);
    });

    it("parses price without dollar sign", () => {
      expect(parsePrice("19.99")).toBe(19.99);
    });

    it("parses whole number string", () => {
      expect(parsePrice("50")).toBe(50);
    });

    it("parses price with commas", () => {
      expect(parsePrice("$1,299.99")).toBe(1299.99);
    });

    it("parses price with multiple commas", () => {
      expect(parsePrice("$10,000,000.00")).toBe(10000000);
    });
  });

  describe("handles number prices", () => {
    it("passes through decimal numbers", () => {
      expect(parsePrice(29.99)).toBe(29.99);
    });

    it("passes through whole numbers under 100", () => {
      expect(parsePrice(50)).toBe(50);
    });
  });

  describe("cent conversion (values >= 100 without decimal)", () => {
    it("converts cents to dollars for values >= 100 without decimal", () => {
      expect(parsePrice("1999")).toBe(19.99);
    });

    it("converts large cent values", () => {
      expect(parsePrice("12999")).toBe(129.99);
    });

    it("does NOT convert when decimal point present", () => {
      expect(parsePrice("199.99")).toBe(199.99);
    });

    it("does NOT convert string with dollar sign even if >= 100", () => {
      // After removing $, "199.99" has decimal so no conversion
      expect(parsePrice("$199.99")).toBe(199.99);
    });

    it("converts string number >= 100 without decimal", () => {
      expect(parsePrice("500")).toBe(5);
    });
  });

  describe("edge cases", () => {
    it("returns 0 for non-numeric string", () => {
      expect(parsePrice("abc")).toBe(0);
    });

    it("handles string with only special characters", () => {
      expect(parsePrice("$")).toBe(0);
    });

    it("handles negative values by ignoring minus sign", () => {
      // The regex removes minus sign, so -19.99 becomes 19.99
      expect(parsePrice("-19.99")).toBe(19.99);
    });

    it("handles whitespace around value", () => {
      expect(parsePrice(" $29.99 ")).toBe(29.99);
    });
  });
});

describe("formatPrice", () => {
  describe("formats USD currency", () => {
    it("formats decimal price", () => {
      expect(formatPrice(19.99)).toBe("$19.99");
    });

    it("formats whole number with trailing zeros", () => {
      expect(formatPrice(50)).toBe("$50.00");
    });

    it("formats zero", () => {
      expect(formatPrice(0)).toBe("$0.00");
    });

    it("formats undefined as $0.00", () => {
      expect(formatPrice(undefined)).toBe("$0.00");
    });
  });

  describe("handles string input", () => {
    it("formats string with dollar sign", () => {
      expect(formatPrice("$29.99")).toBe("$29.99");
    });

    it("formats string without dollar sign", () => {
      expect(formatPrice("29.99")).toBe("$29.99");
    });

    it("formats cents string", () => {
      expect(formatPrice("2999")).toBe("$29.99");
    });
  });

  describe("formats large numbers", () => {
    it("adds thousands separator", () => {
      expect(formatPrice(1299.99)).toBe("$1,299.99");
    });

    it("formats very large numbers", () => {
      expect(formatPrice(999999.99)).toBe("$999,999.99");
    });
  });

  describe("edge cases", () => {
    it("formats empty string as $0.00", () => {
      expect(formatPrice("")).toBe("$0.00");
    });

    it("formats non-numeric string as $0.00", () => {
      expect(formatPrice("abc")).toBe("$0.00");
    });

    it("rounds to 2 decimal places", () => {
      expect(formatPrice(19.999)).toBe("$20.00");
    });

    it("preserves single decimal place with trailing zero", () => {
      expect(formatPrice(19.9)).toBe("$19.90");
    });
  });
});
