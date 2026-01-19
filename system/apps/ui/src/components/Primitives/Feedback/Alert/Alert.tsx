import styles from "./Alert.module.css";

type AlertVariant = "error" | "success" | "warning" | "info";

type AlertProps = {
  variant?: AlertVariant;
  children: React.ReactNode;
  className?: string;
};

export function Alert({ variant = "error", children, className }: AlertProps) {
  return (
    <div
      className={`${styles.alert} ${styles[variant]} ${className || ""}`}
      role="alert"
    >
      {children}
    </div>
  );
}
