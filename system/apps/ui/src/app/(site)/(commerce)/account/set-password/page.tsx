"use client";

// eslint-disable-next-line no-restricted-imports
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Text, Input, Button } from "@/components/Primitives";
import styles from "./set-password.module.css";

function SetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const key = searchParams.get("key");
  const login = searchParams.get("login");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Validate reset key on mount
  useEffect(() => {
    validateResetKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function validateResetKey() {
    if (!key || !login) {
      setError("Invalid password reset link. Please check your email.");
      setValidating(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/validate-reset-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, key }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(
          data.message ||
            "This password reset link has expired or is invalid. Please request a new one."
        );
        setValidating(false);
        return;
      }

      setValidating(false);
    } catch {
      setError("An error occurred while validating your reset link.");
      setValidating(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login,
          key,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Failed to reset password. Please try again."
        );
      }

      setSuccess(true);

      // Redirect to home page after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setLoading(false);
    }
  }

  // Loading state while validating key
  if (validating) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loading}>
            <Text>Validating password reset link...</Text>
          </div>
        </div>
      </div>
    );
  }

  // Success state after password reset
  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.success}>
            <svg
              className={styles.successIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <Text as="h1" className={styles.title}>Password Reset Successful!</Text>
            <Text className={styles.subtitle}>
              Your password has been updated. You can now log in with your new
              password.
            </Text>
            <Text className={styles.redirectMessage}>
              Redirecting you to the home page...
            </Text>
          </div>
        </div>
      </div>
    );
  }

  // Error state (invalid/expired key)
  if (error && !key) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <Text as="h1" className={styles.title}>Invalid Reset Link</Text>
          <div className={styles.error}>
            <Text>{error}</Text>
          </div>
          <div className={styles.actions}>
            <Link href="/" className={styles.link}>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Text as="h1" className={styles.title}>Set Your Password</Text>
        <Text className={styles.subtitle}>
          Please enter a new password for your account.
        </Text>

        {error && (
          <div className={styles.error}>
            <Text>{error}</Text>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <Text as="label" htmlFor="password" className={styles.label}>
              New Password *
            </Text>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter at least 8 characters"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.formGroup}>
            <Text as="label" htmlFor="confirmPassword" className={styles.label}>
              Confirm Password *
            </Text>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Re-enter your password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>

        <div className={styles.footer}>
          <Link href="/" className={styles.link}>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="container">
          <div className="content">
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <SetPasswordContent />
    </Suspense>
  );
}
