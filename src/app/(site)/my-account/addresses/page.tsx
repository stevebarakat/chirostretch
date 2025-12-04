import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/account";
import { AddressFormWrapper } from "./AddressFormWrapper";
import { getViewerAccount } from "@/lib/woocommerce/account";
import { isAuthenticated } from "@/lib/auth";

export const metadata = {
  title: "Addresses - My Account - ChiroStretch",
  description: "Manage your billing and shipping addresses",
};

export default async function AddressesPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?redirect=/my-account/addresses");
  }

  const account = await getViewerAccount();

  if (!account) {
    return (
      <DashboardLayout title="Addresses">
        <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
          <h2>Error Loading Account</h2>
          <p>Unable to load your account information. Please try again.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Addresses">
      <AddressFormWrapper
        customerId={account.databaseId}
        billingAddress={account.billing}
        shippingAddress={account.shipping}
      />
    </DashboardLayout>
  );
}
