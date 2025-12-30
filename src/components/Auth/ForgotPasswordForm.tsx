"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import styles from "./LoginForm.module.css";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.formWrapper}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              color: "hsl(142, 76%, 45%)",
            }}
          >
            ✓
          </div>
          <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.5rem" }}>
            Check Your Email
          </h2>
          <p
            style={{
              color: "var(--color-text-secondary)",
              marginBottom: "1.5rem",
            }}
          >
            If an account exists with that email, you&apos;ll receive a password
            reset link shortly.
          </p>
          <Link
            href="/login"
            className={styles.submitButton}
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            Back to Login
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

        <p
          style={{
            margin: 0,
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-secondary)",
          }}
        >
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email Address <span className={styles.required}>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Remember your password?{" "}
          <Link href="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
