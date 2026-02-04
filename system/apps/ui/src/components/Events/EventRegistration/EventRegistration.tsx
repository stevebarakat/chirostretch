"use client";

import { useState } from "react";
import { Button, Modal } from "@/components/Primitives";
import { CheckCircle } from "lucide-react";
import styles from "./EventRegistration.module.css";

export function EventRegistration() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleRegister() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(true);
    }, 1000);
  }

  return (
    <>
      <Button
        type="button"
        onClick={handleRegister}
        disabled={loading}
        fullWidth
        size="lg"
        color="primary"
        shadow
        className={styles.registerButton}
      >
        {loading ? (
          <span className={styles.spinner} aria-hidden />
        ) : (
          "Register Now"
        )}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        showCloseButton={false}
      >
        <div className={styles.successContent}>
          <div className={styles.successIcon}>
            <CheckCircle size={48} aria-hidden />
          </div>
          <h2 className={styles.successTitle}>Registration Confirmed!</h2>
          <p className={styles.successMessage}>
            We&apos;ve sent the event details and mobility prep guide to your
            email.
          </p>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            fullWidth
            size="md"
            color="secondary"
            className={styles.successButton}
          >
            Awesome!
          </Button>
        </div>
      </Modal>
    </>
  );
}
