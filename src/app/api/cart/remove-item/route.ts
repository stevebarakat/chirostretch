import { NextRequest } from "next/server";
import { storeApiFetch, createCartResponse } from "@/lib/commerce/storeApi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, status, setCookieHeaders } = await storeApiFetch({
      method: "POST",
      path: "/cart/remove-item",
      body,
    });

    return createCartResponse(data, status, setCookieHeaders);
  } catch (error) {
    console.error("Error removing cart item:", error);
    return createCartResponse({ error: "Failed to remove cart item" }, 500, []);
  }
}
