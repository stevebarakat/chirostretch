import { redirect, notFound } from "next/navigation";
import { DashboardLayout, OrderDetails } from "@/components/account";
import { getOrderById } from "@/lib/woocommerce/account";
import { isAuthenticated } from "@/lib/auth";

type OrderPageProps = {
  params: Promise<{ orderId: string }>;
};

export async function generateMetadata({ params }: OrderPageProps) {
  const { orderId } = await params;
  return {
    title: `Order #${orderId} - My Account - ChiroStretch`,
    description: `View details for order #${orderId}`,
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    const { orderId } = await params;
    redirect(`/login?redirect=/my-account/orders/${orderId}`);
  }

  const { orderId } = await params;
  const orderIdNum = parseInt(orderId, 10);

  if (isNaN(orderIdNum)) {
    notFound();
  }

  const order = await getOrderById(orderIdNum);

  if (!order) {
    notFound();
  }

  return (
    <DashboardLayout title={`Order #${order.orderNumber || orderId}`}>
      <OrderDetails order={order} />
    </DashboardLayout>
  );
}
