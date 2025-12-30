import { NextRequest } from "next/server";
import { storeApiFetch, createCartResponse } from "@/lib/commerce/storeApi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.rate_id) {
      return createCartResponse({ error: "rate_id is required" }, 400, []);
    }

    const { data, status, setCookieHeaders } = await storeApiFetch({
      method: "POST",
      path: "/cart/select-shipping-rate",
      body: { rate_id: body.rate_id },
    });

    if (status !== 200) {
      console.error("Error selecting shipping rate:", { status, data });
    }

    return createCartResponse(data, status, setCookieHeaders);
  } catch (error) {
    console.error("Error selecting shipping rate:", error);
    return createCartResponse({ error: "Failed to select shipping rate" }, 500, []);
  }
}
