import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const WP_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(`${WP_URL}/wp-json/wc-bookings/v1/products`, {
      method: "GET",
      headers: {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Bookings API error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch bookable products" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching bookable products:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookable products" },
      { status: 500 }
    );
  }
}
