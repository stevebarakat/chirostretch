"use client";

import { ReactNode, useEffect } from "react";
import { useCartStore } from "@/lib/woocommerce/useCartStore";
import type { StoreCart } from "@/lib/woocommerce/getServerCart";

type CartProviderProps = {
  initialCart: StoreCart | null;
  children: ReactNode;
};

export function CartProvider({ initialCart, children }: CartProviderProps) {
  const hydrateFromServer = useCartStore((state) => state.hydrateFromServer);

  // Reason this component must use useEffect:
  // - Syncing external server data (initialCart) with client state store
  // - Server Components cannot directly update client state
  // - This is a one-time hydration that must run after mount
  useEffect(() => {
    hydrateFromServer(initialCart);
  }, [hydrateFromServer, initialCart]);

  return <>{children}</>;
}
