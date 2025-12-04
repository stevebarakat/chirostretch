import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const WP_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://chirostretch-copy.local";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

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

    console.log(
      "Updating shipping address:",
      JSON.stringify(requestBody, null, 2)
    );

    const res = await fetch(
      `${WP_URL}/wp-json/wc/store/v1/cart/update-customer`,
      {
        method: "POST",
        headers: {
          ...(cookieHeader ? { cookie: cookieHeader } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Error updating shipping address:", {
        status: res.status,
        statusText: res.statusText,
        data,
        requestBody: JSON.stringify(requestBody, null, 2),
      });
      return NextResponse.json(data, { status: res.status });
    }

    console.log(
      "Successfully updated shipping address:",
      JSON.stringify(data, null, 2)
    );

    const response = NextResponse.json(data);

    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error("Error updating shipping address:", error);
    return NextResponse.json(
      { error: "Failed to update shipping address" },
      { status: 500 }
    );
  }
}
