"use client";

// eslint-disable-next-line no-restricted-imports
import { ReactNode, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";
import styles from "./Modal.module.css";

// Reason this component must be a client component:
// - Dialog element requires browser APIs (showModal(), close(), etc.)
// - Need refs to interact with the native dialog element
// - Event handlers for close functionality

type ModalProps = {
  children: ReactNode;
  open?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDialogElement>, "onClose">;

export default function Modal({
  children,
  open,
  onClose,
  showCloseButton = true,
  className = "",
  ...delegated
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Reason this component must use useEffect:
  // - Syncing with external browser API (HTMLDialogElement.showModal/close)
  // - Native <dialog> element requires imperative API calls
  // - This is a side effect that syncs React state with browser dialog state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  function handleClose() {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.close();
    onClose?.();
  }

  function handleBackdropClick(ev: React.MouseEvent<HTMLDialogElement>) {
    if (ev.target === dialogRef.current) {
      handleClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={clsx(styles.modal, className)}
      onClose={handleClose}
      onClick={handleBackdropClick}
      {...delegated}
    >
      <div className={styles.content}>
        {showCloseButton && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        )}
        {children}
      </div>
    </dialog>
  );
}

