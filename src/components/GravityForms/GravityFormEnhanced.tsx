"use client";

import { useMemo, useState, useCallback, useEffect, useRef, startTransition } from "react";
import { Button } from "@/components/UI/Button";
import { FormErrors } from "@/components/UI/FormErrors";
import { useGravityForm } from "@/lib/gravity-forms";
import type { GravityFormField as GravityFormFieldType } from "@/lib/graphql/queries/gravity-forms";
import GravityFormFieldComponent from "./GravityFormField";
import styles from "./GravityForm.module.css";

type GravityFormEnhancedProps = {
  form: unknown;
  formId?: number;
  onSubmitSuccess?: (response: unknown) => void;
  submitButtonText?: string;
};

type FieldPage = {
  fields: GravityFormFieldType[];
  pageFieldId?: number;
};

function groupFieldsByPage(allFields: GravityFormFieldType[]): FieldPage[] {
  const pages: FieldPage[] = [];
  let currentPage: GravityFormFieldType[] = [];

  for (const field of allFields) {
    const fieldType = (field.type || field.inputType || "").toUpperCase();

    if (fieldType === "PAGE") {
      if (currentPage.length > 0) {
        pages.push({ fields: currentPage, pageFieldId: field.databaseId });
      }
      currentPage = [];
    } else {
      currentPage.push(field);
    }
  }

  if (currentPage.length > 0) {
    pages.push({ fields: currentPage });
  }

  return pages;
}

