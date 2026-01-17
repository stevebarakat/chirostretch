"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./checkout.module.css";

type BillingInfo = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

export default function CheckoutPage() {
  const { items, totals, isHydrated, clearCart } = useCartStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [billing, setBilling] = useState<BillingInfo>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "US",
  });

  // Check for payment failure or retry - redirect to WordPress payment URL
  useEffect(() => {
    const payForOrder = searchParams.get("pay_for_order");
    const orderId = searchParams.get("order_id");
    const orderKey = searchParams.get("order_key");
    const paymentError = searchParams.get("payment_error");

    if (payForOrder === "true" && orderId && orderKey) {
      // User needs to retry payment for existing order
      // Redirect them back to WordPress payment URL
      setRedirecting(true);
      const WP_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const paymentUrl = `${WP_URL}/checkout/order-pay/${orderId}/?pay_for_order=true&key=${orderKey}`;

      console.log(`[Checkout] Redirecting to retry payment: ${paymentUrl}`);
      window.location.href = paymentUrl;
    } else if (paymentError) {
      setError(
        decodeURIComponent(paymentError) || "Payment failed. Please try again."
      );
    }
  }, [searchParams]);

  // Redirect to cart if empty
  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push("/cart");
    }
  }, [isHydrated, items.length, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format cart items for WooCommerce REST API
      const line_items = items.map((item) => {
        const lineItem: {
          product_id: number;
          quantity: number;
          variation_id?: number;
          meta_data?: Array<{ key: string; value: string | number }>;
        } = {
          product_id: item.product_id || item.id || 0,
          quantity: item.quantity,
          variation_id: item.variation?.id,
        };

        // Include booking metadata if this is a booking product
        if (item.type === "booking" && item.item_data) {
          lineItem.meta_data = item.item_data.map((data: any) => ({
            key: data.name || data.key,
            value: data.value || data.display,
          }));
        }

        return lineItem;
      });

      // Create order via REST API
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing,
          shipping: billing, // Use same address for shipping
          line_items,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create order. Please try again."
        );
      }

      const data = await response.json();

      // Clear cart immediately after order creation
      // Cart items are now captured in the WooCommerce order
      console.log(`[Checkout] Order ${data.order_id} created, clearing cart`);
      clearCart();

      // Redirect to WordPress payment URL
      console.log(`[Checkout] Redirecting to payment URL: ${data.payment_url}`);
      window.location.href = data.payment_url;
    } catch (err) {
      console.error("[Checkout] Error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setLoading(false);
    }
  };

  // Show redirecting state when retrying payment
  if (redirecting) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Redirecting to Payment...</h1>
          <p>Please wait while we redirect you to complete your payment.</p>
        </div>
      </div>
    );
  }

  // Don't render form until cart is hydrated
  if (!isHydrated) {
    return <div className={styles.container}>Loading...</div>;
  }

  // Show empty state if no items (and not redirecting for payment)
  if (items.length === 0 && !searchParams.get("pay_for_order")) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.formSection}>
          <h1 className={styles.title}>Checkout</h1>

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Billing Information</h2>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="first_name" className={styles.label}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={billing.first_name}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="last_name" className={styles.label}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={billing.last_name}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={billing.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={billing.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address_1" className={styles.label}>
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address_1"
                  name="address_1"
                  value={billing.address_1}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Street address, P.O. box, company name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address_2" className={styles.label}>
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  type="text"
                  id="address_2"
                  name="address_2"
                  value={billing.address_2}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="city" className={styles.label}>
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={billing.city}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="state" className={styles.label}>
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={billing.state}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="CA"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="postcode" className={styles.label}>
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={billing.postcode}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="country" className={styles.label}>
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  value={billing.country}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
            </section>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </button>
          </form>
        </div>

        <aside className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.key} className={styles.item}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                </div>
                <span className={styles.itemPrice}>
                  ${item.prices?.price || "0.00"}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>${totals?.total_price || "0.00"}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Tax</span>
              <span>Calculated at next step</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping</span>
              <span>Calculated at next step</span>
            </div>
            <div className={styles.totalRowFinal}>
              <strong>Total</strong>
              <strong>${totals?.total_price || "0.00"}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
