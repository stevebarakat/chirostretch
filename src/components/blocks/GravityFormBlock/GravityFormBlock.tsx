"use client";

import { useEffect, useState } from "react";
import type { Block } from "../BlockRenderer";
import { GravityFormEnhanced } from "@/components/GravityForms/GravityFormEnhanced";
import styles from "./GravityFormBlock.module.css";

type GravityFormBlockProps = {
  block: Block;
};

type GravityFormData = {
  title?: string;
  description?: string;
  [key: string]: unknown;
};

type GravityForm = GravityFormData & {
  gfForm?: GravityFormData;
};

type FormState = {
  status: "loading" | "error" | "ready" | "submitted";
  form: GravityForm | null;
  error: string | null;
  submissionResponse: SubmissionResponse | null;
};

type SubmissionResponse = {
  success?: boolean;
  confirmation_message?: string;
  confirmation_type?: "MESSAGE" | "PAGE" | "REDIRECT";
  confirmation_url?: string;
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

  // Reason this component must use useEffect:
  // - Syncing with external API (Gravity Forms endpoint) when formId changes
  // - Server Components cannot handle client-side API calls with dynamic parameters
  // - This is a side effect that must run when formId dependency changes
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
  if (state.status === "submitted" && state.submissionResponse) {
    const { confirmation_message, confirmation_type, confirmation_url } = state.submissionResponse;

    // Handle redirect confirmation
    if (confirmation_type === "REDIRECT" && confirmation_url) {
      window.location.href = confirmation_url;
      return null;
    }

    return (
      <div className={styles.confirmation}>
        <div className={styles.confirmationIcon}>✓</div>
        {confirmation_message ? (
          <div
            className={styles.confirmationContent}
            dangerouslySetInnerHTML={{ __html: confirmation_message }}
          />
        ) : (
          <p className={styles.confirmationContent}>Thank you for your submission!</p>
        )}
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

  // Form data might be nested under gfForm (GraphQL) or at top level (REST)
  const formData = (state.form?.gfForm || state.form) as GravityFormData | undefined;
  const formTitle = formData?.title;

  return (
    <div className={styles.formBlock}>
      {formTitle && (
        <h3 className={styles.formTitle}>{formTitle}</h3>
      )}
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
