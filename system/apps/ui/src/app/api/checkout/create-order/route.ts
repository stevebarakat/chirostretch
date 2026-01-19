import { NextRequest, NextResponse } from "next/server";

const WP_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

type BillingAddress = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

type LineItem = {
  product_id: number;
  quantity: number;
  variation_id?: number;
  meta_data?: Array<{
    key: string;
    value: string | number;
  }>;
};

type CreateOrderRequest = {
  billing: BillingAddress;
  shipping?: BillingAddress;
  line_items: LineItem[];
  coupon_code?: string;
};

/**
 * Create Order API Route
 *
 * Creates an unpaid order in WooCommerce via REST API and returns
 * the payment_url where the user will be redirected to complete payment.
 *
 * Flow:
 * 1. Receive billing/shipping info + cart items from checkout form
 * 2. Call WooCommerce REST API to create order
 * 3. Return order.payment_url for redirect
 * 4. User completes payment on WordPress
 * 5. WordPress redirects back to Next.js success page
 */
export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!WP_URL || !WC_KEY || !WC_SECRET) {
      console.error("[Create Order] Missing required environment variables");
      return NextResponse.json(
        {
          error: "Server configuration error",
          message: "WooCommerce API credentials not configured",
        },
        { status: 500 }
      );
    }

    const body: CreateOrderRequest = await request.json();
    const { billing, shipping, line_items, coupon_code } = body;

    // Validate request
    if (!billing || !line_items || line_items.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid request",
          message: "Billing information and cart items are required",
        },
        { status: 400 }
      );
    }

    console.log(
      `[Create Order] Creating order for ${billing.email} with ${line_items.length} items`
    );

    // Create order via WooCommerce REST API
    console.log("[Create Order] Creating order with:", {
      url: `${WP_URL}/wp-json/wc/v3/orders`,
      billing: billing.email,
      items: line_items.length,
    });

    const orderResponse = await fetch(
      `${WP_URL}/wp-json/wc/v3/orders?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing,
          shipping: shipping || billing, // Use billing as shipping if not provided
          line_items,
          set_paid: false, // Order is unpaid - payment happens on WordPress
          status: "pending", // Order starts as pending payment
          ...(coupon_code && {
            coupon_lines: [{ code: coupon_code }],
          }),
        }),
      }
    );

    if (!orderResponse.ok) {
      const error = await orderResponse.json();
      console.error("[Create Order] WooCommerce API error:", error);

      return NextResponse.json(
        {
          error: "Failed to create order",
          message: error.message || "WooCommerce API error",
          details: error,
        },
        { status: orderResponse.status }
      );
    }

    const order = await orderResponse.json();

    console.log(
      `[Create Order] Order ${order.id} created successfully. Payment URL: ${order.payment_url}`
    );

    // Return order details including payment_url
    return NextResponse.json(
      {
        order_id: order.id,
        order_key: order.order_key,
        payment_url: order.payment_url, // WordPress checkout URL for payment
        total: order.total,
        status: order.status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Create Order] Unexpected error:", error);

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
