import { redirect } from "next/navigation";
import Container from "@/components/ui/Container";
import { OrderSummary } from "@/components/checkout";
import CheckoutFormWrapper from "@/components/checkout/CheckoutFormWrapper";
import { getServerCart } from "@/lib/woocommerce/getServerCart";
import styles from "./page.module.css";

export default async function CheckoutPage() {
  const cart = await getServerCart();

  if (!cart || !cart.items || cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <Container>
      <div className={styles.checkoutPage}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.checkoutContent}>
          <div className={styles.checkoutFormWrapper}>
            <CheckoutFormWrapper />
          </div>

          <div className={styles.orderSummaryWrapper}>
            <OrderSummary />
          </div>
        </div>
      </div>
    </Container>
  );
}
