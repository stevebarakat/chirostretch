"use client";

import { useMemo } from "react";
import GravityFormForm from "next-gravity-forms";

type GravityFormChoice = {
  text?: string;
  value?: string;
  [key: string]: unknown;
};

type GravityFormInput = {
  id?: number | string;
  label?: string;
  name?: string | null;
  [key: string]: unknown;
};

type GravityFormField = {
  id?: string;
  databaseId?: number;
  type?: string;
  inputType?: string;
  label?: string;
  description?: string;
  isRequired?: boolean;
  placeholder?: string;
  choices?: GravityFormChoice[];
  inputs?: GravityFormInput[] | null;
  [key: string]: unknown;
};

type GravityFormGfForm = {
  formFields?: {
    nodes?: GravityFormField[];
  };
  submitButton?: {
    text?: string;
    type?: string;
    width?: string;
  };
  [key: string]: unknown;
};

type GravityFormData = {
  gfForm?: GravityFormGfForm;
  [key: string]: unknown;
};

type GravityFormProps = {
  form: unknown;
};

export function GravityForm({ form }: GravityFormProps) {
  // Filter out PAGE fields and ensure all fields have proper structure
  const processedForm = useMemo(() => {
    const formData = form as GravityFormData;

    // Handle nested gfForm structure
    const gfForm = formData?.gfForm;
    if (!gfForm?.formFields?.nodes) {
      return formData;
    }

    // Filter out PAGE type fields and clean up field structures
    const processedFields = (gfForm.formFields.nodes || [])
      .filter((field) => {
        const fieldType = (field.type || field.inputType || "").toUpperCase();
        return fieldType !== "PAGE";
      })
      .map((field) => {
        // Clean up fields with malformed inputs
        const inputs = field.inputs;
        const fieldType = (field.type || field.inputType || "").toUpperCase();

        // For CHECKBOX fields, generate inputs from choices if inputs is null/undefined/empty
        if (fieldType === "CHECKBOX") {
          const choices = field.choices;
          if (
            (inputs === null ||
              inputs === undefined ||
              (Array.isArray(inputs) && inputs.length === 0)) &&
            choices &&
            Array.isArray(choices)
          ) {
            // Generate inputs from choices
            // Note: Input IDs must be integers for GraphQL API (1, 2, 3...)
            const generatedInputs = choices.map((choice, index: number) => ({
              id: index + 1,
              label: choice.text,
              name: `input_${field.id}_${index + 1}`,
            }));
            return {
              ...field,
              inputs: generatedInputs,
            };
          }
        }

        // Remove inputs if it's null or an array with null names (for non-checkbox fields)
        if (inputs === null) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { inputs: _removed, ...fieldWithoutInputs } = field;
          return fieldWithoutInputs;
        }

        if (inputs && Array.isArray(inputs)) {
          // Check if any input has a null name
          const hasNullName = inputs.some(
            (input) => input.name === null || input.name === undefined
          );

          if (hasNullName) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { inputs: _removed, ...fieldWithoutInputs } = field;
            return fieldWithoutInputs;
          }
        }

        return field;
      });

    // Update submit button text for New Patient Offer form
    const updatedSubmitButton = gfForm.submitButton
      ? {
          ...gfForm.submitButton,
          text:
            gfForm.submitButton.text === "Submit"
              ? "Claim Your Offer"
              : gfForm.submitButton.text,
        }
      : {
          text: "Claim Your Offer",
          type: "text",
        };

    return {
      ...formData,
      gfForm: {
        ...gfForm,
        formFields: {
          ...gfForm.formFields,
          nodes: processedFields,
        },
        submitButton: updatedSubmitButton,
      },
    };
  }, [form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <GravityFormForm data={processedForm as any} />;
}
