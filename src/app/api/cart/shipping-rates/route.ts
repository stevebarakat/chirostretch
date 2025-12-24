import { storeApiFetch, createCartResponse } from "@/lib/woocommerce/storeApi";

export async function GET() {
  try {
    const { data, status, setCookieHeaders } = await storeApiFetch({
      method: "GET",
      path: "/cart",
    });

    if (status !== 200) {
      console.error("Error fetching cart for shipping rates:", { status, data });
      return createCartResponse(data, status, setCookieHeaders);
    }

    const shippingRates = data.shipping_rates || [];

    if (shippingRates.length === 0) {
      console.warn("No shipping rates found in cart response.");
    }

    return createCartResponse(
      { shipping_rates: shippingRates, raw_cart_data: data },
      200,
      setCookieHeaders
    );
  } catch (error) {
    console.error("Error fetching shipping rates:", error);
    return createCartResponse({ error: "Failed to fetch shipping rates" }, 500, []);
  }
}
