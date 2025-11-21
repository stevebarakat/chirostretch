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

  useEffect(() => {
    hydrateFromServer(initialCart);
  }, [hydrateFromServer, initialCart]);

  return <>{children}</>;
}
