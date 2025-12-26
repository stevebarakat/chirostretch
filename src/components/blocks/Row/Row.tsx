import type { ReactNode } from "react";
import styles from "./Row.module.css";

type Gap = "xs" | "sm" | "md" | "lg" | "xl";
type Align = "start" | "center" | "end" | "between" | "around";

type RowProps = {
  gap?: Gap;
  align?: Align;
  wrap?: boolean;
  children: ReactNode;
};

export default function Row({
  gap = "md",
  align = "start",
  wrap = false,
  children,
}: RowProps) {
  return (
    <div
      className={styles.row}
      data-gap={gap}
      data-align={align}
      data-wrap={wrap ? "true" : undefined}
    >
      {children}
    </div>
  );
}
