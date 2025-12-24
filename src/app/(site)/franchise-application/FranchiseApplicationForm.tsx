"use client";

import { useRouter } from "next/navigation";
import { GravityFormEnhanced } from "@/components/GravityForms/GravityFormEnhanced";

type FranchiseApplicationFormProps = {
  form: unknown;
  formId: number;
};

export function FranchiseApplicationForm({
  form,
  formId,
}: FranchiseApplicationFormProps) {
  const router = useRouter();

  return (
    <GravityFormEnhanced
      form={form}
      formId={formId}
      onSubmitSuccess={(response) => {
        console.log("Franchise Application submitted:", response);
        // Redirect to application status page after successful submission
        router.push("/application");
      }}
    />
  );
}



