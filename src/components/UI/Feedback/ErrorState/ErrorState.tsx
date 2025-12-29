import styles from "./ErrorState.module.css";

type ErrorStateProps = {
  children: React.ReactNode;
  className?: string;
};

export function ErrorState({ children, className }: ErrorStateProps) {
  return (
    <div className={`${styles.error} ${className || ""}`}>
      <p>{children}</p>
    </div>
  );
}

