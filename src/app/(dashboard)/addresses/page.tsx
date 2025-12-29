import { AddressFormWrapper } from "@/components/Dashboard";
import { getViewerAccount } from "@/lib/woocommerce/account";

export const metadata = {
  title: "Addresses - Dashboard - ChiroStretch",
  description: "Manage your billing and shipping addresses",
};

export default async function AddressesPage() {
  const data = await getViewerAccount();

  if (!data?.customer) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <h2>Error Loading Account</h2>
        <p>Unable to load your account information. Please try again.</p>
      </div>
    );
  }

  const { customer } = data;

  return (
    <>
      <h1 style={{ marginBottom: "1.5rem" }}>Addresses</h1>
      <AddressFormWrapper
        customerId={customer.databaseId}
        billingAddress={customer.billing}
        shippingAddress={customer.shipping}
      />
    </>
  );
}
