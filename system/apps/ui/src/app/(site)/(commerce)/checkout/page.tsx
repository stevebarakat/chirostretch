"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/stores/useCartStore";
import { useRouter, useSearchParams } from "next/navigation";
import { checkoutSchema, type CheckoutFormData } from "@/lib/forms/checkout-schema";
import { Text, Input, Button } from "@/components/Primitives";
import styles from "./checkout.module.css";

type CouponState = {
  status: "idle" | "loading" | "valid" | "error";
  discountAmount?: number;
  errorMessage?: string;
  appliedCode?: string;
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className={styles.container}>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const { items, totals, isHydrated, clearCart } = useCartStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [coupon, setCoupon] = useState<CouponState>({ status: "idle" });
  const [couponInput, setCouponInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
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
      coupon_code: "",
    },
  });

  const email = watch("email");

  // Check for payment failure or retry - redirect to WordPress payment URL
  useEffect(() => {
    const payForOrder = searchParams.get("pay_for_order");
    const orderId = searchParams.get("order_id");
    const orderKey = searchParams.get("order_key");
    const paymentError = searchParams.get("payment_error");

    if (payForOrder === "true" && orderId && orderKey) {
      setRedirecting(true);
      const WP_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const paymentUrl = `${WP_URL}/checkout/order-pay/${orderId}/?pay_for_order=true&key=${orderKey}`;
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

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;

    setCoupon({ status: "loading" });

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupon_code: couponInput.trim(),
          email: email,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setCoupon({
          status: "valid",
          discountAmount: data.discount_amount,
          appliedCode: data.coupon_code,
        });
        setValue("coupon_code", data.coupon_code);
      } else {
        setCoupon({
          status: "error",
          errorMessage: data.message || "Invalid coupon code",
        });
      }
    } catch {
      setCoupon({
        status: "error",
        errorMessage: "Failed to validate coupon. Please try again.",
      });
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon({ status: "idle" });
    setCouponInput("");
    setValue("coupon_code", "");
  };

  const onSubmit = async (data: CheckoutFormData) => {
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
        if (item.type === "booking" && Array.isArray(item.item_data)) {
          lineItem.meta_data = item.item_data.map((d: Record<string, unknown>) => ({
            key: String(d.name || d.key || ""),
            value: String(d.value || d.display || ""),
          }));
        }

        return lineItem;
      });

      const billing = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address_1: data.address_1,
        address_2: data.address_2 || "",
        city: data.city,
        state: data.state,
        postcode: data.postcode,
        country: data.country,
      };

      // Create order via REST API
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing,
          shipping: billing,
          line_items,
          ...(data.coupon_code && { coupon_code: data.coupon_code }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create order. Please try again."
        );
      }

      const orderData = await response.json();

      // Clear cart immediately after order creation
      clearCart();

      // Redirect to WordPress payment URL
      window.location.href = orderData.payment_url;
    } catch (err) {
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
          <Text as="h1" className={styles.title}>Redirecting to Payment...</Text>
          <Text>Please wait while we redirect you to complete your payment.</Text>
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
    return null;
  }

  // Calculate totals with discount
  const subtotal = parseFloat(totals?.total_price || "0");
  const discount = coupon.status === "valid" ? (coupon.discountAmount || 0) : 0;
  const estimatedTotal = Math.max(0, subtotal - discount);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.formSection}>
          <Text as="h1" className={styles.title}>Checkout</Text>

          {error && (
            <div className={styles.error}>
              <Text>{error}</Text>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <section className={styles.section}>
              <Text as="h2" className={styles.sectionTitle}>Billing Information</Text>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <Text as="label" htmlFor="first_name" className={styles.label}>
                    First Name *
                  </Text>
                  <Input
                    type="text"
                    id="first_name"
                    {...register("first_name")}
                    className={styles.input}
                    error={!!errors.first_name}
                  />
                  {errors.first_name && (
                    <Text as="span" className={styles.fieldError}>{errors.first_name.message}</Text>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <Text as="label" htmlFor="last_name" className={styles.label}>
                    Last Name *
                  </Text>
                  <Input
                    type="text"
                    id="last_name"
                    {...register("last_name")}
                    className={styles.input}
                    error={!!errors.last_name}
                  />
                  {errors.last_name && (
                    <Text as="span" className={styles.fieldError}>{errors.last_name.message}</Text>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <Text as="label" htmlFor="email" className={styles.label}>
                  Email Address *
                </Text>
                <Input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={styles.input}
                  error={!!errors.email}
                />
                {errors.email && (
                  <Text as="span" className={styles.fieldError}>{errors.email.message}</Text>
                )}
              </div>

              <div className={styles.formGroup}>
                <Text as="label" htmlFor="phone" className={styles.label}>
                  Phone Number *
                </Text>
                <Input
                  type="tel"
                  id="phone"
                  {...register("phone")}
                  className={styles.input}
                  error={!!errors.phone}
                />
                {errors.phone && (
                  <Text as="span" className={styles.fieldError}>{errors.phone.message}</Text>
                )}
              </div>

              <div className={styles.formGroup}>
                <Text as="label" htmlFor="address_1" className={styles.label}>
                  Street Address *
                </Text>
                <Input
                  type="text"
                  id="address_1"
                  {...register("address_1")}
                  className={styles.input}
                  error={!!errors.address_1}
                  placeholder="Street address, P.O. box, company name"
                />
                {errors.address_1 && (
                  <Text as="span" className={styles.fieldError}>{errors.address_1.message}</Text>
                )}
              </div>

              <div className={styles.formGroup}>
                <Text as="label" htmlFor="address_2" className={styles.label}>
                  Apartment, suite, etc. (optional)
                </Text>
                <Input
                  type="text"
                  id="address_2"
                  {...register("address_2")}
                  className={styles.input}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <Text as="label" htmlFor="city" className={styles.label}>
                    City *
                  </Text>
                  <Input
                    type="text"
                    id="city"
                    {...register("city")}
                    className={styles.input}
                    error={!!errors.city}
                  />
                  {errors.city && (
                    <Text as="span" className={styles.fieldError}>{errors.city.message}</Text>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <Text as="label" htmlFor="state" className={styles.label}>
                    State *
                  </Text>
                  <Input
                    type="text"
                    id="state"
                    {...register("state")}
                    className={styles.input}
                    error={!!errors.state}
                    placeholder="CA"
                  />
                  {errors.state && (
                    <Text as="span" className={styles.fieldError}>{errors.state.message}</Text>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <Text as="label" htmlFor="postcode" className={styles.label}>
                    ZIP Code *
                  </Text>
                  <Input
                    type="text"
                    id="postcode"
                    {...register("postcode")}
                    className={styles.input}
                    error={!!errors.postcode}
                  />
                  {errors.postcode && (
                    <Text as="span" className={styles.fieldError}>{errors.postcode.message}</Text>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <Text as="label" htmlFor="country" className={styles.label}>
                  Country *
                </Text>
                <Input
                  as="select"
                  id="country"
                  {...register("country")}
                  className={styles.select}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                </Input>
              </div>
            </section>

            {/* Coupon Section - visible after email is entered */}
            {email && email.includes("@") && (
              <section className={styles.couponSection}>
                <Text as="h2" className={styles.sectionTitle}>Discount Code</Text>

                {coupon.status === "valid" ? (
                  <div className={styles.appliedCoupon}>
                    <div className={styles.couponBadge}>
                      <Text as="span" className={styles.couponCode}>{coupon.appliedCode}</Text>
                      <Text as="span" className={styles.discountAmount}>
                        -${coupon.discountAmount?.toFixed(2)}
                      </Text>
                    </div>
                    <Button
                      size="sm"
                      color="neutral"
                      variant="outline"
                      onClick={handleRemoveCoupon}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className={styles.couponInputRow}>
                    <Input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter discount code"
                      className={`${styles.input} ${styles.couponInput}`}
                      disabled={coupon.status === "loading"}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={coupon.status === "loading" || !couponInput.trim()}
                    >
                      {coupon.status === "loading" ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                )}

                {coupon.status === "error" && (
                  <Text className={styles.couponError}>{coupon.errorMessage}</Text>
                )}
              </section>
            )}

            <Button type="submit" disabled={loading} fullWidth>
              {loading ? "Processing..." : "Continue to Payment"}
            </Button>
          </form>
        </div>

        <aside className={styles.orderSummary}>
          <Text as="h2" className={styles.summaryTitle}>Order Summary</Text>

          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.key} className={styles.item}>
                <div className={styles.itemInfo}>
                  <Text as="span" className={styles.itemName}>{item.name}</Text>
                  <Text as="span" className={styles.itemQuantity}>Qty: {item.quantity}</Text>
                </div>
                <Text as="span" className={styles.itemPrice}>
                  ${item.prices?.price || "0.00"}
                </Text>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <Text as="span">Subtotal</Text>
              <Text as="span">${subtotal.toFixed(2)}</Text>
            </div>

            {coupon.status === "valid" && discount > 0 && (
              <div className={`${styles.totalRow} ${styles.discountRow}`}>
                <Text as="span">Discount ({coupon.appliedCode})</Text>
                <Text as="span" className={styles.discountValue}>-${discount.toFixed(2)}</Text>
              </div>
            )}

            <div className={styles.totalRow}>
              <Text as="span">Tax</Text>
              <Text as="span">Calculated at next step</Text>
            </div>
            <div className={styles.totalRow}>
              <Text as="span">Shipping</Text>
              <Text as="span">Calculated at next step</Text>
            </div>
            <div className={styles.totalRowFinal}>
              <Text as="strong">Estimated Total</Text>
              <Text as="strong">${estimatedTotal.toFixed(2)}</Text>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
