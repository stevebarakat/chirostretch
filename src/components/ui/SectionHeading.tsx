import { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  heading?: string;
  subheading?: string;
  children?: ReactNode;
};

export default function SectionHeading({
  heading,
  subheading,
  children,
}: SectionHeadingProps) {
  if (!heading && !children) return null;

  return (
    <div className={styles.wrapper}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      {subheading && <p className={styles.subheading}>{subheading}</p>}
      {children}
    </div>
  );
}

