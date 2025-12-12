"use server";

import { revalidatePath } from "next/cache";
import { updateUserAccount } from "@/lib/woocommerce/account";

type AccountDetailsUpdate = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

/**
 * Server action to update user account details
 */
export async function updateAccountDetails(
  userId: number,
  updates: AccountDetailsUpdate
) {
  try {
    const result = await updateUserAccount(userId, updates);

    // Revalidate the account details page to show updated data
    revalidatePath("/my-account/account-details");

    return { success: true, user: result };
  } catch (error) {
    console.error("Failed to update account details:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update account details",
    };
  }
}
