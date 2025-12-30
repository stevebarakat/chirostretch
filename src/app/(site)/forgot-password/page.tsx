import type { Metadata } from "next";
import { Container } from "@/components/UI";
import { ForgotPasswordForm } from "@/components/Auth/ForgotPasswordForm";
import styles from "../login/page.module.css";

export const metadata: Metadata = {
  title: "Forgot Password | ChiroStretch",
  description: "Reset your ChiroStretch account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className={styles.loginPage}>
      <Container>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <h1 className={styles.title}>Forgot Password</h1>
            <p className={styles.subtitle}>
              We&apos;ll send you a link to reset your password
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </Container>
    </div>
  );
}
