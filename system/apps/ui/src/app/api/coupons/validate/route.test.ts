import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Hoist mock functions
const { mockExecuteMutation } = vi.hoisted(() => ({
  mockExecuteMutation: vi.fn(),
}));

// Mock the GraphQL mutations module
vi.mock("@/lib/graphql/mutations", () => ({
  executeMutation: mockExecuteMutation,
  VALIDATE_COUPON: "VALIDATE_COUPON_QUERY",
  GraphQLMutationError: class GraphQLMutationError extends Error {
    public readonly errors: Array<{ message: string }>;
    constructor(errors: Array<{ message: string }>) {
      super(errors[0]?.message || "GraphQL mutation failed");
      this.name = "GraphQLMutationError";
      this.errors = errors;
    }
  },
}));

import { POST } from "./route";
import { GraphQLMutationError } from "@/lib/graphql/mutations";

/**
 * Create a mock request for coupon validation
 */
function createCouponRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost:3000/api/coupons/validate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("Coupon Validation API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validation", () => {
    it("returns 400 when coupon_code is missing", async () => {
      const request = createCouponRequest({
        email: "test@example.com",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.valid).toBe(false);
      expect(data.error).toBe("missing_params");
      expect(data.message).toBe("Coupon code and email are required");
    });

    it("returns 400 when email is missing", async () => {
      const request = createCouponRequest({
        coupon_code: "SAVE10",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.valid).toBe(false);
      expect(data.error).toBe("missing_params");
    });

    it("returns 400 when both coupon_code and email are missing", async () => {
      const request = createCouponRequest({});

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.valid).toBe(false);
      expect(data.error).toBe("missing_params");
    });

    it("returns 400 when coupon_code is empty string", async () => {
      const request = createCouponRequest({
        coupon_code: "",
        email: "test@example.com",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.valid).toBe(false);
    });

    it("returns 400 when email is empty string", async () => {
      const request = createCouponRequest({
        coupon_code: "SAVE10",
        email: "",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.valid).toBe(false);
    });
  });

  describe("successful validation", () => {
    it("returns valid coupon with discount details", async () => {
      mockExecuteMutation.mockResolvedValueOnce({
        validateCoupon: {
          valid: true,
          discountAmount: 10,
          discountType: "percent",
          couponCode: "SAVE10",
          error: null,
          message: "Coupon applied successfully",
        },
      });

      const request = createCouponRequest({
        coupon_code: "SAVE10",
        email: "customer@example.com",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(true);
      expect(data.discount_amount).toBe(10);
      expect(data.discount_type).toBe("percent");
      expect(data.coupon_code).toBe("SAVE10");
      expect(data.error).toBe(null);
      expect(data.message).toBe("Coupon applied successfully");
    });

    it("passes correct variables to GraphQL mutation", async () => {
      mockExecuteMutation.mockResolvedValueOnce({
        validateCoupon: {
          valid: true,
          discountAmount: 20,
          discountType: "fixed_cart",
          couponCode: "FLAT20",
          error: null,
          message: null,
        },
      });

      const request = createCouponRequest({
        coupon_code: "FLAT20",
        email: "test@example.com",
      });

      await POST(request);

      expect(mockExecuteMutation).toHaveBeenCalledWith(
        "VALIDATE_COUPON_QUERY",
        { couponCode: "FLAT20", email: "test@example.com" },
        { includeInternalSecret: true }
      );
    });

    it("handles fixed_cart discount type", async () => {
      mockExecuteMutation.mockResolvedValueOnce({
        validateCoupon: {
          valid: true,
          discountAmount: 25,
          discountType: "fixed_cart",
          couponCode: "FLAT25",
          error: null,
          message: null,
        },
      });

      const request = createCouponRequest({
        coupon_code: "FLAT25",
        email: "test@example.com",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.discount_type).toBe("fixed_cart");
      expect(data.discount_amount).toBe(25);
    });
  });

  describe("invalid coupon", () => {
    it("returns invalid response for non-existent coupon", async () => {
      mockExecuteMutation.mockResolvedValueOnce({
        validateCoupon: {
          valid: false,
          discountAmount: null,
          discountType: null,
          couponCode: null,
          error: "invalid_coupon",
          message: "Coupon does not exist",
        },
      });

      const request = createCouponRequest({
        coupon_code: "INVALID",
        email: "test@example.com",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(false);
      expect(data.error).toBe("invalid_coupon");
      expect(data.message).toBe("Coupon does not exist");
    });

    it("returns invalid response for expired coupon", async () => {
      mockExecuteMutation.mockResolvedValueOnce({
        validateCoupon: {
          valid: false,
          discountAmount: null,
          discountType: null,
          couponCode: "EXPIRED",
          error: "coupon_expired",
          message: "This coupon has expired",
        },
      });

      const request = createCouponRequest({
        coupon_code: "EXPIRED",
        email: "test@example.com",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.valid).toBe(false);
      expect(data.error).toBe("coupon_expired");
    });

    it("returns invalid response for email mismatch", async () => {
      mockExecuteMutation.mockResolvedValueOnce({
        validateCoupon: {
          valid: false,
          discountAmount: null,
          discountType: null,
          couponCode: "PERSONAL10",
          error: "email_mismatch",
          message: "This coupon is assigned to a different email",
        },
      });

      const request = createCouponRequest({
        coupon_code: "PERSONAL10",
        email: "wrong@example.com",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.valid).toBe(false);
      expect(data.error).toBe("email_mismatch");
    });
  });

  describe("error handling", () => {
    it("returns 500 for GraphQL mutation error", async () => {
      mockExecuteMutation.mockRejectedValueOnce(
        new GraphQLMutationError([{ message: "Internal server error" }])
      );

      const request = createCouponRequest({
        coupon_code: "TEST",
        email: "test@example.com",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.valid).toBe(false);
      expect(data.error).toBe("graphql_error");
      expect(data.message).toBe("Internal server error");
    });

    it("returns 500 for unexpected errors", async () => {
      mockExecuteMutation.mockRejectedValueOnce(new Error("Network error"));

      const request = createCouponRequest({
        coupon_code: "TEST",
        email: "test@example.com",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.valid).toBe(false);
      expect(data.error).toBe("server_error");
      expect(data.message).toBe("An unexpected error occurred");
    });
  });

  describe("response format compatibility", () => {
    it("uses snake_case keys for backwards compatibility", async () => {
      mockExecuteMutation.mockResolvedValueOnce({
        validateCoupon: {
          valid: true,
          discountAmount: 15,
          discountType: "percent",
          couponCode: "TEST15",
          error: null,
          message: "Applied",
        },
      });

      const request = createCouponRequest({
        coupon_code: "TEST15",
        email: "test@example.com",
      });

      const response = await POST(request);
      const data = await response.json();

      // Verify snake_case keys are used
      expect(data).toHaveProperty("discount_amount");
      expect(data).toHaveProperty("discount_type");
      expect(data).toHaveProperty("coupon_code");
      // Not camelCase
      expect(data).not.toHaveProperty("discountAmount");
      expect(data).not.toHaveProperty("discountType");
      expect(data).not.toHaveProperty("couponCode");
    });
  });
});
