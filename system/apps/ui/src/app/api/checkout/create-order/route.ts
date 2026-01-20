import { NextRequest, NextResponse } from "next/server";
import {
  executeMutation,
  CREATE_CHECKOUT_ORDER,
  CreateCheckoutOrderResult,
  CheckoutAddressInput,
  CheckoutLineItemInput,
  GraphQLMutationError,
} from "@/lib/graphql/mutations";

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
 * Transform REST-style billing address to GraphQL input
 */
function transformAddress(address: BillingAddress): CheckoutAddressInput {
  return {
    firstName: address.first_name,
    lastName: address.last_name,
    email: address.email,
    phone: address.phone,
    address1: address.address_1,
    address2: address.address_2,
    city: address.city,
    state: address.state,
    postcode: address.postcode,
    country: address.country,
  };
}

/**
 * Transform REST-style line items to GraphQL input
 */
function transformLineItems(items: LineItem[]): CheckoutLineItemInput[] {
  return items.map((item) => ({
    productId: item.product_id,
    quantity: item.quantity,
    variationId: item.variation_id,
    metaData: item.meta_data?.map((meta) => ({
      key: meta.key,
      value: String(meta.value),
    })),
  }));
}

/**
 * Create Order API Route
 *
 * Creates an unpaid order in WooCommerce via GraphQL mutation and returns
 * the payment_url where the user will be redirected to complete payment.
 *
 * Flow:
 * 1. Receive billing/shipping info + cart items from checkout form
 * 2. Call GraphQL createCheckoutOrder mutation
 * 3. Return order.payment_url for redirect
 * 4. User completes payment on WordPress
 * 5. WordPress redirects back to Next.js success page
 */
export async function POST(request: NextRequest) {
  try {
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

    // Transform to GraphQL input format
    const graphqlBilling = transformAddress(billing);
    const graphqlShipping = shipping ? transformAddress(shipping) : undefined;
    const graphqlLineItems = transformLineItems(line_items);

    const data = await executeMutation<CreateCheckoutOrderResult>(
      CREATE_CHECKOUT_ORDER,
      {
        billing: graphqlBilling,
        shipping: graphqlShipping,
        lineItems: graphqlLineItems,
        couponCode: coupon_code,
      },
      { includeInternalSecret: true }
    );

    const result = data.createCheckoutOrder;

    if (!result.success) {
      console.error("[Create Order] GraphQL mutation failed:", result.error, result.message);
      return NextResponse.json(
        {
          error: result.error || "order_creation_failed",
          message: result.message || "Failed to create order",
        },
        { status: 400 }
      );
    }

    // Return order details including payment_url
    return NextResponse.json(
      {
        order_id: result.orderId,
        order_key: result.orderKey,
        payment_url: result.paymentUrl,
        total: result.total,
        status: result.status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Create Order] Error:", error);

    if (error instanceof GraphQLMutationError) {
      return NextResponse.json(
        {
          error: "graphql_error",
          message: error.message,
          details: error.errors,
        },
        { status: 400 }
      );
    }

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
