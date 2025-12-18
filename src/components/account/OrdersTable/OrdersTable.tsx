import Link from "next/link";
import type { ViewerOrder } from "@/lib/graphql/queries/account";
import {
  formatOrderDate,
  formatOrderStatus,
  formatPrice,
} from "@/lib/utils/format";
import styles from "./OrdersTable.module.css";

type OrdersTableProps = {
  orders: ViewerOrder[];
};

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No orders found.</p>
        <Link href="/shop" className={styles.shopLink}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td data-label="Order">
                <span className={styles.orderNumber}>
                  #{order.orderNumber}
                </span>
              </td>
              <td data-label="Date">{formatOrderDate(order.date)}</td>
              <td data-label="Status">
                <span
                  className={`${styles.status} ${
                    styles[`status${order.status?.replace(/^wc-/, "") || ""}`]
                  }`}
                >
                  {formatOrderStatus(order.status)}
                </span>
              </td>
              <td data-label="Total">
                <span className={styles.total}>{formatPrice(order.total)}</span>
              </td>
              <td data-label="Actions">
                <Link
                  href={`/orders/${order.databaseId}`}
                  className={styles.viewLink}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
