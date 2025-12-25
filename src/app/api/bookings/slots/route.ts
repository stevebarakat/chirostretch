import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const WP_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://chirostretch-copy.local";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!productId) {
    return NextResponse.json(
      { error: "productId is required" },
      { status: 400 }
    );
  }

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "startDate and endDate are required" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const url = new URL(`${WP_URL}/wp-json/chirostretch/v1/bookings/slots`);
    url.searchParams.set("productId", productId);
    url.searchParams.set("startDate", startDate);
    url.searchParams.set("endDate", endDate);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Slots API error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch slots" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 }
    );
  }
}
