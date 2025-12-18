"use client";

import { useController, Control, UseFormRegister } from "react-hook-form";
import { type GravityFormField as GravityFormFieldType } from "@/lib/graphql/queries";
import styles from "./GravityFormField.module.css";

type GravityFormFieldProps = {
  field: GravityFormFieldType;
  register: UseFormRegister<Record<string, unknown>>;
  control: Control<Record<string, unknown>>;
  error?: string;
};

export default function GravityFormField({
  field,
  register,
  control,
  error,
}: GravityFormFieldProps) {
  const { field: controllerField } = useController({
    name: field.id,
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
        <div className={styles.addressFields}>
          {field.inputs
            .filter((input) => !input.isHidden)
            .map((input) => {
              const key = input.key || input.id || "";
              return (
                <div key={key} className={styles.nameInput}>
                  <label className={styles.label}>
                    {input.label || input.customLabel}
                  </label>
                  <input
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
                    className={styles.input}
                  />
                </div>
              );
            })}
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
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
                {...register(field.id)}
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
      <div className={styles.field}>
        {field.label && (
          <label htmlFor={field.id} className={styles.label}>
            {field.label}
            {field.isRequired && <span className={styles.required}>*</span>}
          </label>
        )}
        {field.description && (
          <p className={styles.description}>{field.description}</p>
        )}
        <select {...register(field.id)} id={field.id} className={styles.select}>
          <option value="">Select...</option>
          {field.choices.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.text}
            </option>
          ))}
        </select>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }

  if (field.inputType === "textarea") {
    return (
      <div className={styles.field}>
        {field.label && (
          <label htmlFor={field.id} className={styles.label}>
            {field.label}
            {field.isRequired && <span className={styles.required}>*</span>}
          </label>
        )}
        {field.description && (
          <p className={styles.description}>{field.description}</p>
        )}
        <textarea
          {...register(field.id)}
          id={field.id}
          rows={5}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          className={styles.textarea}
        />
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }

  return (
    <div className={styles.field}>
      {field.label && (
        <label htmlFor={field.id} className={styles.label}>
          {field.label}
          {field.isRequired && <span className={styles.required}>*</span>}
        </label>
      )}
      {field.description && (
        <p className={styles.description}>{field.description}</p>
      )}
      <input
        {...register(field.id)}
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
        id={field.id}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        className={styles.input}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
