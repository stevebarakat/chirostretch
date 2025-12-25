import type { ReactNode } from "react";
import styles from "./ColumnsBlock.module.css";

type ColumnBlockProps = {
  children: ReactNode;
};

export function ColumnBlock({ children }: ColumnBlockProps) {
  return <div className={styles.column}>{children}</div>;
}

type ColumnsBlockProps = {
  reverseMobile?: boolean;
  children: ReactNode;
};

export default function ColumnsBlock({
  reverseMobile = false,
  children,
}: ColumnsBlockProps) {
  return (
    <div
      className={styles.columns}
      data-reverse-mobile={reverseMobile ? "true" : undefined}
    >
      {children}
    </div>
  );
}
