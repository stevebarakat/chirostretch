import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/UI";
import { SetPasswordForm } from "@/components/Auth/SetPasswordForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Set Your Password | ChiroStretch",
  description: "Create a password for your ChiroStretch account",
};

export default function SetPasswordPage() {
  return (
    <div className={styles.setPasswordPage}>
      <Container>
        <div className={styles.setPasswordContainer}>
          <div className={styles.setPasswordHeader}>
            <h1 className={styles.title}>Set Your Password</h1>
            <p className={styles.subtitle}>
              Create a secure password for your account
            </p>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <SetPasswordForm />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
