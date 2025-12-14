import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const WORDPRESS_URL =
  process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT?.replace("/graphql", "") ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("wp-auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (!WORDPRESS_URL) {
      return NextResponse.json(
        { error: "WordPress URL not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image." },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();

    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(file.name)}"`,
        "Content-Type": file.type,
      },
      body: Buffer.from(buffer),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("WordPress media upload error:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to upload image to WordPress" },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      attachmentId: result.id,
      sourceUrl: result.source_url,
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
