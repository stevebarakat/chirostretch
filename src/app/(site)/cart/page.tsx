"use client";

import { useEffect, useState, useCallback, startTransition } from "react";
import Link from "next/link";
import Container from "@components/ui/Container";
import Button from "@components/ui/Button";
import { useCartStore } from "@/lib/woocommerce/useCartStore";
import type { StoreCartItem } from "@/lib/woocommerce/getServerCart";
import styles from "./page.module.css";

export default function CartPage() {
  const {
    items,
    itemsCount,
    totals,
    loading,
    fetchCart,
    updateCartItem,
    removeCartItem,
  } = useCartStore();
  const [localQuantities, setLocalQuantities] = useState<
    Record<string, number>
  >({});
  const [mounted, setMounted] = useState(false);

  const loadCart = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    if (items.length > 0) {
      const quantities: Record<string, number> = {};
      items.forEach((item) => {
        quantities[item.key] = item.quantity;
      });
      startTransition(() => {
        setLocalQuantities(quantities);
      });
    }
  }, [items]);

  const handleQuantityChange = (key: string, value: number) => {
    if (value < 1) return;
    setLocalQuantities((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdateQuantity = async (key: string) => {
    const quantity = localQuantities[key];
    if (quantity && quantity > 0) {
      try {
        await updateCartItem(key, quantity);
      } catch (error) {
        console.error("Failed to update quantity:", error);
      }
    }
  };

  const handleRemoveItem = async (key: string) => {
    try {
      await removeCartItem(key);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const formatPrice = (price?: string | number) => {
    if (!price) return "$0.00";
    const priceStr = typeof price === "string" ? price : price.toString();
    const cleaned = priceStr.replace(/[^0-9.]/g, "");
    let numPrice = parseFloat(cleaned);
    if (isNaN(numPrice)) return "$0.00";

    if (!cleaned.includes(".") && numPrice >= 100) {
      numPrice = numPrice / 100;
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numPrice);
  };

  if (!mounted) {
    return (
      <Container>
        <div className={styles.cartPage}>
          <h1 className={styles.title}>Cart</h1>
          <div className={styles.loading}>Loading cart...</div>
        </div>
      </Container>
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <Container>
        <div className={styles.cartPage}>
          <h1 className={styles.title}>Cart</h1>
          <div className={styles.emptyCart}>
            <p>Your cart is empty.</p>
            <Link href="/">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className={styles.cartPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Cart ({itemsCount} {itemsCount === 1 ? "item" : "items"})
          </h1>
          <Button
            variant="secondary"
            onClick={() => fetchCart()}
            disabled={loading}
            className={styles.refreshButton}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {items.map((item) => {
              const cartItem = item as StoreCartItem;
              const itemPrice =
                cartItem.prices?.price || cartItem.totals?.line_subtotal || "0";
              const priceStr =
                typeof itemPrice === "string"
                  ? itemPrice
                  : itemPrice.toString();
              const cleaned = priceStr.replace(/[^0-9.]/g, "");
              let itemPriceNum = parseFloat(cleaned);

              if (isNaN(itemPriceNum)) itemPriceNum = 0;

              if (!cleaned.includes(".") && itemPriceNum >= 100) {
                itemPriceNum = itemPriceNum / 100;
              }

              const subtotal = itemPriceNum * item.quantity;

              return (
                <div key={item.key} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <div className={styles.itemPrice}>
                      {formatPrice(itemPrice)}
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <label
                        htmlFor={`quantity-${item.key}`}
                        className={styles.quantityLabel}
                      >
                        Quantity
                      </label>
                      <input
                        id={`quantity-${item.key}`}
                        type="number"
                        min="1"
                        value={localQuantities[item.key] || item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.key,
                            parseInt(e.target.value, 10)
                          )
                        }
                        onBlur={() => handleUpdateQuantity(item.key)}
                        className={styles.quantityInput}
                        disabled={loading}
                      />
                    </div>

                    <div className={styles.itemSubtotal}>
                      {formatPrice(subtotal)}
                    </div>

                    <Button
                      variant="secondary"
                      onClick={() => handleRemoveItem(item.key)}
                      disabled={loading}
                      className={styles.removeButton}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.cartSummary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            {totals && (
              <div className={styles.totals}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(totals.total_items)}</span>
                </div>
                {totals.total_discount &&
                  parseFloat(totals.total_discount.replace(/[^0-9.]/g, "")) >
                    0 && (
                    <div className={styles.totalRow}>
                      <span>Discount</span>
                      <span className={styles.discount}>
                        -{formatPrice(totals.total_discount)}
                      </span>
                    </div>
                  )}
                {totals.total_shipping &&
                  parseFloat(totals.total_shipping.replace(/[^0-9.]/g, "")) >
                    0 && (
                    <div className={styles.totalRow}>
                      <span>Shipping</span>
                      <span>{formatPrice(totals.total_shipping)}</span>
                    </div>
                  )}
                {totals.total_tax &&
                  parseFloat(totals.total_tax.replace(/[^0-9.]/g, "")) > 0 && (
                    <div className={styles.totalRow}>
                      <span>Tax</span>
                      <span>{formatPrice(totals.total_tax)}</span>
                    </div>
                  )}
                <div className={`${styles.totalRow} ${styles.totalRowFinal}`}>
                  <span>Total</span>
                  <span className={styles.totalAmount}>
                    {formatPrice(totals.total_price)}
                  </span>
                </div>
              </div>
            )}

            <div className={styles.checkoutActions}>
              <Link href="/checkout" className={styles.checkoutLink}>
                <Button variant="primary" fullWidth>
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/">
                <Button variant="secondary" fullWidth>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
