"use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./LoginForm.module.css";

export function SetPasswordForm() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const login = searchParams.get("login");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check for missing params
  if (!key || !login) {
    return (
      <div className={styles.formWrapper}>
        <div className={styles.error} role="alert">
          Invalid or expired password reset link. Please request a new one.
        </div>
        <div className={styles.footer}>
          <p className={styles.footerText}>
            <Link href="/forgot-password" className={styles.link}>
              Request a new password reset link
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
          login,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set password");
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred"
      );
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.formWrapper}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: "3rem",
            marginBottom: "1rem",
            color: "hsl(142, 76%, 45%)"
          }}>
            ✓
          </div>
          <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.5rem" }}>
            Password Set Successfully!
          </h2>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
            You can now log in to your account.
          </p>
          <Link
            href="/login"
            className={styles.submitButton}
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            New Password <span className={styles.required}>*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={styles.input}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            disabled={isLoading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password <span className={styles.required}>*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={styles.input}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Setting Password..." : "Set Password"}
        </button>
      </form>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Already have a password?{" "}
          <Link href="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
