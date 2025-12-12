"use client";

import { useState, type FormEvent } from "react";
import styles from "./AccountDetailsForm.module.css";

type AccountDetails = {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  nickname?: string;
  description?: string;
  url?: string;
  job_title?: string;
};

type AccountDetailsFormProps = {
  initialData: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    nickname?: string | null;
    description?: string | null;
    url?: string | null;
    job_title?: string | null;
    avatarUrl?: string | null;
  };
  onSubmit: (data: Partial<AccountDetails>) => Promise<void>;
};

export function AccountDetailsForm({
  initialData,
  onSubmit,
}: AccountDetailsFormProps) {
  const [formData, setFormData] = useState<AccountDetails>({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    email: initialData.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    nickname: initialData.nickname || "",
    description: initialData.description || "",
    url: initialData.url || "",
    job_title: initialData.job_title || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

    // Validate password fields if changing password
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        setError("Current password is required to set a new password");
        setIsSubmitting(false);
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match");
        setIsSubmitting(false);
        return;
      }

      if (formData.newPassword && formData.newPassword.length < 8) {
        setError("New password must be at least 8 characters");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const submitData: Partial<AccountDetails> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };

      // Only include password if user is changing it
      if (formData.newPassword && formData.currentPassword) {
        submitData.newPassword = formData.newPassword;
      }

      // Include profile fields
      if (formData.nickname !== undefined)
        submitData.nickname = formData.nickname;
      if (formData.description !== undefined)
        submitData.description = formData.description;
      if (formData.url !== undefined) submitData.url = formData.url;
      if (formData.job_title !== undefined)
        submitData.job_title = formData.job_title;

      await onSubmit(submitData);

      // Clear password fields on success
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update account details"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Account Information</h3>

        {initialData.avatarUrl && (
          <div className={styles.avatarRow}>
            <img
              src={initialData.avatarUrl}
              alt="Avatar"
              className={styles.avatar}
            />
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>
            Account details updated successfully!
          </div>
        )}

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="firstName" className={styles.label}>
              First Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="lastName" className={styles.label}>
              Last Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="nickname" className={styles.label}>
            Display Name
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="url" className={styles.label}>
            Website
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="job_title" className={styles.label}>
            Job Title
          </label>
          <input
            type="text"
            id="job_title"
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description" className={styles.label}>
            Bio / Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleTextAreaChange}
            className={styles.textarea}
            rows={4}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email Address <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Change Password</h3>
        <p className={styles.sectionDescription}>
          Leave blank to keep your current password
        </p>

        <div className={styles.field}>
          <label htmlFor="currentPassword" className={styles.label}>
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={styles.input}
            autoComplete="current-password"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="newPassword" className={styles.label}>
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={styles.input}
            autoComplete="new-password"
            minLength={8}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.input}
            autoComplete="new-password"
            minLength={8}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
