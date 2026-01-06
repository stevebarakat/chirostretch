"use client";

import React from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { GravityFormField } from "@/lib/graphql/queries/gravity-forms";
import { generateGravityFormSchema } from "./schema-generator";
import {
  mapGravityFormErrorsToRHF,
  extractGravityFormErrorMessage,
  type GravityFormErrorResponse,
} from "./error-mapper";

type UseGravityFormOptions<T extends z.ZodObject<z.ZodRawShape>> = {
  fields: GravityFormField[];
  schema?: T;
  onSubmit: (data: z.infer<T>) => Promise<unknown>;
  onSuccess?: (response: unknown) => void;
  onError?: (error: string) => void;
};

type UseGravityFormReturn<T extends z.ZodObject<z.ZodRawShape>> = Omit<UseFormReturn<z.infer<T>>, "handleSubmit"> & {
  submitError: string | null;
  clearSubmitError: () => void;
  handleSubmit: ReturnType<UseFormReturn<z.infer<T>>["handleSubmit"]>;
};

/**
 * React Hook Form + Zod + Gravity Forms integration hook.
 *
 * This hook:
 * 1. Generates a minimal Zod schema from GF metadata (or uses provided schema)
 * 2. Sets up RHF with Zod resolver for structural validation
 * 3. Handles submission and maps GF errors back to RHF
 *
 * Philosophy:
 * - Zod validates structure (seatbelt)
 * - RHF manages form state (steering wheel)
 * - Gravity Forms validates business rules (the law)
 */
export function useGravityForm<T extends z.ZodObject<z.ZodRawShape>>({
  fields,
  schema,
  onSubmit,
  onSuccess,
  onError,
}: UseGravityFormOptions<T>): UseGravityFormReturn<T> {
  // Generate schema if not provided
  const formSchema = schema || (generateGravityFormSchema(fields) as unknown as T);

  const form = useForm<z.infer<T>>({
    // @ts-expect-error - zodResolver type incompatibility with dynamic schema generation
    resolver: zodResolver(formSchema as z.ZodType<z.infer<T>>),
    mode: "onBlur",
  });

  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const clearSubmitError = React.useCallback(() => {
    setSubmitError(null);
  }, []);

  // Wrap the onSubmit to handle GF error mapping
  const wrappedOnSubmit = React.useCallback(
    async (data: z.infer<T>) => {
      setSubmitError(null);

      try {
        const response = await onSubmit(data);

        // Check if response indicates an error
        if (
          response &&
          typeof response === "object" &&
          "is_valid" in response &&
          !response.is_valid
        ) {
          // Map GF errors to RHF
          mapGravityFormErrorsToRHF(
            response as GravityFormErrorResponse,
            form.setError
          );

          // Extract general error message
          const errorMessage = extractGravityFormErrorMessage(
            response as GravityFormErrorResponse
          );
          if (errorMessage) {
            setSubmitError(errorMessage);
            onError?.(errorMessage);
          }
          return;
        }

        // Success
        onSuccess?.(response);
      } catch (error) {
        // Check if this is a structured error response from the API
        if (
          error &&
          typeof error === "object" &&
          "is_valid" in error &&
          !(error as GravityFormErrorResponse).is_valid
        ) {
          // Map field-specific errors to RHF
          mapGravityFormErrorsToRHF(
            error as GravityFormErrorResponse,
            form.setError
          );

          // Extract general error message
          const errorMessage = extractGravityFormErrorMessage(
            error as GravityFormErrorResponse
          );
          if (errorMessage) {
            setSubmitError(errorMessage);
            onError?.(errorMessage);
          }
          return;
        }

        // Handle other errors (network errors, etc.)
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "object" && error !== null && "message" in error
              ? String((error as { message: unknown }).message)
              : "An error occurred while submitting the form.";

        setSubmitError(errorMessage);
        onError?.(errorMessage);
        form.setError("root", {
          type: "server",
          message: errorMessage,
        });
      }
    },
    [form, onSubmit, onSuccess, onError]
  );

  // Use RHF's handleSubmit with our wrapped onSubmit
  const handleSubmit = form.handleSubmit(
    wrappedOnSubmit as Parameters<typeof form.handleSubmit>[0]
  );

  return {
    ...form,
    submitError,
    clearSubmitError,
    handleSubmit,
  } as UseGravityFormReturn<T>;
}

