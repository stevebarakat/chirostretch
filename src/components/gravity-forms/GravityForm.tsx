"use client";

import { useEffect } from "react";
import GravityFormForm from "next-gravity-forms";

type GravityFormProps = {
  form: unknown;
};

export function GravityForm({ form }: GravityFormProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Form data:", form);
    }
  }, [form]);

  return <GravityFormForm data={form} />;
}
