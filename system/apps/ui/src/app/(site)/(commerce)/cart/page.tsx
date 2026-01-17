"use client";

// eslint-disable-next-line no-restricted-imports
import { useEffect, useState, useCallback, startTransition } from "react";
import Link from "next/link";
import { RefreshCcw, Trash2 } from "lucide-react";
import { Container } from "@/components/UI";
import { Button } from "@/components/UI";
import { useCartStore } from "@/stores/useCartStore";
import type {
  StoreCartItem,
  StoreCartItemData,
} from "@/lib/commerce/getServerCart";
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

  // Reason this component must use useEffect:
  // - Syncing with external API (cart data) on component mount
  // - Server Components cannot handle client-side API calls
  // - Setting mounted state prevents hydration mismatch with server-rendered content
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
    loadCart();
  }, [loadCart]);

  // Reason this component must use useEffect:
  // - Syncing local form state with external cart store state
  // - Cart store is external state management (Zustand) that updates asynchronously
  // - This ensures local quantities stay in sync with server cart data
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

  const handleUpdateItem = async (key: string) => {
    await handleUpdateQuantity(key);
  };

  const hasQuantityChanged = (itemKey: string) => {
    const localQty = localQuantities[itemKey];
    const savedItem = items.find((item) => item.key === itemKey);
    return (
      savedItem && localQty !== undefined && localQty !== savedItem.quantity
    );
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
    const numPrice = parseFloat(cleaned);
    if (isNaN(numPrice)) return "$0.00";

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
            <Link href="/shop">
              <Button>Continue Shopping</Button>
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
        </div>

        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {items.map((item) => {
              const cartItem = item as StoreCartItem;
              const itemPrice: string =
                cartItem.prices?.price || cartItem.totals?.line_subtotal || "0";
              const cleaned = itemPrice.replace(/[^0-9.]/g, "");
              const itemPriceNum = parseFloat(cleaned) || 0;
              const subtotal = itemPriceNum * item.quantity;

              // Check if this is a booking product
              const isBooking = cartItem.type === "booking";

              // Get booking date/time from item_data
              const bookingDate = cartItem.item_data?.find(
                (d: StoreCartItemData) => d.name === "Booking Date"
              )?.value;
              const bookingTime = cartItem.item_data?.find(
                (d: StoreCartItemData) => d.name === "Booking Time"
              )?.value;

              return (
                <div key={item.key} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      {isBooking && (bookingDate || bookingTime) && (
                        <div className={styles.bookingDetails}>
                          {bookingDate && <span>{bookingDate}</span>}
                          {bookingDate && bookingTime && <span> at </span>}
                          {bookingTime && <span>{bookingTime}</span>}
                        </div>
                      )}
                    </div>
                    <div className={styles.itemPrice}>
                      {formatPrice(subtotal)}
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    {!isBooking && (
                      <>
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
                            className={styles.quantityInput}
                            disabled={loading}
                          />
                        </div>
                        <Button
                          color="secondary"
                          onClick={() => handleUpdateItem(item.key)}
                          disabled={loading || !hasQuantityChanged(item.key)}
                          className={styles.updateButton}
                        >
                          <RefreshCcw size={18} />
                          <span className={styles.buttonLabel}>Update</span>
                        </Button>
                      </>
                    )}

                    <Button
                      color="secondary"
                      onClick={() => handleRemoveItem(item.key)}
                      disabled={loading}
                      className={styles.removeButton}
                    >
                      <Trash2 size={18} />
                      <span className={styles.buttonLabel}>Remove</span>
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
                  <span>{formatPrice(totals.total_price)}</span>
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
              <Link href="/checkout">
                <Button fullWidth>Proceed to Checkout</Button>
              </Link>
              <Link href="/shop">
                <Button color="secondary" fullWidth>
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
