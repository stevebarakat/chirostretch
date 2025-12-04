"use client";

import { useState, type FormEvent } from "react";
import type { CustomerAddress } from "@/lib/graphql/queries/account";
import styles from "./AddressForm.module.css";

type AddressFormProps = {
  type: "billing" | "shipping";
  initialAddress?: CustomerAddress | null;
  onSubmit: (address: Partial<CustomerAddress>) => Promise<void>;
};

export function AddressForm({
  type,
  initialAddress,
  onSubmit,
}: AddressFormProps) {
  const [formData, setFormData] = useState<Partial<CustomerAddress>>({
    firstName: initialAddress?.firstName || "",
    lastName: initialAddress?.lastName || "",
    company: initialAddress?.company || "",
    address1: initialAddress?.address1 || "",
    address2: initialAddress?.address2 || "",
    city: initialAddress?.city || "",
    state: initialAddress?.state || "",
    postcode: initialAddress?.postcode || "",
    country: initialAddress?.country || "US",
    email: type === "billing" ? initialAddress?.email || "" : undefined,
    phone: type === "billing" ? initialAddress?.phone || "" : undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await onSubmit(formData);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update address"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = type === "billing" ? "Billing Address" : "Shipping Address";

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.title}>{title}</h3>

      {error && <div className={styles.error}>{error}</div>}
      {success && (
        <div className={styles.success}>Address updated successfully!</div>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${type}-firstName`} className={styles.label}>
            First Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id={`${type}-firstName`}
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${type}-lastName`} className={styles.label}>
            Last Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id={`${type}-lastName`}
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${type}-company`} className={styles.label}>
          Company (optional)
        </label>
        <input
          type="text"
          id={`${type}-company`}
          name="company"
          value={formData.company || ""}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${type}-country`} className={styles.label}>
          Country <span className={styles.required}>*</span>
        </label>
        <select
          id={`${type}-country`}
          name="country"
          value={formData.country || "US"}
          onChange={handleChange}
          required
          className={styles.select}
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="AU">Australia</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${type}-address1`} className={styles.label}>
          Street Address <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id={`${type}-address1`}
          name="address1"
          value={formData.address1 || ""}
          onChange={handleChange}
          required
          className={styles.input}
          placeholder="House number and street name"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${type}-address2`} className={styles.label}>
          Apartment, suite, unit, etc. (optional)
        </label>
        <input
          type="text"
          id={`${type}-address2`}
          name="address2"
          value={formData.address2 || ""}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${type}-city`} className={styles.label}>
          City <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id={`${type}-city`}
          name="city"
          value={formData.city || ""}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${type}-state`} className={styles.label}>
            State <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id={`${type}-state`}
            name="state"
            value={formData.state || ""}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${type}-postcode`} className={styles.label}>
            ZIP Code <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id={`${type}-postcode`}
            name="postcode"
            value={formData.postcode || ""}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
      </div>

      {type === "billing" && (
        <>
          <div className={styles.field}>
            <label htmlFor={`${type}-email`} className={styles.label}>
              Email <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              id={`${type}-email`}
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={`${type}-phone`} className={styles.label}>
              Phone <span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              id={`${type}-phone`}
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
}
