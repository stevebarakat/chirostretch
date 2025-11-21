"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/woocommerce/useCartStore";
import styles from "./CartBadge.module.css";

export default function CartBadge() {
  const itemCount = useCartStore((s) => s.itemsCount);

  return (
    <Link href="/cart" className={styles.badgeWrapper}>
      <div className={styles.icon}>🛒</div>

      {itemCount > 0 && <span className={styles.count}>{itemCount}</span>}
    </Link>
  );
}
