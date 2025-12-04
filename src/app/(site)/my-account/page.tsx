import { redirect } from "next/navigation";
import { DashboardLayout, DashboardSummary } from "@/components/account";
import { getViewerAccount, getViewerOrders } from "@/lib/woocommerce/account";
import { isAuthenticated } from "@/lib/auth";

export const metadata = {
  title: "My Account - ChiroStretch",
  description: "Manage your ChiroStretch account, orders, and preferences",
};

export default async function MyAccountPage() {
  // Check authentication
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?redirect=/my-account");
  }

  const account = await getViewerAccount();

  // If authenticated but can't fetch account, show error
  if (!account) {
    return (
      <DashboardLayout title="My Account">
        <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
          <h2>Error Loading Account</h2>
          <p>Unable to load your account information. Please try again.</p>
        </div>
      </DashboardLayout>
    );
  }

  const recentOrders = await getViewerOrders(5);

  return (
    <DashboardLayout title="My Account">
      <DashboardSummary
        firstName={account.firstName}
        recentOrders={recentOrders}
      />
    </DashboardLayout>
  );
}
