import { getServerCart } from "@/lib/woocommerce/getServerCart";
import type { StoreCartItem } from "@/lib/woocommerce/getServerCart";
import styles from "./OrderSummary.module.css";

function formatPrice(price?: string | number) {
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
}

export default async function OrderSummary() {
  const cart = await getServerCart();

  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }

  const items = cart.items;
  const totals = cart.totals;

  return (
    <div className={styles.orderSummary}>
      <h2 className={styles.summaryTitle}>Order Summary</h2>

      <div className={styles.items}>
        {items.map((item) => {
          const cartItem = item as StoreCartItem;
          const itemPrice =
            cartItem.prices?.price || cartItem.totals?.line_subtotal || "0";
          const priceStr =
            typeof itemPrice === "string" ? itemPrice : itemPrice.toString();
          const cleaned = priceStr.replace(/[^0-9.]/g, "");
          let itemPriceNum = parseFloat(cleaned);

          if (isNaN(itemPriceNum)) itemPriceNum = 0;

          if (!cleaned.includes(".") && itemPriceNum >= 100) {
            itemPriceNum = itemPriceNum / 100;
          }

          const subtotal = itemPriceNum * item.quantity;

          return (
            <div key={item.key} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemQuantity}>
                  Qty: {item.quantity}
                </span>
              </div>
              <div className={styles.itemSubtotal}>{formatPrice(subtotal)}</div>
            </div>
          );
        })}
      </div>

      {totals && (
        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>{formatPrice(totals.total_items)}</span>
          </div>
          {totals.total_discount &&
            parseFloat(totals.total_discount.replace(/[^0-9.]/g, "")) > 0 && (
              <div className={styles.totalRow}>
                <span>Discount</span>
                <span className={styles.discount}>
                  -{formatPrice(totals.total_discount)}
                </span>
              </div>
            )}
          {totals.total_shipping &&
            parseFloat(totals.total_shipping.replace(/[^0-9.]/g, "")) > 0 && (
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
    </div>
  );
}
