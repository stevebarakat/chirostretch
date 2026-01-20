import { NextRequest, NextResponse } from "next/server";
import {
  executeMutation,
  VALIDATE_COUPON,
  ValidateCouponResult,
  GraphQLMutationError,
} from "@/lib/graphql/mutations";

type ValidateCouponRequest = {
  coupon_code: string;
  email: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: ValidateCouponRequest = await request.json();
    const { coupon_code, email } = body;

    if (!coupon_code || !email) {
      return NextResponse.json(
        { valid: false, error: "missing_params", message: "Coupon code and email are required" },
        { status: 400 }
      );
    }

    const data = await executeMutation<ValidateCouponResult>(
      VALIDATE_COUPON,
      { couponCode: coupon_code, email },
      { includeInternalSecret: true }
    );

    const result = data.validateCoupon;

    // Return in the same format as the original REST response for backwards compatibility
    return NextResponse.json({
      valid: result.valid,
      discount_amount: result.discountAmount,
      discount_type: result.discountType,
      coupon_code: result.couponCode,
      error: result.error,
      message: result.message,
    });
  } catch (error) {
    console.error("[Coupon Validate] Error:", error);

    if (error instanceof GraphQLMutationError) {
      return NextResponse.json(
        { valid: false, error: "graphql_error", message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { valid: false, error: "server_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
