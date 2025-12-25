"use client";

import { useEffect, useState } from "react";
import type { Block } from "../BlockRenderer";
import { GravityFormEnhanced } from "@/components/GravityForms/GravityFormEnhanced";
import styles from "./GravityFormBlock.module.css";

type GravityFormBlockProps = {
  block: Block;
};

type FormState = {
  status: "loading" | "error" | "ready" | "submitted";
  form: unknown | null;
  error: string | null;
  submissionResponse: SubmissionResponse | null;
};

type SubmissionResponse = {
  success?: boolean;
  confirmation_message?: string;
  entry_id?: number;
};

export default function GravityFormBlock({ block }: GravityFormBlockProps) {
  const formId = block.attributes?.formId as string | number | undefined;
  const [state, setState] = useState<FormState>({
    status: "loading",
    form: null,
    error: null,
    submissionResponse: null,
  });

  useEffect(() => {
    if (!formId) {
      setState({ status: "error", form: null, error: "No form ID provided", submissionResponse: null });
      return;
    }

    async function fetchForm() {
      try {
        const response = await fetch(`/api/gravity-forms/${formId}`);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to load form");
        }

        const form = await response.json();
        setState({ status: "ready", form, error: null, submissionResponse: null });
      } catch (error) {
        setState({
          status: "error",
          form: null,
          error: error instanceof Error ? error.message : "Failed to load form",
          submissionResponse: null,
        });
      }
    }

    fetchForm();
  }, [formId]);

  if (state.status === "loading") {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Loading form...</span>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className={styles.error}>
        <p>{state.error || "Failed to load form"}</p>
      </div>
    );
  }

  // Show confirmation screen after successful submission
  if (state.status === "submitted") {
    return (
      <div className={styles.confirmation}>
        <div className={styles.confirmationIcon}>✓</div>
        <h2 className={styles.confirmationTitle}>Application Submitted!</h2>

        <div className={styles.confirmationContent}>
          <p>Thank you for your interest in becoming a ChiroStretch franchise partner.</p>

          <div className={styles.nextSteps}>
            <h3>What happens next?</h3>
            <ol>
              <li>
                <strong>Check your email</strong> — We&apos;ve sent you a link to set up your password and access your application portal.
              </li>
              <li>
                <strong>Review process</strong> — Our franchise team will review your application within 3-5 business days.
              </li>
              <li>
                <strong>We&apos;ll be in touch</strong> — A member of our team will contact you to discuss next steps.
              </li>
            </ol>
          </div>

          <p className={styles.editNote}>
            Need to make changes? You can edit your application anytime before it enters review by logging into your account.
          </p>
        </div>

        <div className={styles.confirmationActions}>
          <a href="/login" className={styles.loginButton}>
            Log In to Your Account
          </a>
        </div>
      </div>
    );
  }

  if (!state.form) {
    return (
      <div className={styles.error}>
        <p>Failed to load form</p>
      </div>
    );
  }

  const numericFormId = typeof formId === "string" ? parseInt(formId, 10) : formId;

  return (
    <div className={styles.formBlock}>
      <GravityFormEnhanced
        form={state.form}
        formId={numericFormId}
        onSubmitSuccess={(response) => {
          setState({
            ...state,
            status: "submitted",
            submissionResponse: response as SubmissionResponse,
          });
          // Scroll to top to show confirmation
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
