"use client";

// eslint-disable-next-line no-restricted-imports
import { useEffect } from "react";
import { subscribeToToasts } from "@/lib/toast";
import { useToastContext } from "./ToastProvider";

export function ToastListener() {
  const { addToast } = useToastContext();

  // Reason this component must use useEffect:
  // - Subscribing to external event emitter (toast events from lib/toast)
  // - This is a side effect for syncing with external event system
  useEffect(() => {
    const unsubscribe = subscribeToToasts((payload) => {
      addToast({
        message: payload.message,
        title: payload.title,
        variant: payload.variant ?? "info",
        duration: payload.duration ?? 4000,
      });
    });

    return unsubscribe;
  }, [addToast]);

  return null;
}
