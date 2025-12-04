import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WP_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://chirostretch-copy.local";

export async function GET() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(`${WP_URL}/wp-json/wc/store/v1/cart`, {
      method: "GET",
      headers: {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error fetching cart for shipping rates:", {
        status: res.status,
        statusText: res.statusText,
        data,
      });
      return NextResponse.json(data, { status: res.status });
    }

    console.log(
      "Cart response for shipping rates:",
      JSON.stringify(data, null, 2)
    );

    const shippingRates = data.shipping_rates || [];

    if (shippingRates.length === 0) {
      console.warn(
        "No shipping rates found in cart response. Cart data:",
        JSON.stringify(
          {
            shipping_rates: data.shipping_rates,
            shipping_address: data.shipping_address,
            needs_shipping: data.needs_shipping,
          },
          null,
          2
        )
      );
    }

    const response = NextResponse.json({
      shipping_rates: shippingRates,
      raw_cart_data: data,
    });

    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error("Error fetching shipping rates:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipping rates" },
      { status: 500 }
    );
  }
}
