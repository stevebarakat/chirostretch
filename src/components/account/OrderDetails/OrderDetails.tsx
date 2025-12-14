import Link from "next/link";
import type { OrderDetails as OrderDetailsType } from "@/lib/graphql/queries/account";
import {
  formatOrderDate,
  formatOrderStatus,
  formatPrice,
} from "@/lib/utils/format";
import styles from "./OrderDetails.module.css";

type OrderDetailsProps = {
  order: OrderDetailsType;
};

export function OrderDetails({ order }: OrderDetailsProps) {
  const statusClass = order.status?.replace(/^wc-/, "") || "";

  return (
    <div className={styles.orderDetails}>
      <Link href="/my-account/orders" className={styles.backLink}>
        ← Back to Orders
      </Link>

      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <p className={styles.orderDate}>{formatOrderDate(order.date)}</p>
          <span className={`${styles.status} ${styles[`status${statusClass}`]}`}>
            {formatOrderStatus(order.status)}
          </span>
        </div>
        {order.paymentMethodTitle && (
          <p className={styles.paymentMethod}>
            Paid via {order.paymentMethodTitle}
          </p>
        )}
      </div>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Order Items</h2>
          <div className={styles.itemsTable}>
            <div className={styles.itemsHeader}>
              <span>Product</span>
              <span>Qty</span>
              <span>Total</span>
            </div>
            {order.lineItems?.nodes?.map((item, index) => (
              <div key={index} className={styles.item}>
                <span className={styles.itemName}>
                  {item.product?.node?.slug ? (
                    <Link href={`/shop/${item.product.node.slug}`}>
                      {item.product?.node?.name || "Product"}
                    </Link>
                  ) : (
                    item.product?.node?.name || "Product"
                  )}
                </span>
                <span className={styles.itemQty}>×{item.quantity || 1}</span>
                <span className={styles.itemTotal}>
                  {formatPrice(item.total)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Order Summary</h2>
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.shippingLines?.nodes?.map((shipping, index) => (
              <div key={index} className={styles.summaryRow}>
                <span>Shipping ({shipping.methodTitle})</span>
                <span>{formatPrice(shipping.total)}</span>
              </div>
            ))}
            {order.totalTax && parseFloat(order.totalTax) > 0 && (
              <div className={styles.summaryRow}>
                <span>Tax</span>
                <span>{formatPrice(order.totalTax)}</span>
              </div>
            )}
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </section>

        <div className={styles.addresses}>
          {order.billing && (
            <section className={styles.addressSection}>
              <h2 className={styles.sectionTitle}>Billing Address</h2>
              <address className={styles.address}>
                <p>
                  {order.billing.firstName} {order.billing.lastName}
                </p>
                {order.billing.company && <p>{order.billing.company}</p>}
                <p>{order.billing.address1}</p>
                {order.billing.address2 && <p>{order.billing.address2}</p>}
                <p>
                  {order.billing.city}, {order.billing.state}{" "}
                  {order.billing.postcode}
                </p>
                <p>{order.billing.country}</p>
                {order.billing.phone && (
                  <p className={styles.contactInfo}>{order.billing.phone}</p>
                )}
                {order.billing.email && (
                  <p className={styles.contactInfo}>{order.billing.email}</p>
                )}
              </address>
            </section>
          )}

          {order.shipping && (
            <section className={styles.addressSection}>
              <h2 className={styles.sectionTitle}>Shipping Address</h2>
              <address className={styles.address}>
                <p>
                  {order.shipping.firstName} {order.shipping.lastName}
                </p>
                {order.shipping.company && <p>{order.shipping.company}</p>}
                <p>{order.shipping.address1}</p>
                {order.shipping.address2 && <p>{order.shipping.address2}</p>}
                <p>
                  {order.shipping.city}, {order.shipping.state}{" "}
                  {order.shipping.postcode}
                </p>
                <p>{order.shipping.country}</p>
              </address>
            </section>
          )}
        </div>

        {order.customerNote && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Notes</h2>
            <p className={styles.note}>{order.customerNote}</p>
          </section>
        )}
      </div>
    </div>
  );
}
