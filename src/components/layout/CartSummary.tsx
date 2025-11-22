"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/woocommerce/useCartStore";
import styles from "./CartSummary.module.css";

export default function CartSummary() {
  const itemsCount = useCartStore((s) => s.itemsCount);
  const totals = useCartStore((s) => s.totals);

  const totalPrice = totals?.total_price ? parseFloat(totals.total_price) : 0;
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(totalPrice);

  return (
    <Link href="/cart" className={styles.cartSummary}>
      <span className={styles.cartText}>
        {formattedPrice} {itemsCount} {itemsCount === 1 ? "item" : "items"}
      </span>
      <ShoppingCart className={styles.cartIcon} size={20} aria-hidden="true" />
    </Link>
  );
}
