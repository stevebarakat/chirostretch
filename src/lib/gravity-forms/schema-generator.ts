import { z } from "zod";
import type { GravityFormField } from "@/lib/graphql/queries/gravity-forms";

/**
 * Safely converts a value to a string that can be used as an object key.
 * Ensures the result is always a non-empty string.
 */
function toSafeStringKey(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return value.trim() || null;
  }

  if (typeof value === "number") {
    return String(value);
  }

  // For other types, try to convert but be safe
  try {
    const str = String(value);
    return str.trim() || null;
  } catch {
    return null;
  }
}

/**
 * Generates a minimal Zod schema from Gravity Forms metadata.
 *
 * This schema validates STRUCTURE only (field exists, correct type),
 * NOT business rules (required, email format, etc.).
 *
 * Gravity Forms is the authoritative validator for business rules.
 * This schema is a "seatbelt" - it ensures the payload shape is sane
 * before sending to WordPress.
 */
export function generateGravityFormSchema(fields: GravityFormField[]) {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    const fieldType = (field.type || field.inputType || "").toUpperCase();

    // Skip PAGE fields (they're UI only)
    if (fieldType === "PAGE") {
      continue;
    }

    // Ensure field name is a valid string key
    const fieldName = toSafeStringKey(field.id || field.databaseId);
    if (!fieldName) {
      console.warn("generateGravityFormSchema: Skipping field without valid ID", field);
      continue;
    }

    // Complex fields with sub-inputs (NAME, ADDRESS only)
    // Only treat as complex if it's actually a NAME or ADDRESS field type
    const isComplexField =
      (fieldType === "NAME" || fieldType === "ADDRESS") &&
      field.inputs &&
      field.inputs.length > 0;

    if (isComplexField) {
      const inputShape: Record<string, z.ZodTypeAny> = {};

      for (const input of field.inputs) {
        if (input.isHidden) continue;

        const inputKey = toSafeStringKey(input.key || input.id || input.name);
        if (!inputKey) continue;

        // All sub-inputs are optional strings (GF handles required validation)
        inputShape[inputKey] = z.string().optional();
      }

      // Only create object shape if we have valid input keys
      if (Object.keys(inputShape).length > 0) {
        schemaShape[fieldName] = z.object(inputShape).optional();
        continue;
      }
      // If no valid input keys, fall through to treat as regular string field
    }

    // Checkbox fields (array of strings)
    if (fieldType === "CHECKBOX") {
      schemaShape[fieldName] = z.array(z.string()).optional();
      continue;
    }

    // Consent fields (string "1" when checked, empty when not)
    if (fieldType === "CONSENT") {
      schemaShape[fieldName] = z.string().optional();
      continue;
    }

    // File upload fields (array of file objects or strings)
    if (fieldType === "FILEUPLOAD" || fieldType === "POST_IMAGE") {
      schemaShape[fieldName] = z
        .union([
          z.array(z.unknown()),
          z.string(),
          z.array(z.string()),
        ])
        .optional();
      continue;
    }

    // List field (array of arrays)
    if (fieldType === "LIST") {
      schemaShape[fieldName] = z.array(z.array(z.string())).optional();
      continue;
    }

    // All other fields: optional string
    // Note: We make everything optional because GF handles required validation
    // This schema only checks "does this field exist and is it the right type?"
    schemaShape[fieldName] = z.string().optional();
  }

  return z.object(schemaShape);
}

/**
 * Type helper to infer the form data type from a generated schema
 */
export type GravityFormData<T extends z.ZodObject<any>> = z.infer<T>;

