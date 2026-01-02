import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const WP_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, date, time, resourceId } = body;

    if (!productId || !date || !time) {
      return NextResponse.json(
        { error: "productId, date, and time are required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .filter(
        (c) =>
          c.name.startsWith("wp_woocommerce_session") ||
          c.name.startsWith("woocommerce_")
      )
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const res = await fetch(
      `${WP_URL}/wp-json/chirostretch/v1/bookings/add-to-cart`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { cookie: cookieHeader } : {}),
        },
        body: JSON.stringify({
          productId,
          date,
          time,
          resourceId,
        }),
        cache: "no-store",
      }
    );

    const data = await res.json();

    // Forward WooCommerce session cookies
    const response = NextResponse.json(data, { status: res.status });

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      const cookies = setCookie.split(
        /,(?=\s*(?:woocommerce_|wp_woocommerce_))/
      );
      for (const cookie of cookies) {
        response.headers.append("Set-Cookie", cookie);
      }
    }

    return response;
  } catch (error) {
    console.error("Error adding booking to cart:", error);
    return NextResponse.json(
      { error: "Failed to add booking to cart" },
      { status: 500 }
    );
  }
}
