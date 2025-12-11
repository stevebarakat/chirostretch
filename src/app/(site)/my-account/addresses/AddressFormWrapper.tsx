"use client";

import { AddressForm } from "@/components/account";
import { updateBillingAddress, updateShippingAddress } from "./actions";
import type { CustomerAddress } from "@/lib/graphql/queries/account";
import styles from "./AddressFormWrapper.module.css";

type AddressFormWrapperProps = {
  customerId: number;
  billingAddress?: CustomerAddress | null;
  shippingAddress?: CustomerAddress | null;
};

export function AddressFormWrapper({
  customerId,
  billingAddress,
  shippingAddress,
}: AddressFormWrapperProps) {
  const handleBillingSubmit = async (address: Partial<CustomerAddress>) => {
    const result = await updateBillingAddress(customerId, address);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const handleShippingSubmit = async (address: Partial<CustomerAddress>) => {
    const result = await updateShippingAddress(customerId, address);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formContainer}>
        <AddressForm
          type="billing"
          initialAddress={billingAddress}
          onSubmit={handleBillingSubmit}
        />
      </div>
      <div className={styles.formContainer}>
        <AddressForm
          type="shipping"
          initialAddress={shippingAddress}
          onSubmit={handleShippingSubmit}
        />
      </div>
    </div>
  );
}
