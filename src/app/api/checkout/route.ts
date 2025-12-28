import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const body = await request.json();

    const res = await fetch(`${WP_URL}/wp-json/wc/store/v1/checkout`, {
      method: "POST",
      headers: {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(
        "WooCommerce checkout error - Status:",
        res.status,
        res.statusText
      );
      console.error(
        "WooCommerce checkout error - Response:",
        JSON.stringify(data, null, 2)
      );
      console.error(
        "WooCommerce checkout error - Request:",
        JSON.stringify(body, null, 2)
      );
      return NextResponse.json(data, { status: res.status });
    }

    const response = NextResponse.json(data);

    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error("Error proxying checkout request:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
