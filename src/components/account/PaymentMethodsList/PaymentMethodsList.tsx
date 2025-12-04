"use client";

import { useState } from "react";
import styles from "./PaymentMethodsList.module.css";

type PaymentMethod = {
  id: string;
  type: string;
  last4?: string;
  expiryMonth?: string;
  expiryYear?: string;
  brand?: string;
  isDefault: boolean;
};

type PaymentMethodsListProps = {
  methods: PaymentMethod[];
  onDelete?: (methodId: string) => Promise<void>;
};

export function PaymentMethodsList({
  methods,
  onDelete,
}: PaymentMethodsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (methodId: string) => {
    if (!onDelete) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this payment method?"
    );
    if (!confirmed) return;

    setDeletingId(methodId);
    setError(null);

    try {
      await onDelete(methodId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete payment method"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (methods.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No saved payment methods.</p>
        <p className={styles.emptyNote}>
          Payment methods will be saved automatically when you make a purchase
          with the option to save your payment details.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {error && <div className={styles.error}>{error}</div>}

      {methods.map((method) => (
        <div key={method.id} className={styles.method}>
          <div className={styles.methodInfo}>
            <div className={styles.methodHeader}>
              <span className={styles.methodBrand}>
                {method.brand || method.type}
              </span>
              {method.isDefault && (
                <span className={styles.defaultBadge}>Default</span>
              )}
            </div>

            <div className={styles.methodDetails}>
              {method.last4 && (
                <span className={styles.cardNumber}>
                  •••• •••• •••• {method.last4}
                </span>
              )}
              {method.expiryMonth && method.expiryYear && (
                <span className={styles.expiry}>
                  Expires {method.expiryMonth}/{method.expiryYear}
                </span>
              )}
            </div>
          </div>

          {onDelete && (
            <button
              onClick={() => handleDelete(method.id)}
              disabled={deletingId === method.id}
              className={styles.deleteButton}
              type="button"
            >
              {deletingId === method.id ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      ))}

      <p className={styles.note}>
        Payment methods are securely stored and encrypted. You can add new
        payment methods during checkout.
      </p>
    </div>
  );
}
