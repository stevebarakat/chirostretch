import type { ReactNode } from "react";
import styles from "./ColumnsBlock.module.css";

type ColumnBlockProps = {
  width?: string;
  children: ReactNode;
};

export function ColumnBlock({ width, children }: ColumnBlockProps) {
  const style = width ? { flexBasis: width, maxWidth: width } : undefined;

  return (
    <div className={styles.column} style={style}>
      {children}
    </div>
  );
}

type ColumnsBlockProps = {
  isStackedOnMobile?: boolean;
  columnCount?: number;
  children: ReactNode;
};

export default function ColumnsBlock({
  isStackedOnMobile = true,
  columnCount,
  children,
}: ColumnsBlockProps) {
  const className = [
    styles.columns,
    isStackedOnMobile ? styles.stackedOnMobile : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={className}
      data-columns={columnCount && columnCount <= 4 ? columnCount : undefined}
    >
      {children}
    </div>
  );
}
