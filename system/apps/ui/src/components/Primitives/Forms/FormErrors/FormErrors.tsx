"use client";

import { Alert } from "@/components/Primitives";
import styles from "./FormErrors.module.css";

type FieldError = {
  fieldId: string;
  label: string;
  message: string;
  page?: number;
};

type FormErrorsProps = {
  /** General error message to display at the top */
  message?: string;
  /** List of field-specific errors */
  fieldErrors?: FieldError[];
  /** Callback when user clicks on a field error link */
  onFieldClick?: (fieldId: string) => void;
  /** Whether this is a multi-page form (shows page numbers) */
  showPageNumbers?: boolean;
  /** Additional className */
  className?: string;
};

export function FormErrors({
  message,
  fieldErrors = [],
  onFieldClick,
  showPageNumbers = false,
  className,
}: FormErrorsProps) {
  if (!message && fieldErrors.length === 0) {
    return null;
  }

  const handleFieldClick = (e: React.MouseEvent, fieldId: string) => {
    e.preventDefault();
    onFieldClick?.(fieldId);
  };

  return (
    <Alert variant="error" className={className}>
      {message && <p className={styles.message}>{message}</p>}
      {fieldErrors.length > 0 && (
        <ul className={styles.errorList}>
          {fieldErrors.map((error) => (
            <li key={error.fieldId}>
              {onFieldClick ? (
                <button
                  type="button"
                  className={styles.errorLink}
                  onClick={(e) => handleFieldClick(e, error.fieldId)}
                >
                  {error.label}
                  {showPageNumbers && error.page !== undefined && (
                    <span className={styles.pageNumber}>
                      {" "}
                      (Page {error.page + 1})
                    </span>
                  )}
                </button>
              ) : (
                <span>
                  {error.label}
                  {showPageNumbers && error.page !== undefined && (
                    <span className={styles.pageNumber}>
                      {" "}
                      (Page {error.page + 1})
                    </span>
                  )}
                </span>
              )}
              {error.message && (
                <span className={styles.fieldMessage}> — {error.message}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Alert>
  );
}
