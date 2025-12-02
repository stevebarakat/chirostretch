import { NextRequest, NextResponse } from "next/server";

const WORDPRESS_URL =
  process.env.WORDPRESS_GRAPHQL_ENDPOINT?.replace("/graphql", "") ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function GET() {
  return NextResponse.json({
    message: "Gravity Forms submit endpoint. Use POST to submit forms.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, formData } = body;

    if (!formId || !formData) {
      return NextResponse.json(
        { message: "Form ID and form data are required." },
        { status: 400 }
      );
    }

    if (!WORDPRESS_URL) {
      return NextResponse.json(
        { message: "WordPress URL is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/gf/v2/forms/${formId}/submissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          message:
            errorData.message ||
            "Failed to submit form. Please try again later.",
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully.",
      confirmation_message: result.confirmation_message,
    });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while submitting the form.",
      },
      { status: 500 }
    );
  }
}
