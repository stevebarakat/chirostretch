import type { Metadata } from "next";
import { Container } from "@/components/UI";
import { LoginForm } from "@/components/Auth/LoginForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Login | ChiroStretch",
  description: "Sign in to your ChiroStretch account",
};

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <Container>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>
              Sign in to access your account and manage your orders
            </p>
          </div>

          <LoginForm />
        </div>
      </Container>
    </div>
  );
}
