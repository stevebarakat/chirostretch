import { NextRequest, NextResponse } from "next/server";

const WP_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

/**
 * Get Order by ID
 *
 * Fetches order details from WooCommerce REST API for authenticated viewing.
 * Requires order_key parameter to verify ownership.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const orderKey = searchParams.get("order_key");

    if (!orderKey) {
      return NextResponse.json(
        { error: "Order key is required" },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!WP_URL || !WC_KEY || !WC_SECRET) {
      console.error("[Get Order] Missing required environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Fetch order from WooCommerce REST API
    const orderResponse = await fetch(
      `${WP_URL}/wp-json/wc/v3/orders/${orderId}?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!orderResponse.ok) {
      const error = await orderResponse.json();
      console.error("[Get Order] WooCommerce API error:", error);

      return NextResponse.json(
        { error: "Failed to fetch order" },
        { status: orderResponse.status }
      );
    }

    const order = await orderResponse.json();

    // Verify order key matches (security check)
    if (order.order_key !== orderKey) {
      return NextResponse.json(
        { error: "Invalid order key" },
        { status: 403 }
      );
    }

    // Return order details
    return NextResponse.json(order);
  } catch (error) {
    console.error("[Get Order] Unexpected error:", error);

    return NextResponse.json(
      {
        error: "Server error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
