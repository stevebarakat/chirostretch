import { storeApiFetch, createCartResponse } from "@/lib/commerce/storeApi";

export async function GET() {
  try {
    const { data, status, setCookieHeaders } = await storeApiFetch({
      method: "GET",
      path: "/cart",
    });

    return createCartResponse(data, status, setCookieHeaders);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return createCartResponse({ error: "Failed to fetch cart" }, 500, []);
  }
}
