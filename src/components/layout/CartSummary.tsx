"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/woocommerce/useCartStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import styles from "./CartSummary.module.css";

export default function CartSummary() {
  const itemsCount = useCartStore((s) => s.itemsCount);
  const totals = useCartStore((s) => s.totals);

  const formattedPrice = formatPrice(totals?.total_price);

  return (
    <Link href="/cart" className={styles.cartSummary}>
      <span className={styles.cartText}>
        {formattedPrice} {itemsCount} {itemsCount === 1 ? "item" : "items"}
      </span>
      <ShoppingCart className={styles.cartIcon} size={20} aria-hidden="true" />
    </Link>
  );
}
