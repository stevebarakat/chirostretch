import type { FieldErrors, UseFormSetError } from "react-hook-form";

/**
 * Gravity Forms API error response structure
 * Based on GF REST API v2 error format
 */
export type GravityFormErrorResponse = {
  is_valid?: boolean;
  validation_messages?: Record<string, string>;
  error?: {
    code?: string;
    message?: string;
    data?: {
      status?: number;
      [key: string]: unknown;
    };
  };
  message?: string;
  errors?: Record<string, string | string[]>;
};

/**
 * Maps Gravity Forms API errors to React Hook Form's setError.
 *
 * Gravity Forms returns errors in various formats:
 * - validation_messages: { fieldId: "Error message" }
 * - errors: { fieldId: "Error message" | ["Error 1", "Error 2"] }
 * - error.message: Generic error message
 *
 * This function handles all formats and maps them to RHF's error state.
 */
export function mapGravityFormErrorsToRHF<T extends Record<string, unknown>>(
  errorResponse: GravityFormErrorResponse,
  setError: UseFormSetError<T>
): void {
  // Handle validation_messages (most common format)
  if (errorResponse.validation_messages) {
    for (const [fieldId, message] of Object.entries(
      errorResponse.validation_messages
    )) {
      if (typeof message === "string" && message.length > 0) {
        setError(fieldId as keyof T, {
          type: "server",
          message,
        });
      }
    }
  }

  // Handle errors object (alternative format)
  if (errorResponse.errors) {
    for (const [fieldId, errorValue] of Object.entries(errorResponse.errors)) {
      if (Array.isArray(errorValue)) {
        // Multiple errors for one field - take the first
        const message = errorValue.find((msg) => typeof msg === "string");
        if (message) {
          setError(fieldId as keyof T, {
            type: "server",
            message,
          });
        }
      } else if (typeof errorValue === "string" && errorValue.length > 0) {
        setError(fieldId as keyof T, {
          type: "server",
          message: errorValue,
        });
      }
    }
  }

  // Handle generic error message (fallback)
  if (errorResponse.error?.message && !errorResponse.validation_messages && !errorResponse.errors) {
    // If no field-specific errors, set a root-level error
    setError("root" as keyof T, {
      type: "server",
      message: errorResponse.error.message,
    });
  } else if (errorResponse.message && !errorResponse.validation_messages && !errorResponse.errors) {
    setError("root" as keyof T, {
      type: "server",
      message: errorResponse.message,
    });
  }
}

/**
 * Extracts a user-friendly error message from Gravity Forms error response.
 * Useful for displaying general submission errors.
 */
export function extractGravityFormErrorMessage(
  errorResponse: GravityFormErrorResponse
): string | null {
  if (errorResponse.error?.message) {
    return errorResponse.error.message;
  }

  if (errorResponse.message) {
    return errorResponse.message;
  }

  // If we have validation messages, return a generic message
  // (field-specific errors should be handled by mapGravityFormErrorsToRHF)
  if (errorResponse.validation_messages && Object.keys(errorResponse.validation_messages).length > 0) {
    return "Please correct the errors below and try again.";
  }

  return null;
}