export function GravityFormEnhanced({
  form,
  formId,
  onSubmitSuccess,
  submitButtonText,
}: GravityFormEnhancedProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formData = useMemo(() => {
    const data = form as Record<string, unknown>;
    return (data?.gfForm || data) as Record<string, unknown>;
  }, [form]);

  const allFields = useMemo(() => {
    const formFields = (formData?.formFields as { nodes?: GravityFormFieldType[] })?.nodes || [];
    return formFields;
  }, [formData]);

  const pages = useMemo(() => groupFieldsByPage(allFields), [allFields]);
  const isMultiPage = pages.length > 1;
  const totalPages = pages.length;
  const isLastPage = currentPageIndex === totalPages - 1;
  const isFirstPage = currentPageIndex === 0;

  const allNonPageFields = useMemo(() => {
    return allFields.filter((field) => {
      const fieldType = (field.type || field.inputType || "").toUpperCase();
      return fieldType !== "PAGE";
    });
  }, [allFields]);

  const currentPageFields = useMemo(() => {
    return pages[currentPageIndex]?.fields || [];
  }, [pages, currentPageIndex]);

  // Map field IDs to their page index for error navigation
  const fieldToPageMap = useMemo(() => {
    const map: Record<string, number> = {};
    pages.forEach((page, pageIndex) => {
      page.fields.forEach((field) => {
        const fieldId = String(field.id || field.databaseId || "").trim();
        if (fieldId) {
          map[fieldId] = pageIndex;
        }
      });
    });
    return map;
  }, [pages]);

  // Map field IDs to their labels for error messages
  const fieldLabelsMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const field of allNonPageFields) {
      const fieldId = String(field.id || field.databaseId || "").trim();
      if (fieldId && field.label) {
        map[fieldId] = field.label;
      }
    }
    return map;
  }, [allNonPageFields]);

  const extractedFormId = formId || (formData?.databaseId as number);

  const fieldTypesMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const field of allNonPageFields) {
      const fieldId = String(field.id || field.databaseId || "").trim();
      if (fieldId) {
        map[fieldId] = field.type || field.inputType || "";
      }
    }
    return map;
  }, [allNonPageFields]);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    submitError,
  } = useGravityForm({
    fields: allNonPageFields,
    onSubmit: async (data) => {
      const url = "/api/gravity-forms/submit";
      const payload = {
        formId: extractedFormId,
        formData: data,
        fieldTypes: fieldTypesMap,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw {
          message:
            response.status === 404
              ? "Form submission endpoint not found."
              : `Server error (${response.status}): ${response.statusText}`,
          status: response.status,
        };
      }

      if (!response.ok) {
        throw result;
      }

      return result;
    },
    onSuccess: (response) => {
      if (response && typeof response === "object") {
        if ("confirmation_message" in response && response.confirmation_message) {
          setSuccessMessage(response.confirmation_message as string);
        } else if ("message" in response && response.message) {
          setSuccessMessage(response.message as string);
        }
      }

      if (onSubmitSuccess) {
        onSubmitSuccess(response);
      }
    },
    onError: (errorMessage) => {
      setSuccessMessage(null);
      // Error navigation will be handled by the useEffect watching errors
    },
  });

  const currentPageFieldNames = useMemo(() => {
    return currentPageFields.map((field) =>
      String(field.id || field.databaseId || "").trim()
    );
  }, [currentPageFields]);

  // Track the field to focus after navigation
  const pendingFocusFieldRef = useRef<string | null>(null);

  // Navigate to error field and scroll/focus
  const navigateToErrorField = useCallback((fieldId: string) => {
    const targetPage = fieldToPageMap[fieldId];
    if (targetPage !== undefined && targetPage !== currentPageIndex) {
      // Navigate to the page with the error - use startTransition to avoid blocking
      startTransition(() => {
        setCurrentPageIndex(targetPage);
        pendingFocusFieldRef.current = fieldId;
      });
    } else {
      // Already on the right page, just scroll to the field
      requestAnimationFrame(() => {
        const fieldElement = document.getElementById(fieldId);
        if (fieldElement) {
          fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
          fieldElement.focus();
        }
      });
    }
  }, [fieldToPageMap, currentPageIndex]);

  // Focus the pending field after page navigation
  useEffect(() => {
    if (pendingFocusFieldRef.current) {
      const fieldId = pendingFocusFieldRef.current;
      pendingFocusFieldRef.current = null;
      requestAnimationFrame(() => {
        const fieldElement = document.getElementById(fieldId);
        if (fieldElement) {
          fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
          fieldElement.focus();
        }
      });
    }
  }, [currentPageIndex]);

  // Find the first error field and navigate to it
  const handleValidationErrors = useCallback((errorFieldIds: string[]) => {
    if (errorFieldIds.length === 0) return;

    // Sort by page order, then field order
    const sortedErrors = errorFieldIds.sort((a, b) => {
      const pageA = fieldToPageMap[a] ?? Infinity;
      const pageB = fieldToPageMap[b] ?? Infinity;
      return pageA - pageB;
    });

    const firstErrorField = sortedErrors[0];
    navigateToErrorField(firstErrorField);
  }, [fieldToPageMap, navigateToErrorField]);

  // Reason this component must use useEffect:
  // - Syncing with external form validation state (React Hook Form errors)
  // - React Hook Form is an external state management library
  // - This effect watches for validation errors and navigates to the first error field
  useEffect(() => {
    const errorKeys = Object.keys(errors).filter((key) => key !== "root");
    if (errorKeys.length > 0) {
      handleValidationErrors(errorKeys);
    }
  }, [errors, handleValidationErrors]);

  // Compute if we have field errors
  const hasFieldErrors = Object.keys(errors).filter((key) => key !== "root").length > 0;

  const handleNext = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isValid = await trigger(currentPageFieldNames);
    if (isValid) {
      setCurrentPageIndex((prev) => Math.min(prev + 1, totalPages - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [trigger, currentPageFieldNames, totalPages]);

  const handlePrevious = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLastPage) {
      e.preventDefault();
    }
  }, [isLastPage]);

  // Wrap handleSubmit to prevent submission when not on last page
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    if (!isLastPage) {
      e.preventDefault();
      return;
    }
    handleSubmit(e);
  }, [isLastPage, handleSubmit]);

  if (!extractedFormId) {
    return (
      <div className={styles.error}>
        <p>Form configuration error. Please contact support.</p>
      </div>
    );
  }

  if (!allNonPageFields || allNonPageFields.length === 0) {
    return (
      <div className={styles.error}>
        <p>No form fields found. Please check the form configuration.</p>
      </div>
    );
  }

  const buttonText = submitButtonText || (formData?.submitButton as { text?: string })?.text || "Submit";

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className={styles.form}>
      {typeof formData?.description === "string" && formData.description && (
        <div className={styles.description}>{formData.description}</div>
      )}

      {isMultiPage && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentPageIndex + 1) / totalPages) * 100}%` }}
            />
          </div>
          <span className={styles.progressText}>
            Step {currentPageIndex + 1} of {totalPages}
          </span>
        </div>
      )}

      <div className={styles.fieldsContainer}>
        {currentPageFields.map((field) => {
          const fieldName = String(field.id || field.databaseId || "").trim();
          if (!fieldName) return null;

          const fieldError = errors[fieldName as keyof typeof errors];
          const errorMessage =
            fieldError && "message" in fieldError
              ? (fieldError.message as string)
              : undefined;

          return (
            <GravityFormFieldComponent
              key={fieldName}
              field={field}
              register={register}
              control={control}
              error={errorMessage}
            />
          );
        })}
      </div>

      {successMessage && (
        <div className={styles.successMessage} role="alert">
          {successMessage}
        </div>
      )}

      {(() => {
        const hasRootError = Boolean(errors.root?.message);

        // Don't show anything if there are no errors
        // Note: submitError is cleared by effect when field errors are fixed,
        // so we only show it when there truly are no field errors from submission
        if (!hasFieldErrors && !hasRootError) {
          return null;
        }

        return (
          <FormErrors
            message={
              hasFieldErrors
                ? "Please correct the following:"
                : errors.root?.message || undefined
            }
            fieldErrors={Object.entries(errors)
              .filter(([key]) => key !== "root")
              .map(([fieldId, error]) => ({
                fieldId,
                label: fieldLabelsMap[fieldId] || `Field ${fieldId}`,
                message: error && "message" in error ? (error.message as string) : "This field is required",
                page: fieldToPageMap[fieldId],
              }))}
            onFieldClick={navigateToErrorField}
            showPageNumbers={isMultiPage}
          />
        );
      })()}

      <div className={styles.navigationButtons}>
        {isMultiPage && !isFirstPage && (
          <Button type="button" color="secondary" onClick={handlePrevious}>
            Previous
          </Button>
        )}

        {isMultiPage && !isLastPage ? (
          <Button type="button" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : buttonText}
          </Button>
        )}
      </div>
    </form>
  );
}
