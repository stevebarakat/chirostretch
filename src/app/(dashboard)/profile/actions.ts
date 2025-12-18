"use server";

import { revalidatePath } from "next/cache";
import { updateUserAccount, updateUserMeta } from "@/lib/woocommerce/account";

type AccountDetailsUpdate = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  nickname?: string;
  description?: string;
  url?: string;
  job_title?: string;
};

/**
 * Server action to update user account details
 */
export async function updateAccountDetails(
  userId: number,
  updates: AccountDetailsUpdate
) {
  try {
    // Update core user fields via GraphQL
    const result = await updateUserAccount(userId, updates);

    // Update REST-writable profile fields (nickname, description, url, meta)
    try {
      await updateUserMeta(userId, {
        nickname: updates.nickname,
        description: updates.description,
        url: updates.url,
        job_title: updates.job_title,
      });
    } catch (metaErr) {
      console.warn("Failed to update some user meta fields:", metaErr);
    }

    // Revalidate the account details page to show updated data
    revalidatePath("/profile");

    return { success: true, user: result };
  } catch (error) {
    console.error("Failed to update account details:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update account details",
    };
  }
}
