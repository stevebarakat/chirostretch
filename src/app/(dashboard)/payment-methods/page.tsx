import { PaymentMethodsList } from "@/components/Account";

export const metadata = {
  title: "Payment Methods - Dashboard - ChiroStretch",
  description: "Manage your saved payment methods",
};

export default async function PaymentMethodsPage() {
  // TODO: Fetch actual payment methods from WooCommerce
  // This will require integration with WooCommerce payment gateway APIs
  const paymentMethods: Array<{
    id: string;
    type: string;
    last4?: string;
    expiryMonth?: string;
    expiryYear?: string;
    brand?: string;
    isDefault: boolean;
  }> = [];

  return (
    <>
      <h1 style={{ marginBottom: "1.5rem" }}>Payment Methods</h1>
      <PaymentMethodsList methods={paymentMethods} />
    </>
  );
}
