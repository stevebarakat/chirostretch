import type { ToastVariant } from "@/components/Primitives/Feedback/Toast";

type ToastPayload = {
  message: string;
  title?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastListener = (payload: ToastPayload) => void;

// Event-based toast system for use outside of React components
const listeners = new Set<ToastListener>();

function emit(payload: ToastPayload) {
  listeners.forEach((listener) => listener(payload));
}

export function subscribeToToasts(listener: ToastListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Duration by variant (ms)
const DURATION_BY_VARIANT: Record<ToastVariant, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 4000,
};

function createToast(
  variant: ToastVariant,
  messageOrPayload: string | Omit<ToastPayload, "variant">
) {
  const payload: ToastPayload =
    typeof messageOrPayload === "string"
      ? { message: messageOrPayload }
      : messageOrPayload;

  emit({
    ...payload,
    variant,
    duration: payload.duration ?? DURATION_BY_VARIANT[variant],
  });
}

export const toast = {
  success: (messageOrPayload: string | Omit<ToastPayload, "variant">) =>
    createToast("success", messageOrPayload),

  error: (messageOrPayload: string | Omit<ToastPayload, "variant">) =>
    createToast("error", messageOrPayload),

  warning: (messageOrPayload: string | Omit<ToastPayload, "variant">) =>
    createToast("warning", messageOrPayload),

  info: (messageOrPayload: string | Omit<ToastPayload, "variant">) =>
    createToast("info", messageOrPayload),
};
