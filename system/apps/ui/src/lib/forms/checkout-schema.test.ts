import { describe, it, expect } from "vitest";
import { checkoutSchema } from "./checkout-schema";

describe("checkoutSchema", () => {
  const validData = {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    address_1: "123 Main St",
    address_2: "",
    city: "Anytown",
    state: "FL",
    postcode: "12345",
    country: "US" as const,
    coupon_code: "",
  };

  describe("valid input", () => {
    it("accepts valid complete address", () => {
      const result = checkoutSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("accepts US country", () => {
      const result = checkoutSchema.safeParse({ ...validData, country: "US" });
      expect(result.success).toBe(true);
    });

    it("accepts CA country", () => {
      const result = checkoutSchema.safeParse({ ...validData, country: "CA" });
      expect(result.success).toBe(true);
    });

    it("accepts empty address_2", () => {
      const result = checkoutSchema.safeParse({ ...validData, address_2: "" });
      expect(result.success).toBe(true);
    });

    it("accepts empty coupon_code", () => {
      const result = checkoutSchema.safeParse({ ...validData, coupon_code: "" });
      expect(result.success).toBe(true);
    });

    it("accepts valid coupon_code", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        coupon_code: "SAVE10",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("required fields", () => {
    it("rejects missing first_name", () => {
      const { first_name: _, ...data } = validData;
      const result = checkoutSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects empty first_name", () => {
      const result = checkoutSchema.safeParse({ ...validData, first_name: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("First name is required");
      }
    });

    it("rejects missing last_name", () => {
      const { last_name: _, ...data } = validData;
      const result = checkoutSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects empty last_name", () => {
      const result = checkoutSchema.safeParse({ ...validData, last_name: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Last name is required");
      }
    });

    it("rejects missing address_1", () => {
      const { address_1: _, ...data } = validData;
      const result = checkoutSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects empty address_1", () => {
      const result = checkoutSchema.safeParse({ ...validData, address_1: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Street address is required"
        );
      }
    });

    it("rejects missing city", () => {
      const { city: _, ...data } = validData;
      const result = checkoutSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects empty city", () => {
      const result = checkoutSchema.safeParse({ ...validData, city: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("City is required");
      }
    });
  });

  describe("email validation", () => {
    it("rejects missing email", () => {
      const { email: _, ...data } = validData;
      const result = checkoutSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects invalid email format", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Valid email is required");
      }
    });

    it("rejects email without domain", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        email: "user@",
      });
      expect(result.success).toBe(false);
    });

    it("accepts valid email formats", () => {
      const validEmails = [
        "user@example.com",
        "user.name@example.com",
        "user+tag@example.com",
        "user@subdomain.example.com",
      ];

      validEmails.forEach((email) => {
        const result = checkoutSchema.safeParse({ ...validData, email });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("phone validation", () => {
    it("rejects phone shorter than 10 characters", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        phone: "123456789", // 9 digits
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Valid phone number is required"
        );
      }
    });

    it("accepts phone with exactly 10 characters", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        phone: "1234567890",
      });
      expect(result.success).toBe(true);
    });

    it("accepts phone with more than 10 characters", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        phone: "+1-234-567-8901",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("state validation", () => {
    it("rejects state shorter than 2 characters", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        state: "F",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("State is required");
      }
    });

    it("accepts 2-character state code", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        state: "FL",
      });
      expect(result.success).toBe(true);
    });

    it("accepts full state name", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        state: "Florida",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("postcode validation", () => {
    it("rejects postcode shorter than 5 characters", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        postcode: "1234",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("ZIP code is required");
      }
    });

    it("accepts 5-digit ZIP code", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        postcode: "12345",
      });
      expect(result.success).toBe(true);
    });

    it("accepts ZIP+4 format", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        postcode: "12345-6789",
      });
      expect(result.success).toBe(true);
    });

    it("accepts Canadian postal code", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        country: "CA",
        postcode: "K1A 0B1",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("country validation", () => {
    it("rejects invalid country code", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        country: "UK",
      });
      expect(result.success).toBe(false);
    });

    it("rejects lowercase country code", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        country: "us",
      });
      expect(result.success).toBe(false);
    });
  });
});
