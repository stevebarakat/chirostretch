import { getServerCart } from "@/lib/woocommerce/getServerCart";
import type { StoreCartItem } from "@/lib/woocommerce/getServerCart";
import { formatPrice, parsePrice } from "@/lib/utils/formatPrice";
import styles from "./OrderSummary.module.css";

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
          const itemPriceNum = parsePrice(itemPrice);
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
          {totals.total_discount && parsePrice(totals.total_discount) > 0 && (
            <div className={styles.totalRow}>
              <span>Discount</span>
              <span className={styles.discount}>
                -{formatPrice(totals.total_discount)}
              </span>
            </div>
          )}
          {totals.total_shipping && parsePrice(totals.total_shipping) > 0 && (
            <div className={styles.totalRow}>
              <span>Shipping</span>
              <span>{formatPrice(totals.total_shipping)}</span>
            </div>
          )}
          {totals.total_tax && parsePrice(totals.total_tax) > 0 && (
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
