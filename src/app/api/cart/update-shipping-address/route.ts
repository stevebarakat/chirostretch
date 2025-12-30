import { NextRequest } from "next/server";
import { storeApiFetch, createCartResponse } from "@/lib/commerce/storeApi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requestBody: {
      shipping_address?: typeof body.shipping_address;
      billing_address?: typeof body.billing_address;
    } = {};

    if (body.shipping_address) {
      requestBody.shipping_address = body.shipping_address;
    }

    if (body.billing_address) {
      requestBody.billing_address = body.billing_address;
    }

    const { data, status, setCookieHeaders } = await storeApiFetch({
      method: "POST",
      path: "/cart/update-customer",
      body: requestBody,
    });

    if (status !== 200) {
      console.error("Error updating shipping address:", { status, data });
    }

    return createCartResponse(data, status, setCookieHeaders);
  } catch (error) {
    console.error("Error updating shipping address:", error);
    return createCartResponse({ error: "Failed to update shipping address" }, 500, []);
  }
}
