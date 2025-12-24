import { NextRequest, NextResponse } from "next/server";

// Ensure this route is dynamic
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT;

// Field types that need special value mapping
const EMAIL_FIELD_TYPES = ["EMAIL"];

type FieldValueInput = {
  id: number;
  value?: string;
  values?: string[];
  emailValues?: { value: string; confirmationValue?: string };
  checkboxValues?: Array<{ inputId: number; value: string }>;
};

// Extract numeric field ID from key (handles both numeric IDs and base64 GraphQL IDs)
function extractFieldId(key: string): number | null {
  // If already numeric
  const numericId = parseInt(key, 10);
  if (!isNaN(numericId)) {
    return numericId;
  }

  // Try to decode base64 GraphQL ID (format: gf_form_field:formId:fieldId)
  try {
    const decoded = Buffer.from(key, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length === 3 && parts[0] === "gf_form_field") {
      const fieldId = parseInt(parts[2], 10);
      if (!isNaN(fieldId)) {
        return fieldId;
      }
    }
  } catch {
    // Not a valid base64 string
  }

  return null;
}

// Transform form data object to GraphQL fieldValues array
function transformFormDataToFieldValues(
  formData: Record<string, unknown>,
  fieldTypes?: Record<string, string>
): FieldValueInput[] {
  return Object.entries(formData)
    .map(([key, value]) => {
      const fieldId = extractFieldId(key);
      if (fieldId === null) return null;

      const fieldType = fieldTypes?.[key]?.toUpperCase();

      // Handle email fields specially
      if (fieldType && EMAIL_FIELD_TYPES.includes(fieldType)) {
        return {
          id: fieldId,
          emailValues: { value: String(value || "") },
        } as FieldValueInput;
      }

      // Handle checkbox fields (array of values)
      if (Array.isArray(value)) {
        return {
          id: fieldId,
          values: value.map(String),
        } as FieldValueInput;
      }

      // Default: simple value field
      return {
        id: fieldId,
        value: String(value || ""),
      } as FieldValueInput;
    })
    .filter((item): item is FieldValueInput => item !== null);
}

export async function GET() {
  return NextResponse.json({
    message: "Gravity Forms submit endpoint. Use POST to submit forms.",
  });
}

export async function POST(request: NextRequest) {
  console.log("📝 [ROUTE] Gravity Forms submit endpoint - POST request received");

  try {
    const body = await request.json();
    console.log("📝 [ROUTE] Request body received:", {
      formId: body.formId,
      hasFormData: !!body.formData,
    });
    const { formId, formData, fieldTypes } = body;

    if (!formId || !formData) {
      return NextResponse.json(
        { message: "Form ID and form data are required." },
        { status: 400 }
      );
    }

    if (!GRAPHQL_ENDPOINT) {
      return NextResponse.json(
        { message: "GraphQL endpoint is not configured." },
        { status: 500 }
      );
    }

    // Transform form data to GraphQL fieldValues format
    const fieldValues = transformFormDataToFieldValues(formData, fieldTypes);
    console.log("📝 [ROUTE] Transformed fieldValues:", fieldValues);

    // GraphQL mutation for form submission
    const mutation = `
      mutation SubmitGfForm($id: ID!, $fieldValues: [FormFieldValuesInput]!) {
        submitGfForm(input: { id: $id, fieldValues: $fieldValues }) {
          errors {
            id
            message
          }
          entry {
            ... on GfSubmittedEntry {
              databaseId
            }
          }
          confirmation {
            type
            message
            url
          }
        }
      }
    `;

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          id: String(formId),
          fieldValues,
        },
      }),
    });

    const result = await response.json();
    console.log("📝 [ROUTE] GraphQL response:", JSON.stringify(result, null, 2));

    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      console.error("GraphQL errors:", result.errors);
      return NextResponse.json(
        {
          is_valid: false,
          message: result.errors[0]?.message || "Failed to submit form.",
          errors: result.errors,
        },
        { status: 400 }
      );
    }

    // Check for form validation errors
    const submitResult = result.data?.submitGfForm;
    if (submitResult?.errors && submitResult.errors.length > 0) {
      console.log("📝 [ROUTE] Validation errors:", submitResult.errors);

      // Transform GF GraphQL errors to the format expected by error mapper
      const validationMessages: Record<string, string> = {};
      for (const error of submitResult.errors) {
        if (error.id) {
          validationMessages[error.id] = error.message;
        }
      }

      return NextResponse.json(
        {
          is_valid: false,
          validation_messages: validationMessages,
          message: "Please correct the errors below.",
        },
        { status: 400 }
      );
    }

    // Success
    const confirmation = submitResult?.confirmation;
    return NextResponse.json({
      success: true,
      message: "Form submitted successfully.",
      confirmation_message: confirmation?.message || "Thank you for your submission!",
      confirmation_type: confirmation?.type,
      confirmation_url: confirmation?.url,
      entry_id: submitResult?.entry?.databaseId,
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
