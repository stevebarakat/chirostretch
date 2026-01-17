"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./order.module.css";

type Order = {
  id: number;
  order_key: string;
  status: string;
  total: string;
  date_created: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: Array<{
    id: number;
    name: string;
    quantity: number;
    total: string;
  }>;
};

export default function OrderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id as string;
  const orderKey = searchParams.get("order_key");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId || !orderKey) {
        setError("Invalid order link. Please check your email.");
        setLoading(false);
        return;
      }

      try {
        // Fetch order via Next.js API route (secure)
        const response = await fetch(
          `/api/orders/${orderId}?order_key=${orderKey}`
        );

        if (!response.ok) {
          throw new Error("Failed to load order");
        }

        const orderData = await response.json();
        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, orderKey]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Order Not Found</h1>
          <p className={styles.error}>{error || "Order could not be loaded."}</p>
          <Link href="/" className={styles.link}>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Order #{order.id}</h1>
          <span className={`${styles.status} ${styles[order.status]}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div className={styles.info}>
          <p>
            <strong>Order Date:</strong>{" "}
            {new Date(order.date_created).toLocaleDateString()}
          </p>
          <p>
            <strong>Total:</strong> ${order.total}
          </p>
        </div>

        <section className={styles.section}>
          <h2>Items</h2>
          <div className={styles.items}>
            {order.line_items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemQuantity}>Qty: {item.quantity}</p>
                </div>
                <p className={styles.itemTotal}>${item.total}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Billing Address</h2>
          <div className={styles.address}>
            <p>
              {order.billing.first_name} {order.billing.last_name}
            </p>
            <p>{order.billing.address_1}</p>
            {order.billing.address_2 && <p>{order.billing.address_2}</p>}
            <p>
              {order.billing.city}, {order.billing.state} {order.billing.postcode}
            </p>
            <p>{order.billing.country}</p>
            <p className={styles.contact}>Email: {order.billing.email}</p>
            <p className={styles.contact}>Phone: {order.billing.phone}</p>
          </div>
        </section>

        <div className={styles.actions}>
          <Link href="/" className={styles.button}>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
