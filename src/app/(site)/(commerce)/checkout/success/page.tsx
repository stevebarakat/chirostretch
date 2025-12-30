import Link from "next/link";
import { Container } from "@/components/UI";
import { Button } from "@/components/UI";
import styles from "./page.module.css";

type SuccessPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const orderId = params.order;

  return (
    <Container>
      <div className={styles.successPage}>
        <div className={styles.successContent}>
          <div className={styles.iconWrapper}>
            <svg
              className={styles.checkIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className={styles.title}>Order Confirmed!</h1>

          <p className={styles.message}>
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>

          {orderId && (
            <div className={styles.orderInfo}>
              <p className={styles.orderLabel}>Order Number:</p>
              <p className={styles.orderNumber}>{orderId}</p>
            </div>
          )}

          <p className={styles.emailMessage}>
            You will receive an email confirmation shortly with your order
            details.
          </p>

          <div className={styles.actions}>
            {orderId && (
              <Link href={`/orders/${orderId}`}>
                <Button>View Order</Button>
              </Link>
            )}
            <Link href="/shop">
              <Button color="secondary">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
