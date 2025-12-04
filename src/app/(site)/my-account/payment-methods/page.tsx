import { redirect } from "next/navigation";
import { DashboardLayout, PaymentMethodsList } from "@/components/account";
import { isAuthenticated } from "@/lib/auth";

export const metadata = {
  title: "Payment Methods - My Account - ChiroStretch",
  description: "Manage your saved payment methods",
};

export default async function PaymentMethodsPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?redirect=/my-account/payment-methods");
  }

  // TODO: Fetch actual payment methods from WooCommerce
  // This will require integration with WooCommerce payment gateway APIs
  // For now, show an empty state
  const paymentMethods: Array<{
    id: string;
    type: string;
    last4?: string;
    expiryMonth?: string;
    expiryYear?: string;
    brand?: string;
    isDefault: boolean;
  }> = [];

  // Example: If using Stripe, you might fetch saved cards from customer meta
  // const paymentMethods = await getCustomerPaymentMethods(account.databaseId);

  return (
    <DashboardLayout title="Payment Methods">
      <PaymentMethodsList methods={paymentMethods} />
    </DashboardLayout>
  );
}
