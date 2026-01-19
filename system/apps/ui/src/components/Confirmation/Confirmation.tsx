import { Check } from "lucide-react";
import styles from "./Confirmation.module.css";

type ConfirmationProps = {
  heading: string;
  subtext: string;
  children?: React.ReactNode;
};

export function Confirmation({ heading, subtext, children }: ConfirmationProps) {
  return (
    <div className={styles.container}>
      <div className={styles.successIcon}>
        <Check size={40} strokeWidth={3} />
      </div>

      <h2 className={styles.heading}>{heading}</h2>
      <p className={styles.subtext}>{subtext}</p>

      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
