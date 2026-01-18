import { NextRequest, NextResponse } from "next/server";

// Ensure this route is dynamic
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT;
const WP_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const INTERNAL_SECRET = process.env.CHIROSTRETCH_INTERNAL_SECRET || "";

// Form 17 is the New Patient Special form
const NEW_PATIENT_FORM_ID = "17";

// Field types that need special value mapping
const EMAIL_FIELD_TYPES = ["EMAIL"];
const CONSENT_FIELD_TYPES = ["CONSENT"];
const CHECKBOX_FIELD_TYPES = ["CHECKBOX"];
const NAME_FIELD_TYPES = ["NAME"];
const PHONE_FIELD_TYPES = ["PHONE"];

// Normalize phone number to US format (###) ###-####
function normalizePhone(phone: string): string {
  // Strip everything except digits
  const digits = phone.replace(/\D/g, "");

  // Remove leading 1 if present (US country code)
  const normalized = digits.startsWith("1") && digits.length === 11
    ? digits.slice(1)
    : digits;

  // Format as (###) ###-#### if we have 10 digits
  if (normalized.length === 10) {
    return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`;
  }

  // Return cleaned digits if not 10 digits (let GF validate)
  return normalized;
}

type NameValues = {
  first?: string;
  last?: string;
  middle?: string;
  prefix?: string;
  suffix?: string;
};

type FieldValueInput = {
  id: number;
  value?: string;
  values?: string[];
  emailValues?: { value: string; confirmationValue?: string };
  checkboxValues?: Array<{ inputId: number; value: string }>;
  nameValues?: NameValues;
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

      // Handle email fields
      if (fieldType && EMAIL_FIELD_TYPES.includes(fieldType)) {
        return {
          id: fieldId,
          emailValues: { value: String(value || "") },
        } as FieldValueInput;
      }

      // Handle consent fields - single checkbox with value "1"
      if (fieldType && CONSENT_FIELD_TYPES.includes(fieldType)) {
        const isChecked = value === "1" || value === true;
        return {
          id: fieldId,
          checkboxValues: isChecked
            ? [{ inputId: parseFloat(`${fieldId}.1`), value: "1" }]
            : [],
        } as FieldValueInput;
      }

      // Handle checkbox fields (array of selected values)
      if (fieldType && CHECKBOX_FIELD_TYPES.includes(fieldType)) {
        const valuesArray = Array.isArray(value) ? value : value ? [value] : [];
        const checkboxValues = valuesArray.map((v, index) => ({
          inputId: parseFloat(`${fieldId}.${index + 1}`),
          value: String(v),
        }));
        return {
          id: fieldId,
          checkboxValues,
        } as FieldValueInput;
      }

      // Handle name fields
      if (fieldType && NAME_FIELD_TYPES.includes(fieldType)) {
        // Value could be an object with first/last or a simple string
        if (typeof value === "object" && value !== null) {
          const nameObj = value as Record<string, unknown>;
          return {
            id: fieldId,
            nameValues: {
              first: String(nameObj.first || ""),
              last: String(nameObj.last || ""),
              middle: nameObj.middle ? String(nameObj.middle) : undefined,
              prefix: nameObj.prefix ? String(nameObj.prefix) : undefined,
              suffix: nameObj.suffix ? String(nameObj.suffix) : undefined,
            },
          } as FieldValueInput;
        }
        // Simple string - treat as first name only
        return {
          id: fieldId,
          nameValues: {
            first: String(value || ""),
          },
        } as FieldValueInput;
      }

      // Handle phone fields - normalize to US format
      if (fieldType && PHONE_FIELD_TYPES.includes(fieldType)) {
        return {
          id: fieldId,
          value: normalizePhone(String(value || "")),
        } as FieldValueInput;
      }

      // Handle arrays (multi-select, etc.)
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

// Types for new patient lead processing
type NewPatientLeadData = {
  entry_id: string;
  email: string;
  first_name: string;
};

type CouponResponse = {
  success: boolean;
  coupon_code: string;
  discount_amount: number;
  final_price: number;
  expires?: string;
  existing?: boolean;
};

type UserRegistrationResponse = {
  success: boolean;
  user_id: number;
  username: string;
  email: string;
  display_name?: string;
  existing?: boolean;
  message: string;
};

/**
 * Process User Registration feed for new patient leads
 * Creates a WordPress user account from the Gravity Forms entry
 */
async function processUserRegistration(
  entryId: string,
  formId: string
): Promise<UserRegistrationResponse | null> {
  if (!WP_URL) {
    console.error("[Lead] WP_URL not configured for user registration");
    return null;
  }

  try {
    const response = await fetch(
      `${WP_URL}/wp-json/chirostretch/v1/user-registration/process`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Secret": INTERNAL_SECRET,
        },
        body: JSON.stringify({
          entry_id: parseInt(entryId, 10),
          form_id: parseInt(formId, 10),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Lead] Failed to process user registration:", errorData);
      return null;
    }

    const userData = (await response.json()) as UserRegistrationResponse;
    console.log("[Lead] User registration processed:", {
      user_id: userData.user_id,
      existing: userData.existing,
    });

    return userData;
  } catch (error) {
    console.error("[Lead] Error processing user registration:", error);
    return null;
  }
}

/**
 * Generate a coupon for new patient leads via WP REST API
 */
async function generateCoupon(
  data: NewPatientLeadData
): Promise<CouponResponse | null> {
  if (!data.email) {
    console.warn("[Lead] No email address provided, skipping coupon generation");
    return null;
  }

  if (!WP_URL) {
    console.error("[Lead] WP_URL not configured");
    return null;
  }

  try {
    const response = await fetch(
      `${WP_URL}/wp-json/chirostretch/v1/coupons/new-patient`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Secret": INTERNAL_SECRET,
        },
        body: JSON.stringify({
          email: data.email,
          first_name: data.first_name,
          entry_id: data.entry_id,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Lead] Failed to generate coupon:", errorText);
      return null;
    }

    const couponData = (await response.json()) as CouponResponse;
    console.log("[Lead] Coupon generated:", {
      code: couponData.coupon_code,
      existing: couponData.existing,
    });

    return couponData;
  } catch (error) {
    console.error("[Lead] Error generating coupon:", error);
    return null;
  }
}

type LeadProcessingResult = {
  user?: UserRegistrationResponse | null;
  coupon?: CouponResponse | null;
};

/**
 * Process new patient lead - create user account and generate coupon
 */
async function processNewPatientLead(data: NewPatientLeadData & { form_id: string }): Promise<LeadProcessingResult> {
  console.log("[Lead] Processing new patient lead:", {
    entry_id: data.entry_id,
    email: data.email,
    first_name: data.first_name,
  });

  // First, create the user account via User Registration feed
  const user = await processUserRegistration(data.entry_id, data.form_id);

  if (user) {
    console.log("[Lead] User account created/found:", {
      user_id: user.user_id,
      existing: user.existing,
    });
  } else {
    console.warn("[Lead] User registration failed or skipped");
  }

  // Then generate the coupon
  const coupon = await generateCoupon(data);

  if (coupon) {
    console.log("[Lead] Lead processing complete:", {
      entry_id: data.entry_id,
      coupon_code: coupon.coupon_code,
      user_id: user?.user_id,
    });
  } else {
    console.warn("[Lead] Lead processed but coupon generation failed");
  }

  return { user, coupon };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, formData, fieldTypes } = body;

    console.log("[GF Submit] Received:", { formId, formData, fieldTypes });

    if (!formId || !formData) {
      console.log("[GF Submit] Missing formId or formData");
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

    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      console.error("[GF Submit] GraphQL errors:", result.errors);
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
      console.log("[GF Submit] Validation errors:", submitResult.errors);
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

    // Success - process special form handlers
    const entryId = submitResult?.entry?.databaseId;
    const confirmation = submitResult?.confirmation;

    // For form 17 (New Patient Special), process lead and return custom confirmation
    if (String(formId) === NEW_PATIENT_FORM_ID && entryId) {
      const email = String(formData["3"] || "");
      const firstName = String(formData["1"] || "");

      // Process synchronously so we can include coupon in response
      const leadResult = await processNewPatientLead({
        entry_id: String(entryId),
        form_id: String(formId),
        email,
        first_name: firstName,
      });

      const couponCode = leadResult.coupon?.coupon_code;
      const couponExpires = leadResult.coupon?.expires;

      // Return structured data - frontend renders with proper components
      return NextResponse.json({
        success: true,
        confirmation_type: "new_patient_special",
        entry_id: entryId,
        lead: {
          first_name: firstName,
          email,
          coupon_code: couponCode,
          coupon_expires: couponExpires,
        },
      });
    }

    // Default response for other forms
    return NextResponse.json({
      success: true,
      message: "Form submitted successfully.",
      confirmation_message: confirmation?.message || "Thank you for your submission!",
      confirmation_type: confirmation?.type,
      confirmation_url: confirmation?.url,
      entry_id: entryId,
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
