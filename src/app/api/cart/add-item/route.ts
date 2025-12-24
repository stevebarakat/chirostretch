import { NextRequest } from "next/server";
import { storeApiFetch, createCartResponse } from "@/lib/woocommerce/storeApi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, status, setCookieHeaders } = await storeApiFetch({
      method: "POST",
      path: "/cart/add-item",
      body,
    });

    return createCartResponse(data, status, setCookieHeaders);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return createCartResponse({ error: "Failed to add item to cart" }, 500, []);
  }
}
