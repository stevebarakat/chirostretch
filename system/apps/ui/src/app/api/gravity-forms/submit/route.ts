import { NextRequest, NextResponse } from "next/server";
import {
  executeMutation,
  GENERATE_NEW_PATIENT_COUPON,
  GenerateNewPatientCouponResult,
} from "@/lib/graphql/mutations";

// Ensure this route is dynamic
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT;

// Form IDs
const NEW_PATIENT_FORM_ID = "17";
const FRANCHISE_FORM_ID = "16";
const CONTACT_FORM_ID = "18";

// Known field types for specific forms (field ID -> type)
// This ensures proper normalization even if frontend doesn't pass fieldTypes
const FORM_FIELD_TYPES: Record<string, Record<string, string>> = {
  "17": {
    "1": "NAME",
    "3": "EMAIL",
    "4": "PHONE",
  },
  "16": {
    "1": "TEXT", // First Name
    "2": "TEXT", // Last Name
    "3": "EMAIL",
  },
  "18": {
    "1": "SELECT",
    "2": "NAME",
    "3": "EMAIL",
    "4": "PHONE",
    "5": "TEXT",
    "6": "TEXTAREA",
    "7": "SELECT",
  },
};

// Field types that need special value mapping
const EMAIL_FIELD_TYPES = ["EMAIL"];
const CONSENT_FIELD_TYPES = ["CONSENT"];
const CHECKBOX_FIELD_TYPES = ["CHECKBOX"];
const NAME_FIELD_TYPES = ["NAME"];
const PHONE_FIELD_TYPES = ["PHONE"];

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
  formId: string,
  fieldTypes?: Record<string, string>
): FieldValueInput[] {
  // Merge known form field types with passed fieldTypes (passed types take precedence)
  const knownTypes = FORM_FIELD_TYPES[formId] || {};
  const mergedFieldTypes = { ...knownTypes, ...fieldTypes };

  return Object.entries(formData)
    .map(([key, value]) => {
      const fieldId = extractFieldId(key);
      if (fieldId === null) return null;

      const fieldType = mergedFieldTypes[key]?.toUpperCase();

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

      // Handle phone fields - normalize to standard US format if possible
      if (fieldType && PHONE_FIELD_TYPES.includes(fieldType)) {
        let phone = String(value || "").trim();
        // Extract just digits
        const digits = phone.replace(/\D/g, "");
        // If 11 digits starting with 1, strip the country code
        // If 10 digits, format as (xxx) xxx-xxxx
        if (digits.length === 11 && digits.startsWith("1")) {
          const local = digits.slice(1);
          phone = `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
        } else if (digits.length === 10) {
          phone = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        return {
          id: fieldId,
          value: phone,
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

/**
 * Generate a coupon for new patient leads via GraphQL mutation
 */
async function generateCoupon(
  data: NewPatientLeadData
): Promise<CouponResponse | null> {
  if (!data.email) {
    console.warn("[Lead] No email address provided, skipping coupon generation");
    return null;
  }

  try {
    const result = await executeMutation<GenerateNewPatientCouponResult>(
      GENERATE_NEW_PATIENT_COUPON,
      {
        email: data.email,
        firstName: data.first_name,
        entryId: data.entry_id,
      },
      { includeInternalSecret: true }
    );

    const coupon = result.generateNewPatientCoupon;

    if (!coupon.success) {
      console.error("[Lead] Failed to generate coupon:", coupon.error || coupon.message);
      return null;
    }

    return {
      success: true,
      coupon_code: coupon.couponCode || "",
      discount_amount: coupon.discountAmount || 0,
      final_price: coupon.finalPrice || 29,
      expires: coupon.expires || undefined,
      existing: coupon.existing || false,
    };
  } catch (error) {
    console.error("[Lead] Error generating coupon:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    const fieldValues = transformFormDataToFieldValues(formData, String(formId), fieldTypes);

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

    // For form 17 (New Patient Special), generate coupon and return custom confirmation
    // Lead creation is now handled via Zoho CRM feed on form submission
    if (String(formId) === NEW_PATIENT_FORM_ID && entryId) {
      const email = String(formData["3"] || "");
      const firstName = String(formData["1"] || "");

      // Generate coupon for the new patient
      const couponResult = await generateCoupon({
        entry_id: String(entryId),
        email,
        first_name: firstName,
      });

      const couponCode = couponResult?.coupon_code;
      const couponExpires = couponResult?.expires;

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

    // For form 16 (Franchise Application), return custom confirmation for GA tracking
    if (String(formId) === FRANCHISE_FORM_ID) {
      const firstName = String(formData["1"] || "");
      const email = String(formData["3"] || "");

      return NextResponse.json({
        success: true,
        confirmation_type: "franchise_application",
        entry_id: entryId,
        first_name: firstName,
        email,
      });
    }

    // For form 18 (Contact), return custom confirmation for GA tracking
    if (String(formId) === CONTACT_FORM_ID) {
      // Field 2 is NAME type with first/last subfields
      const nameField = formData["2"];
      let firstName = "";
      if (typeof nameField === "object" && nameField !== null) {
        firstName = String((nameField as Record<string, unknown>).first || "");
      } else {
        firstName = String(nameField || "");
      }

      return NextResponse.json({
        success: true,
        confirmation_type: "contact",
        entry_id: entryId,
        first_name: firstName,
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
