import { OrdersTable } from "@/components/Account";
import { getViewerOrders } from "@/lib/commerce/account";

export const metadata = {
  title: "Orders - Dashboard - ChiroStretch",
  description: "View your order history and track your orders",
};

export default async function OrdersPage() {
  const orders = await getViewerOrders(20);

  return (
    <>
      <h1 style={{ marginBottom: "1.5rem" }}>Orders</h1>
      <OrdersTable orders={orders} />
    </>
  );
}
