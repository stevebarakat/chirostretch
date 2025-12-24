import { storeApiFetch, createCartResponse } from "@/lib/woocommerce/storeApi";

export async function DELETE() {
  try {
    const { data, status, setCookieHeaders } = await storeApiFetch({
      method: "DELETE",
      path: "/cart/items",
    });

    return createCartResponse(data, status, setCookieHeaders);
  } catch (error) {
    console.error("Error clearing cart:", error);
    return createCartResponse({ error: "Failed to clear cart" }, 500, []);
  }
}
