import { redirect } from "next/navigation";
import { DashboardLayout, OrdersTable } from "@/components/account";
import { getViewerOrders } from "@/lib/woocommerce/account";
import { isAuthenticated } from "@/lib/auth";

export const metadata = {
  title: "Orders - My Account - ChiroStretch",
  description: "View your order history and track your orders",
};

export default async function OrdersPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?redirect=/my-account/orders");
  }

  const orders = await getViewerOrders(20);

  return (
    <DashboardLayout title="Orders">
      <OrdersTable orders={orders} />
    </DashboardLayout>
  );
}
