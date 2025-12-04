import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/account";
import { AccountDetailsFormWrapper } from "./AccountDetailsFormWrapper";
import { getViewerAccount } from "@/lib/woocommerce/account";
import { isAuthenticated } from "@/lib/auth";

export const metadata = {
  title: "Account Details - My Account - ChiroStretch",
  description: "Update your account information and password",
};

export default async function AccountDetailsPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?redirect=/my-account/account-details");
  }

  const account = await getViewerAccount();

  if (!account) {
    return (
      <DashboardLayout title="Account Details">
        <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
          <h2>Error Loading Account</h2>
          <p>Unable to load your account information. Please try again.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Account Details">
      <AccountDetailsFormWrapper
        userId={account.databaseId}
        initialData={{
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
        }}
      />
    </DashboardLayout>
  );
}
