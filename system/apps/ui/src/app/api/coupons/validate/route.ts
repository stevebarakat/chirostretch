import { NextRequest, NextResponse } from "next/server";

const WP_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const INTERNAL_SECRET = process.env.CHIROSTRETCH_INTERNAL_SECRET;

type ValidateCouponRequest = {
  coupon_code: string;
  email: string;
};

type ValidateCouponResponse = {
  valid: boolean;
  discount_amount?: number;
  discount_type?: string;
  coupon_code?: string;
  error?: string;
  message?: string;
};

export async function POST(request: NextRequest) {
  try {
    if (!WP_URL) {
      console.error("[Coupon Validate] Missing NEXT_PUBLIC_BACKEND_URL");
      return NextResponse.json(
        { valid: false, error: "server_error", message: "Server configuration error" },
        { status: 500 }
      );
    }

    const body: ValidateCouponRequest = await request.json();
    const { coupon_code, email } = body;

    if (!coupon_code || !email) {
      return NextResponse.json(
        { valid: false, error: "missing_params", message: "Coupon code and email are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${WP_URL}/wp-json/chirostretch/v1/coupons/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(INTERNAL_SECRET && { "X-Internal-Secret": INTERNAL_SECRET }),
      },
      body: JSON.stringify({ coupon_code, email }),
    });

    if (!response.ok) {
      console.error("[Coupon Validate] WordPress API error:", response.status);
      return NextResponse.json(
        { valid: false, error: "api_error", message: "Failed to validate coupon" },
        { status: 500 }
      );
    }

    const data: ValidateCouponResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Coupon Validate] Error:", error);
    return NextResponse.json(
      { valid: false, error: "server_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
