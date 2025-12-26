import type { ReactNode } from "react";
import styles from "./Stack.module.css";

type Gap = "xs" | "sm" | "md" | "lg" | "xl";

type StackProps = {
  gap?: Gap;
  children: ReactNode;
};

export default function Stack({ gap = "md", children }: StackProps) {
  return (
    <div className={styles.stack} data-gap={gap}>
      {children}
    </div>
  );
}
