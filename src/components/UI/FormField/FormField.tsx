import * as React from "react";
import { ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./FormField.module.css";

type FormFieldProps = {
  label?: string;
  required?: boolean;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
};

export function FormField({
  label,
  required,
  description,
  error,
  children,
  className,
  htmlFor,
}: FormFieldProps) {
  return (
    <div className={clsx(styles.field, className)}>
      {label && (
        <label htmlFor={htmlFor} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {description && (
        <p className={styles.description}>{description}</p>
      )}
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

