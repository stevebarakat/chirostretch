"use client";

// eslint-disable-next-line no-restricted-imports
import { useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/woocommerce/useCartStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import styles from "./CartSummary.module.css";
import clsx from "clsx";

export default function CartSummary() {
  const itemsCount = useCartStore((s) => s.itemsCount);
  const totals = useCartStore((s) => s.totals);
  const fetchCart = useCartStore((s) => s.fetchCart);

  // Reason this component must use useEffect:
  // - Syncing with external API (cart data) on component mount
  // - Server Components cannot handle client-side API calls
  // - This ensures cart state is available for display
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const formattedPrice = formatPrice(totals?.total_items);

  return (
    <Link
      href="/cart"
      className={clsx(styles.cartSummary, styles.featuredCartSummary)}
    >
      <span className={styles.cartText}>
        {formattedPrice} {itemsCount} {itemsCount === 1 ? "item" : "items"}
      </span>
      <ShoppingCart className={styles.cartIcon} size={20} aria-hidden="true" />
    </Link>
  );
}
