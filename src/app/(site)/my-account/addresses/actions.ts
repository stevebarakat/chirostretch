"use server";

import { revalidatePath } from "next/cache";
import { updateCustomerAddresses } from "@/lib/woocommerce/account";
import type { CustomerAddress } from "@/lib/graphql/queries/account";

/**
 * Server action to update customer billing address
 */
export async function updateBillingAddress(
  customerId: number,
  address: Partial<CustomerAddress>
) {
  try {
    const result = await updateCustomerAddresses(customerId, address, undefined);

    // Revalidate the addresses page to show updated data
    revalidatePath("/my-account/addresses");

    return { success: true, customer: result };
  } catch (error) {
    console.error("Failed to update billing address:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update billing address",
    };
  }
}

/**
 * Server action to update customer shipping address
 */
export async function updateShippingAddress(
  customerId: number,
  address: Partial<CustomerAddress>
) {
  try {
    const result = await updateCustomerAddresses(customerId, undefined, address);

    // Revalidate the addresses page to show updated data
    revalidatePath("/my-account/addresses");

    return { success: true, customer: result };
  } catch (error) {
    console.error("Failed to update shipping address:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update shipping address",
    };
  }
}
