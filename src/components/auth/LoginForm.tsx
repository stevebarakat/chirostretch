"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./LoginForm.module.css";

type LoginFormData = {
  username: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : (data.error || "Login failed");
        throw new Error(errorMsg);
      }

      // Get redirect URL: prefer explicit query param, then role-based from API
      const explicitRedirect = searchParams.get("redirect");
      const redirectTo = explicitRedirect || data.redirectUrl || "/my-account";

      // Successful login - redirect
      // Use window.location for external URLs (e.g., WordPress admin for franchisees)
      if (redirectTo.startsWith("http://") || redirectTo.startsWith("https://")) {
        window.location.href = redirectTo;
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="username" className={styles.label}>
            Username or Email <span className={styles.required}>*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className={styles.input}
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            disabled={isLoading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password <span className={styles.required}>*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={styles.input}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Don&apos;t have an account?{" "}
          <a href="/register" className={styles.link}>
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
