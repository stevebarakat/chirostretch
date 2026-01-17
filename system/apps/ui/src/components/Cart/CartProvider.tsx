"use client";

// eslint-disable-next-line no-restricted-imports
import { ReactNode, useEffect } from "react";
import { useCartStore } from "@/stores/useCartStore";

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const hydrateFromLocalStorage = useCartStore(
    (state) => state.hydrateFromLocalStorage
  );

  // Reason this component must use useEffect:
  // - Syncing localStorage data with client state store
  // - This is a one-time hydration that must run after mount to avoid hydration mismatch
  useEffect(() => {
    hydrateFromLocalStorage();
  }, [hydrateFromLocalStorage]);

  return <>{children}</>;
}
