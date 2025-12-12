"use client";

import { AccountDetailsForm } from "@/components/account";
import { updateAccountDetails } from "./actions";

type AccountDetailsFormWrapperProps = {
  userId: number;
  initialData: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  };
};

type AccountDetails = {
  firstName: string;
  lastName: string;
  email: string;
  newPassword?: string;
};

export function AccountDetailsFormWrapper({
  userId,
  initialData,
}: AccountDetailsFormWrapperProps) {
  const handleSubmit = async (data: Partial<AccountDetails>) => {
    const updates: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    } = {};

    if (data.firstName) updates.firstName = data.firstName;
    if (data.lastName) updates.lastName = data.lastName;
    if (data.email) updates.email = data.email;
    if (data.newPassword) updates.password = data.newPassword;

    const result = await updateAccountDetails(userId, updates);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  return (
    <AccountDetailsForm initialData={initialData} onSubmit={handleSubmit} />
  );
}
