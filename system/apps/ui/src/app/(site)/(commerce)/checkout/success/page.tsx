"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/Primitives";
import styles from "./success.module.css";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const orderId = searchParams.get("order_id") || searchParams.get("order");
  const orderKey = searchParams.get("key");

  useEffect(() => {
    // Clear cart on successful order
    clearCart();
    console.log("[Checkout Success] Cart cleared after successful order");
  }, [clearCart]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <svg
            className={styles.successIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className={styles.title}>Order Confirmed!</h1>

        <p className={styles.message}>
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        {orderId && (
          <div className={styles.orderInfo}>
            <p className={styles.orderNumber}>
              <strong>Order Number:</strong> #{orderId}
            </p>
            {orderKey && (
              <p className={styles.orderKey}>
                <strong>Order Key:</strong> {orderKey}
              </p>
            )}
          </div>
        )}

        <div className={styles.infoBox}>
          <p>
            A confirmation email has been sent to your email address with order
            details and tracking information.
          </p>
        </div>

        <div className={styles.actions}>
          <Button as="Link" href="/shop">
            Continue Shopping
          </Button>
          <Button as="Link" href="/" color="secondary">
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.content}>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
