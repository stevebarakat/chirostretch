"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import styles from "./Toast.module.css";

export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastProps = {
  id: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: (id: string) => void;
};

export function ToastItem({
  id,
  title,
  message,
  variant = "info",
  duration = 5000,
  onClose,
}: ToastProps) {
  return (
    <ToastPrimitive.Root
      className={`${styles.toast} ${styles[variant]}`}
      duration={duration}
      onOpenChange={(open) => {
        if (!open) {
          onClose(id);
        }
      }}
    >
      <div className={styles.content}>
        {title && (
          <ToastPrimitive.Title className={styles.title}>
            {title}
          </ToastPrimitive.Title>
        )}
        <ToastPrimitive.Description className={styles.description}>
          {message}
        </ToastPrimitive.Description>
      </div>
      <ToastPrimitive.Close className={styles.close} aria-label="Dismiss">
        <X size={16} />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}
