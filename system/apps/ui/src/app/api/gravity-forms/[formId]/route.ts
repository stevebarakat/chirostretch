import { NextResponse } from "next/server";
import { getGravityForm } from "next-gravity-forms/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    const formIdNum = parseInt(formId, 10);

    if (isNaN(formIdNum)) {
      return NextResponse.json(
        { error: "Invalid form ID" },
        { status: 400 }
      );
    }

    const form = await getGravityForm(formIdNum);

    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error fetching Gravity Form:", error);
    return NextResponse.json(
      { error: "Failed to fetch form" },
      { status: 500 }
    );
  }
}
