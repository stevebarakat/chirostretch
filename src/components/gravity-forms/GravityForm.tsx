"use client";

import { useEffect } from "react";
import GravityFormForm from "next-gravity-forms";

type GravityFormData = {
  id: string;
  databaseId?: number;
  title?: string;
  description?: string;
  formFields?: {
    nodes: Array<{
      id?: string;
      databaseId?: number;
      type?: string;
      inputType: string;
      label?: string;
      description?: string;
      isRequired?: boolean;
      placeholder?: string;
      [key: string]: unknown;
    }>;
  };
  submitButton?: {
    text?: string;
    type?: string;
    width?: string;
  };
};

type GravityFormProps = {
  form: unknown;
};

export function GravityForm({ form }: GravityFormProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Form data:", form);
    }
  }, [form]);

  return <GravityFormForm data={form as GravityFormData} />;
}
