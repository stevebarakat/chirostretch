"use client";

import { useEffect, useMemo } from "react";
import GravityFormForm from "next-gravity-forms";

type GravityFormData = {
  id: string;
  databaseId?: number;
  title?: string;
  description?: string;
  formFields?: {
    nodes: Array<{
      id?: string;
      databaseId?: number;
      type?: string;
      inputType: string;
      label?: string;
      description?: string;
      isRequired?: boolean;
      placeholder?: string;
      [key: string]: unknown;
    }>;
  };
  submitButton?: {
    text?: string;
    type?: string;
    width?: string;
  };
};

type GravityFormProps = {
  form: unknown;
};

export function GravityForm({ form }: GravityFormProps) {
  // Filter out PAGE fields and ensure all fields have proper structure
  const processedForm = useMemo(() => {
    const formData = form as any; // Use any to handle nested structure

    // Handle nested gfForm structure
    const gfForm = formData?.gfForm;
    if (!gfForm?.formFields?.nodes) {
      return formData;
    }

    // Filter out PAGE type fields and clean up field structures
    const processedFields = gfForm.formFields.nodes
      .filter((field: any) => {
        const fieldType = (field.type || field.inputType || "").toUpperCase();
        return fieldType !== "PAGE";
      })
      .map((field: any) => {
        // Clean up fields with malformed inputs
        const inputs = field.inputs;
        const fieldType = (field.type || field.inputType || "").toUpperCase();

        // For CHECKBOX fields, generate inputs from choices if inputs is null/undefined/empty
        if (fieldType === "CHECKBOX") {
          const choices = field.choices;
          if ((inputs === null || inputs === undefined || (Array.isArray(inputs) && inputs.length === 0)) && choices && Array.isArray(choices)) {
            // Generate inputs from choices
            // Note: Input IDs must be integers for GraphQL API (1, 2, 3...)
            const generatedInputs = choices.map((choice: any, index: number) => ({
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
          const { inputs: _removed, ...fieldWithoutInputs } = field;
          return fieldWithoutInputs;
        }

        if (inputs && Array.isArray(inputs)) {
          // Check if any input has a null name
          const hasNullName = inputs.some(
            (input: any) =>
              input.name === null || input.name === undefined
          );

          if (hasNullName) {
            const { inputs: _removed, ...fieldWithoutInputs } = field;
            return fieldWithoutInputs;
          }
        }

        return field;
      });

    return {
      ...formData,
      gfForm: {
        ...gfForm,
        formFields: {
          ...gfForm.formFields,
          nodes: processedFields,
        },
      },
    };
  }, [form]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Form data:", form);
      console.log("Processed form data:", processedForm);

      // Debug: Log each field to find the problematic one
      const formData = processedForm as any;
      const gfForm = formData?.gfForm;
      if (gfForm?.formFields?.nodes) {
        console.log("Field details:");
        gfForm.formFields.nodes.forEach((field: any, index: number) => {
          console.log(`Field ${index + 1}:`, {
            id: field.id,
            type: field.type || field.inputType,
            label: field.label,
            inputs: field.inputs,
            choices: field.choices,
          });
        });
      }
    }
  }, [form, processedForm]);

  return <GravityFormForm data={processedForm} />;
}
