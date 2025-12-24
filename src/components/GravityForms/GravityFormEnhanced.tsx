"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/UI/Button";
import { useGravityForm } from "@/lib/gravity-forms";
import type { GravityFormField } from "@/lib/graphql/queries/gravity-forms";
import GravityFormField from "./GravityFormField";
import styles from "./GravityForm.module.css";

type GravityFormEnhancedProps = {
  form: unknown;
  formId?: number;
  onSubmitSuccess?: (response: unknown) => void;
  submitButtonText?: string;
};

/**
 * Enhanced Gravity Form component with RHF + Zod integration.
 *
 * This component:
 * - Generates a minimal Zod schema from GF metadata (structural validation only)
 * - Uses React Hook Form for form state management
 * - Maps Gravity Forms errors back to RHF on submission
 * - Provides proper error display and success handling
 */
export function GravityFormEnhanced({
  form,
  formId,
  onSubmitSuccess,
  submitButtonText,
}: GravityFormEnhancedProps) {

  // Extract form data structure (handles both nested gfForm and flat structures)
  const formData = useMemo(() => {
    const data = form as any;
    return data?.gfForm || data;
  }, [form]);

  // Extract fields and filter out PAGE fields
  const fields = useMemo(() => {
    const formFields = formData?.formFields?.nodes || [];
    return formFields.filter((field: GravityFormField) => {
      const fieldType = (field.type || field.inputType || "").toUpperCase();
      return fieldType !== "PAGE";
    }) as GravityFormField[];
  }, [formData]);

  // Extract form ID (databaseId is the numeric form ID)
  const extractedFormId = formId || formData?.databaseId;

  if (!extractedFormId) {
    console.error("GravityFormEnhanced: Form ID is required");
    return (
      <div className={styles.error}>
        <p>Form configuration error. Please contact support.</p>
      </div>
    );
  }

  if (!fields || fields.length === 0) {
    return (
      <div className={styles.error}>
        <p>No form fields found. Please check the form configuration.</p>
      </div>
    );
  }

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Build field types map for the API route
  const fieldTypesMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const field of fields) {
      const fieldId = String(field.id || field.databaseId || "").trim();
      if (fieldId) {
        map[fieldId] = field.type || field.inputType || "";
      }
    }
    return map;
  }, [fields]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    submitError,
  } = useGravityForm({
    fields,
    onSubmit: async (data) => {
      const url = "/api/gravity-forms/submit";
      const payload = {
        formId: extractedFormId,
        formData: data,
        fieldTypes: fieldTypesMap,
      };

      console.log("📤 Submitting form to:", url);
      console.log("📤 Payload:", { formId: extractedFormId, formDataKeys: Object.keys(data), fieldTypes: fieldTypesMap });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 Response status:", response.status, response.statusText);
      console.log("📥 Response URL:", response.url);

      let result;
      try {
        result = await response.json();
      } catch (error) {
        // If response is not JSON (e.g., 404 HTML page), create error object
        throw {
          message: response.status === 404
            ? "Form submission endpoint not found. Please check the API route."
            : `Server error (${response.status}): ${response.statusText}`,
          status: response.status,
        };
      }

      if (!response.ok) {
        // Throw error so error mapper can handle it
        throw result;
      }

      return result;
    },
    onSuccess: (response) => {
      // Extract success message
      if (response && typeof response === "object") {
        if ("confirmation_message" in response && response.confirmation_message) {
          setSuccessMessage(response.confirmation_message as string);
        } else if ("message" in response && response.message) {
          setSuccessMessage(response.message as string);
        }
      }

      // Call custom success handler
      if (onSubmitSuccess) {
        onSubmitSuccess(response);
      }
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      setSuccessMessage(null);
    },
  });

  const buttonText = submitButtonText || formData?.submitButton?.text || "Submit";

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {formData?.description && (
        <div className={styles.description}>{formData.description}</div>
      )}

      {fields
        .map((field) => {
          // Ensure field name is a valid string (consistent with GravityFormField)
          const fieldName = String(field.id || field.databaseId || "").trim();
          if (!fieldName) {
            console.warn("GravityFormEnhanced: Skipping field without valid ID", field);
            return null;
          }

          const fieldError = errors[fieldName as keyof typeof errors];
          const errorMessage =
            fieldError && "message" in fieldError
              ? (fieldError.message as string)
              : undefined;

          return (
            <GravityFormField
              key={fieldName}
              field={field}
              register={register}
              control={control}
              error={errorMessage}
            />
          );
        })
        .filter((field) => field !== null)}

      {successMessage && (
        <div className={styles.successMessage} role="alert">
          {successMessage}
        </div>
      )}

      {submitError && (
        <div className={styles.submitError} role="alert">
          {submitError}
        </div>
      )}

      {errors.root && (
        <div className={styles.submitError} role="alert">
          {errors.root.message}
        </div>
      )}

      <div className={styles.submitButton}>
        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? "Submitting..." : buttonText}
        </Button>
      </div>
    </form>
  );
}

