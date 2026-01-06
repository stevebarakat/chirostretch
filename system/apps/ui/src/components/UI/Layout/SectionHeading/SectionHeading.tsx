import { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  heading?: string;
  subheading?: string;
  children?: ReactNode;
  color?: string;
};

export default function SectionHeading({
  heading,
  subheading,
  children,
  color = "var(--color-text-primary)",
}: SectionHeadingProps) {
  if (!heading && !children) return null;

  return (
    <div className={styles.wrapper}>
      {heading && (
        <h2 className={styles.heading} style={{ color }}>
          {heading}
        </h2>
      )}
      {subheading && (
        <p className={styles.subheading} style={{ color }}>
          {subheading}
        </p>
      )}
      {children}
    </div>
  );
}
