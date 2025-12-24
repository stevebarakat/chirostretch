"use client";

import { useController, Control, UseFormRegister } from "react-hook-form";
import { type GravityFormField as GravityFormFieldType } from "@/lib/graphql/queries";
import { Input } from "@/components/UI/Input";
import { FormField } from "@/components/UI/FormField";
import styles from "./GravityFormField.module.css";

type GravityFormFieldProps = {
  field: GravityFormFieldType;
  register: UseFormRegister<Record<string, unknown>>;
  control: Control<Record<string, unknown>>;
  error?: string;
};

/**
 * Safely converts a value to a string that can be used as a field name.
 * Ensures the result is always a non-empty string.
 */
function toSafeFieldName(value: unknown): string | null {
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

export default function GravityFormField({
  field,
  register,
  control,
  error,
}: GravityFormFieldProps) {
  // Ensure field.id is a valid string (React Hook Form requires string names)
  const fieldName = toSafeFieldName(field.id || field.databaseId);

  if (!fieldName) {
    console.error("GravityFormField: Field ID is required", field);
    return null;
  }

  const { field: controllerField } = useController({
    name: fieldName,
    control,
    defaultValue:
      field.inputType === "checkbox"
        ? []
        : field.inputType === "address" || field.inputType === "NAME"
        ? {}
        : "",
  });

  if (
    (field.inputType === "address" || field.inputType === "NAME") &&
    field.inputs
  ) {
    const addressValue =
      (controllerField.value as Record<string, string>) || {};
    return (
      <FormField
        label={field.label}
        required={field.isRequired}
        description={field.description || undefined}
        error={error}
      >
        <div className={styles.nameInputs}>
          {field.inputs
            .filter((input) => !input.isHidden)
            .map((input) => {
              const key = input.key || input.id || "";
              return (
                <FormField
                  key={key}
                  label={input.label || input.customLabel || undefined}
                >
                  <Input
                    type="text"
                    value={addressValue[key] || input.defaultValue || ""}
                    onChange={(e) =>
                      controllerField.onChange({
                        ...addressValue,
                        [key]: e.target.value,
                      })
                    }
                    onBlur={controllerField.onBlur}
                    autoComplete={input.autocompleteAttribute}
                  />
                </FormField>
              );
            })}
        </div>
      </FormField>
    );
  }

  if (field.inputType === "checkbox" && field.choices) {
    const values = (
      Array.isArray(controllerField.value) ? controllerField.value : []
    ) as string[];
    return (
      <div className={styles.field}>
        {field.label && (
          <label className={styles.label}>
            {field.label}
            {field.isRequired && <span className={styles.required}>*</span>}
          </label>
        )}
        {field.description && (
          <p className={styles.description}>{field.description}</p>
        )}
        <div className={styles.checkboxGroup}>
          {field.choices.map((choice) => (
            <label key={choice.value} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={values.includes(choice.value)}
                onChange={(e) => {
                  const newValues = e.target.checked
                    ? [...values, choice.value]
                    : values.filter((v) => v !== choice.value);
                  controllerField.onChange(newValues);
                }}
                onBlur={controllerField.onBlur}
                className={styles.checkbox}
              />
              {choice.text}
            </label>
          ))}
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }

  if (field.inputType === "radio" && field.choices) {
    return (
      <div className={styles.field}>
        {field.label && (
          <label className={styles.label}>
            {field.label}
            {field.isRequired && <span className={styles.required}>*</span>}
          </label>
        )}
        {field.description && (
          <p className={styles.description}>{field.description}</p>
        )}
        <div className={styles.radioGroup}>
          {field.choices.map((choice) => (
            <label key={choice.value} className={styles.radioLabel}>
              <input
                type="radio"
                {...register(fieldName)}
                value={choice.value}
                className={styles.radio}
              />
              {choice.text}
            </label>
          ))}
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }

  if (field.inputType === "select" && field.choices) {
    return (
      <FormField
        label={field.label}
        required={field.isRequired}
        description={field.description || undefined}
        error={error}
        htmlFor={fieldName}
      >
        <Input
          as="select"
          {...register(fieldName)}
          id={fieldName}
          error={!!error}
        >
          <option value="">Select...</option>
          {field.choices.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.text}
            </option>
          ))}
        </Input>
      </FormField>
    );
  }

  if (field.inputType === "textarea") {
    return (
      <FormField
        label={field.label}
        required={field.isRequired}
        description={field.description || undefined}
        error={error}
        htmlFor={fieldName}
      >
        <Input
          as="textarea"
          {...register(fieldName)}
          id={fieldName}
          rows={5}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          error={!!error}
        />
      </FormField>
    );
  }

  return (
    <FormField
      label={field.label}
      required={field.isRequired}
      description={field.description || undefined}
      error={error}
      htmlFor={field.id}
    >
      <Input
        {...register(fieldName)}
        type={
          field.inputType === "email"
            ? "email"
            : field.inputType === "tel"
            ? "tel"
            : field.inputType === "url"
            ? "url"
            : field.inputType === "number"
            ? "number"
            : "text"
        }
        id={fieldName}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        error={!!error}
      />
    </FormField>
  );
}
