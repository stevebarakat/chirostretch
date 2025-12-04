"use client";

import { AddressForm } from "@/components/account";
import { updateCustomerAddresses } from "@/lib/woocommerce/account";
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
    await updateCustomerAddresses(customerId, address, undefined);
  };

  const handleShippingSubmit = async (address: Partial<CustomerAddress>) => {
    await updateCustomerAddresses(customerId, undefined, address);
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
