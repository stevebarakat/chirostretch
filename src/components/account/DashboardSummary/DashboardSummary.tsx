import Link from "next/link";
import type { ViewerOrder } from "@/lib/graphql/queries/account";
import {
  formatOrderDate,
  formatOrderStatus,
  formatPrice,
} from "@/lib/woocommerce/account";
import styles from "./DashboardSummary.module.css";

type DashboardSummaryProps = {
  firstName?: string | null;
  recentOrders: ViewerOrder[];
};

export function DashboardSummary({
  firstName,
  recentOrders,
}: DashboardSummaryProps) {
  return (
    <div className={styles.summary}>
      <div className={styles.greeting}>
        <h2 className={styles.greetingTitle}>
          Hello {firstName || "there"}!
        </h2>
        <p className={styles.greetingText}>
          From your account dashboard you can view your{" "}
          <Link href="/my-account/orders">recent orders</Link>, manage your{" "}
          <Link href="/my-account/addresses">shipping and billing addresses</Link>
          , and{" "}
          <Link href="/my-account/account-details">
            edit your password and account details
          </Link>
          .
        </p>
      </div>

      {recentOrders.length > 0 && (
        <div className={styles.recentOrders}>
          <h3 className={styles.sectionTitle}>Recent Orders</h3>
          <div className={styles.ordersGrid}>
            {recentOrders.slice(0, 3).map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <span className={styles.orderNumber}>
                    #{order.orderNumber}
                  </span>
                  <span
                    className={`${styles.orderStatus} ${
                      styles[`status${order.status?.replace(/^wc-/, "") || ""}`]
                    }`}
                  >
                    {formatOrderStatus(order.status)}
                  </span>
                </div>
                <div className={styles.orderDetails}>
                  <p className={styles.orderDate}>
                    {formatOrderDate(order.date)}
                  </p>
                  <p className={styles.orderTotal}>
                    Total: {formatPrice(order.total)}
                  </p>
                </div>
                <Link
                  href={`/my-account/orders/${order.databaseId}`}
                  className={styles.orderLink}
                >
                  View Order
                </Link>
              </div>
            ))}
          </div>
          <Link href="/my-account/orders" className={styles.viewAllLink}>
            View all orders
          </Link>
        </div>
      )}
    </div>
  );
}
