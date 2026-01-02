"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import styles from "./CartBadge.module.css";

type CartBadgeProps = {
  variant?: "default" | "inverse";
};

export default function CartBadge({ variant = "default" }: CartBadgeProps) {
  const itemCount = useCartStore((s) => s.itemsCount);
  const totals = useCartStore((s) => s.totals);

  return (
    <Link
      href="/cart"
      className={`${styles.badgeWrapper} ${variant === "inverse" ? styles.inverse : ""}`}
    >
      {totals?.total_items && (
        <span className={styles.price}>{formatPrice(totals.total_items)}</span>
      )}
      <div className={styles.icon}>
        <ShoppingCartIcon className="w-6 h-6" />
        {itemCount > 0 && <span className={styles.count}>{itemCount}</span>}
      </div>
    </Link>
  );
}
