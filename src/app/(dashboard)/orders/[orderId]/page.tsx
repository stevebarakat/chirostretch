import { notFound } from "next/navigation";
import { OrderDetails } from "@/components/Account";
import { getOrderById } from "@/lib/commerce/account";

type OrderPageProps = {
  params: Promise<{ orderId: string }>;
};

export async function generateMetadata({ params }: OrderPageProps) {
  const { orderId } = await params;
  return {
    title: `Order #${orderId} - Dashboard - ChiroStretch`,
    description: `View details for order #${orderId}`,
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
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
    <>
      <h1 style={{ marginBottom: "1.5rem" }}>
        Order #{order.orderNumber || orderId}
      </h1>
      <OrderDetails order={order} />
    </>
  );
}
