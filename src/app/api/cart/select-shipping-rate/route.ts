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

    if (!body.rate_id) {
      return NextResponse.json(
        { error: "rate_id is required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${WP_URL}/wp-json/wc/store/v1/cart/select-shipping-rate`,
      {
        method: "POST",
        headers: {
          ...(cookieHeader ? { cookie: cookieHeader } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rate_id: body.rate_id }),
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Error selecting shipping rate:", {
        status: res.status,
        statusText: res.statusText,
        data,
      });
      return NextResponse.json(data, { status: res.status });
    }

    const response = NextResponse.json(data);

    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error("Error selecting shipping rate:", error);
    return NextResponse.json(
      { error: "Failed to select shipping rate" },
      { status: 500 }
    );
  }
}
