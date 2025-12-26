import type { ReactNode, CSSProperties } from "react";
import styles from "./Grid.module.css";

type Gap = "xs" | "sm" | "md" | "lg" | "xl";

type GridProps = {
  columns?: number;
  columnsMd?: number;
  columnsLg?: number;
  gap?: Gap;
  children: ReactNode;
};

export default function Grid({
  columns = 1,
  columnsMd,
  columnsLg,
  gap = "md",
  children,
}: GridProps) {
  const style = {
    "--grid-cols": columns,
    "--grid-cols-md": columnsMd ?? columns,
    "--grid-cols-lg": columnsLg ?? columnsMd ?? columns,
  } as CSSProperties;

  return (
    <div className={styles.grid} data-gap={gap} style={style}>
      {children}
    </div>
  );
}
