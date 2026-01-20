"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
// Toast notifications don't have native HTML equivalents (unlike dialog/details/popover)
// Radix UI provides necessary accessibility and behavior for toast notifications
// eslint-disable-next-line no-restricted-syntax
import * as ToastPrimitive from "@radix-ui/react-toast";
import { ToastItem, type ToastVariant } from "./Toast";
import styles from "./Toast.module.css";

const MAX_VISIBLE_TOASTS = 3;
const DEDUPE_WINDOW_MS = 2000;

type ToastData = {
  id: string;
  message: string;
  title?: string;
  variant: ToastVariant;
  duration: number;
};

type ToastContextValue = {
  addToast: (toast: Omit<ToastData, "id">) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const recentMessages = useRef<Map<string, number>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastData, "id">) => {
    const now = Date.now();
    const messageKey = `${toast.variant}:${toast.message}`;
    const lastShown = recentMessages.current.get(messageKey);

    // Dedupe same message within window
    if (lastShown && now - lastShown < DEDUPE_WINDOW_MS) {
      return;
    }

    recentMessages.current.set(messageKey, now);

    // Clean up old entries periodically
    if (recentMessages.current.size > 50) {
      const cutoff = now - DEDUPE_WINDOW_MS;
      for (const [key, time] of recentMessages.current.entries()) {
        if (time < cutoff) {
          recentMessages.current.delete(key);
        }
      }
    }

    const id = `toast-${now}-${Math.random().toString(36).slice(2, 9)}`;

    setToasts((prev) => {
      const newToasts = [...prev, { ...toast, id }];
      // Keep only max visible toasts (remove oldest if needed)
      if (newToasts.length > MAX_VISIBLE_TOASTS) {
        return newToasts.slice(-MAX_VISIBLE_TOASTS);
      }
      return newToasts;
    });
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            id={toast.id}
            message={toast.message}
            title={toast.title}
            variant={toast.variant}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
        <ToastPrimitive.Viewport className={styles.viewport} />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
