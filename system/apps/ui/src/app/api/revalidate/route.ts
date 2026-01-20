import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Health check for WordPress to verify Next.js is running
export async function GET() {
  return NextResponse.json({ status: "ok" });
}

export async function POST(request: NextRequest) {
  // Accept secret from header (preferred) or query param (legacy)
  const secret =
    request.headers.get("x-revalidate-secret") ||
    request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const tag = body.tag || "wordpress-content";
    const reason = body.reason || "manual";

    revalidateTag(tag, "default");

    return NextResponse.json({
      revalidated: true,
      tag,
      reason,
      now: Date.now(),
    });
  } catch (err) {
    console.error("[revalidate] error:", err);
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
